'use client';

import React, { useRef, useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query';
import StockNoti from "@/components/warehouse/StockNoti";
import ProductAdjust from "@/components/warehouse/ProductAdjust";
import Receiving from "@/components/warehouse/Receiving";
import RestockCart from "@/components/warehouse/RestockCart";

/* ----------------------------- Types ----------------------------- */
type LowStockFilters = {
    lte?: number | null;
    status?: Array<'low_stock' | 'restock_pending' | 'pricing_pending' | 'active'>;
    match?: 'any' | 'all';
    q?: string;
    category_id?: number | null;
    sort?: 'name.asc' | 'name.desc' | 'updated_at.asc' | 'updated_at.desc';
    page?: number;
    pageSize?: number;
};

type LowStockNoti = {
    id: string;
    date: string;
    product: string;
    pending: number;
    status: string;
};

type Category = { id: number; name: string };

/* ----------------------------- Fetchers ----------------------------- */
async function fetchLowStockNotis(filters: LowStockFilters) {
    const sp = new URLSearchParams({
        lte: String(filters.lte ?? 10),
        status: (filters.status ?? ['low_stock']).join(','),
        match: filters.match ?? 'any',
        sort: filters.sort ?? 'updated_at.desc',
        page: String(filters.page ?? 1),
        pageSize: String(filters.pageSize ?? 20),
    });

    const res = await fetch(`/warehouse/products/low-stock?${sp.toString()}`, { cache: 'no-store' });
    const json = await res.json();
    const rows = Array.isArray(json) ? json : json.data ?? [];
    const mapped = rows
        .filter((p: any) => (p.quantity_pending ?? 0) === 0)
        .map((p: any) => ({
            id: String(p.id),
            date: (p.updated_at ?? p.created_at ?? new Date().toISOString()).slice(0, 10),
            product: p.name,
            pending: p.quantity_pending ?? 0,
            status:
                p.product_status === 'low_stock'
                    ? 'เหลือน้อย'
                    : p.product_status === 'restock_pending'
                        ? 'รอรับ'
                        : 'ปกติ',
        }));
    return { data: mapped, total: json.total ?? mapped.length };
}

async function fetchCategories(): Promise<Category[]> {
    const res = await fetch('/warehouse/categories?page=1&pageSize=500', { cache: 'no-store' });
    const json = await res.json();
    return Array.isArray(json) ? json : json.data ?? [];
}

/* ----------------------------- Inner Page ----------------------------- */
function StockInInner() {
    const queryClient = useQueryClient();

    const [lowStockFilters] = useState<LowStockFilters>({
        status: ['low_stock'],
        match: 'any',
        sort: 'updated_at.desc',
        page: 1,
        pageSize: 20,
    });

    const { data: lowStockPayload, isLoading, isError, refetch } = useQuery({
        queryKey: ['warehouse', 'low-stock', lowStockFilters],
        queryFn: () => fetchLowStockNotis(lowStockFilters),
    });

    const notifications: LowStockNoti[] = lowStockPayload?.data ?? [];
    const addToCartRef = useRef<null | ((p: { product_id: string; name: string; pending?: number }) => void)>(null);

    const handleActionFromNoti = (item: { product_id: string; name: string; pending?: number }) => {
        addToCartRef.current?.(item);
        queryClient.setQueryData(['warehouse', 'low-stock', lowStockFilters], (old: any) => {
            if (!old) return old;
            return { ...old, data: old.data.filter((n: LowStockNoti) => n.id !== String(item.product_id)) };
        });
    };

    const {
        data: categories = [],
        isFetching: loadingCategories,
    } = useQuery({
        queryKey: ['warehouse', 'categories'],
        queryFn: fetchCategories,
    });

    // --- adapter ให้ลูกใช้ setCategories(prev => next) อัปเดต cache ของ React Query ---
    const setCategories: React.Dispatch<React.SetStateAction<Category[]>> = (updater) => {
        queryClient.setQueryData(['warehouse', 'categories'], (old: Category[] | undefined) => {
            const base = Array.isArray(old) ? old : [];
            return typeof updater === 'function' ? (updater as any)(base) : updater;
        });
    };

    return (
        <div className="p-2">
            <StockNoti notis={notifications} onActionAction={handleActionFromNoti} />

            <div className="mt-4">
                <RestockCart
                    onRegisterAddAction={(fn) => (addToCartRef.current = fn)}
                    onCreatedAction={() => refetch()}
                />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
                <ProductAdjust
                    categories={categories}
                    loadingCategories={loadingCategories}
                    onReloadCategories={() =>
                        queryClient.invalidateQueries({ queryKey: ['warehouse', 'categories'] })
                    }
                    setCategories={setCategories}
                />
                <Receiving />
            </div>
        </div>
    );
}

export default function StockInPage() {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <QueryClientProvider client={queryClient}>
            <StockInInner />
        </QueryClientProvider>
    );
}
