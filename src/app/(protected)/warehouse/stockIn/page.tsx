'use client';

import React, { useRef, useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query';
import StockNoti from "@/components/warehouse/StockNoti";
import ProductAdjust from "@/components/warehouse/ProductAdjust";
import Receiving from "@/components/warehouse/Receiving";
import RestockCart from "@/components/warehouse/RestockCart";
import {Category, LowStockNoti, OpenReceiveItem} from "@/app/types/warehouse";

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

/* ----------------------------- Fetchers ----------------------------- */
async function fetchLowStockNotis(filters: LowStockFilters) {
    const sp = new URLSearchParams({
        lte: String(filters.lte ?? 9),
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
            quantity: p.quantity,
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

/* ← ย้ายมาอยู่ที่หน้านี้ */
async function fetchOpenReceives(): Promise<OpenReceiveItem[]> {
    const res = await fetch("/warehouse/stock-in/open", { cache: "no-store" });
    if (!res.ok) throw new Error("โหลดรายการค้างรับไม่สำเร็จ");
    const json = await res.json();
    return Array.isArray(json) ? json : json.data ?? [];
}

/* ----------------------------- Inner Page ----------------------------- */
function StockInInner() {
    const queryClient = useQueryClient();

    // ✅ เก็บ id ที่ถูกเลือกจากแจ้งเตือน
    const [selectedNotiIds, setSelectedNotiIds] = useState<Set<string>>(new Set());

    const [lowStockFilters] = useState<LowStockFilters>({
        status: ['low_stock'],
        match: 'any',
        sort: 'updated_at.desc',
        page: 1,
        pageSize: 20,
    });

    const { data: lowStockPayload, refetch: refetchLowStock } = useQuery({
        queryKey: ['warehouse', 'low-stock', lowStockFilters],
        queryFn: () => fetchLowStockNotis(lowStockFilters),
    });

    const notifications: LowStockNoti[] = lowStockPayload?.data ?? [];

    // ✅ รับฟังก์ชัน add/remove จากตะกร้า
    const addToCartRef = useRef<null | ((p: { product_id: string; name: string; pending?: number; quantity?:number }) => void)>(null);
    const removeFromCartRef = useRef<null | ((product_id: string) => void)>(null);

    // ✅ toggle การเลือกจากการ์ดแจ้งเตือน
    const handleToggleFromNoti = (item: { product_id: string; name: string; pending?: number; quantity?: number }) => {
        const id = String(item.product_id);
        setSelectedNotiIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                // เคยเลือกไว้แล้ว ➜ เอาออกจากตะกร้า + ยกเลิกเลือก
                removeFromCartRef.current?.(id);
                next.delete(id);
            } else {
                // ยังไม่เลือก ➜ ใส่เข้าตะกร้า + ทำเครื่องหมายเลือก
                addToCartRef.current?.(item);
                next.add(id);
            }
            return next;
        });
    };

    const {
        data: categories = [],
        isFetching: loadingCategories,
    } = useQuery({
        queryKey: ['warehouse', 'categories'],
        queryFn: fetchCategories,
    });

    const setCategories: React.Dispatch<React.SetStateAction<Category[]>> = (updater) => {
        queryClient.setQueryData(['warehouse', 'categories'], (old: Category[] | undefined) => {
            const base = Array.isArray(old) ? old : [];
            return typeof updater === 'function' ? (updater as any)(base) : updater;
        });
    };

    /* ---------------- Open Receives ---------------- */
    const {
        data: openItems = [],
        isLoading: openIsLoading,
        isError: openIsError,
        refetch: refetchOpen,
    } = useQuery({
        queryKey: ["warehouse", "stock-in-open"],
        queryFn: fetchOpenReceives,
        staleTime: 20_000,
        refetchOnWindowFocus: true,
        refetchInterval: 10_000,
        refetchIntervalInBackground: true,
    });

    return (
        <div className="p-2">
            <StockNoti
                notis={notifications}
                // ✅ ส่ง selected set + toggle handler
                selectedIds={selectedNotiIds}
                onToggleSelect={handleToggleFromNoti}
                onRefresh={() => { refetchLowStock(); }}
            />

            <div className="mt-4">
                <RestockCart
                    onRegisterAddAction={(fn) => (addToCartRef.current = fn)}
                    onRegisterRemoveAction={(fn) => (removeFromCartRef.current = fn)}
                    onCreatedAction={({ batch_id }) => {
                        // ✅ เคลียร์สถานะการถูกเลือกทั้งหมด
                        setSelectedNotiIds(new Set());
                        // (ถ้าต้องการดึงแจ้งเตือนใหม่ต่อ)
                        refetchLowStock();
                    }}
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

                <Receiving
                    openItems={openItems}
                    isLoading={openIsLoading}
                    isError={openIsError}
                    refetch={refetchOpen}
                />
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
