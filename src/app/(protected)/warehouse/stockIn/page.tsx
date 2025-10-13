'use client';

import { useRef, useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import StockNoti from "@/components/warehouse/StockNoti";
import PurchaseInvoice from "@/components/warehouse/PurchaseInvoice";
import Receiving from "@/components/warehouse/Receiving";
import RestockCart from "@/components/warehouse/RestockCart";

/* ----------------------------- Types ----------------------------- */
type LowStockFilters = {
    lte?: number | null;
    status?: Array<'low_stock' | 'restock_pending' | 'pricing_pending' | 'active'>;
    match?: 'any' | 'all';
    q?: string;
    category_id?: number | null;
    sort?: 'name.asc' | 'name.desc' | 'updated_at.asc' | 'updated_at.desc' | 'created_at.asc' | 'created_at.desc' | 'quantity.asc' | 'quantity.desc';
    page?: number;
    pageSize?: number;
};

type LowStockApiRow = {
    id: string;
    name: string;
    quantity?: number;
    quantity_pending?: number;
    product_status: 'active' | 'low_stock' | 'restock_pending' | 'pricing_pending';
    created_at?: string | null;
    updated_at?: string | null;
};

type Category = { id: number; name: string };

type LowStockNoti = {
    id: string;              // ← บังคับเป็น string
    date: string;
    product: string;
    pending: number;        // ตัวเลขล้วน
    status: string;          // 'เหลือน้อย' | 'รอรับ' | ...
    sku?: string;
    price?: number;
};

/* ----------------------------- Fetchers ----------------------------- */
async function fetchLowStockNotis(filters: LowStockFilters): Promise<{
    data: LowStockNoti[];
    total: number;
    page: number;
    pageSize: number;
}> {
    const {
        lte = null,
        status = ['low_stock'],   // ✅ กัน 400 จาก backend
        match = 'any',
        q = '',
        category_id = null,
        sort = 'updated_at.desc',
        page = 1,
        pageSize = 20,
    } = filters;

    const sp = new URLSearchParams();
    if (lte != null) sp.set('lte', String(lte));
    if (status.length) sp.set('status', status.join(','));
    if (match) sp.set('match', match);
    if (q) sp.set('q', q);
    if (category_id != null) sp.set('category_id', String(category_id));
    if (sort) sp.set('sort', sort);
    sp.set('page', String(page));
    sp.set('pageSize', String(pageSize));

    const res = await fetch(`/warehouse/products/low-stock?${sp.toString()}`, { cache: 'no-store' });
    if (!res.ok) {
        const msg = await res.text().catch(() => '');
        throw new Error(msg || 'โหลดข้อมูลสินค้าใกล้หมดไม่สำเร็จ');
    }
    const json = await res.json();

    const rows: LowStockApiRow[] = Array.isArray(json) ? json : (json.data ?? []);
    const mapped: LowStockNoti[] = rows.map((p) => ({
        id: String(p.id),
        date: ((p.updated_at ?? p.created_at) ?? new Date().toISOString()).slice(0, 10),
        product: p.name,
        pending: p.quantity_pending ?? 0,
        status:
            p.product_status === 'low_stock' ? 'เหลือน้อย'
                : p.product_status === 'restock_pending' ? 'รอรับ'
                    : p.product_status === 'pricing_pending' ? 'รอปรับราคา'
                        : 'ปกติ',
    }));

    return {
        data: mapped,
        total: json.total ?? mapped.length,
        page: json.page ?? page,
        pageSize: json.pageSize ?? pageSize,
    };
}

async function fetchCategories(): Promise<Category[]> {
    const res = await fetch('/warehouse/categories?page=1&pageSize=500', { cache: 'no-store' });
    if (!res.ok) throw new Error('โหลดหมวดหมู่ไม่สำเร็จ');
    const json = await res.json();
    const rows: Category[] = Array.isArray(json) ? json : (json.data ?? []);
    return rows;
}

/* ----------------------------- Inner Page ----------------------------- */
function StockInInner() {
    // ฟิลเตอร์สำหรับ low-stock (ต้องมี status/lte เสมอ)
    const [lowStockFilters] = useState<LowStockFilters>({
        status: ['low_stock'],
        match: 'any',
        sort: 'updated_at.desc',
        page: 1,
        pageSize: 20,
    });

    // แจ้งเตือนสินค้าใกล้หมด
    const {
        data: lowStockPayload,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ['warehouse', 'low-stock', lowStockFilters],
        queryFn: () => fetchLowStockNotis(lowStockFilters),
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    });

    const notifications: LowStockNoti[] = lowStockPayload?.data ?? [];

    // หมวดหมู่
    const {
        data: categories = [],
        isLoading: loadingCats,
        isError: catError,
        refetch: refetchCats,
    } = useQuery({
        queryKey: ['warehouse', 'categories'],
        queryFn: fetchCategories,
        staleTime: 5 * 60_000,
        refetchOnWindowFocus: false,
    });

    // เชื่อมกับตะกร้าสั่งของ
    const addToCartRef = useRef<null | ((p: { product_id: string; name: string; pending?: number }) => void)>(null);

    const handleActionFromNoti = (row: LowStockNoti) => {
        addToCartRef.current?.({
            product_id: String(row.id),
            name: row.product,
            pending: row.pending,
        });
    };

    return (
        <div className="p-2">
            {/* --- Notifications Section --- */}
            <div className="flex items-center gap-3 mb-2">
                {isLoading && <span className="text-sm opacity-70">กำลังโหลดแจ้งเตือนสต๊อก…</span>}
                {isError && (
                    <button onClick={() => refetch()} className="text-sm underline">
                        โหลดไม่สำเร็จ — ลองอีกครั้ง
                    </button>
                )}
            </div>

            <StockNoti notis={notifications} onAction={handleActionFromNoti} />

            {/* --- Restock Cart (สร้างบิลสั่งเข้า) --- */}
            <div className="mt-4">
                <RestockCart
                    onRegisterAddAction={(fn) => { addToCartRef.current = fn; }}
                    onCreatedAction={({ batch_id }) => {
                        refetch();       // รีโหลด low-stock หลังสั่งเข้า
                    }}
                />
            </div>

            {/* --- PurchaseInvoice & Receiving --- */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <PurchaseInvoice
                    categories={categories}
                    loadingCategories={loadingCats}
                    onReloadCategories={refetchCats}
                />
                <Receiving />
            </div>

            {catError && (
                <div className="mt-3 text-sm">
                    ไม่สามารถโหลดหมวดหมู่
                    <button className="underline" onClick={() => refetchCats()}>ลองใหม่</button>
                </div>
            )}
        </div>
    );
}

/* ----------------------------- Root Page ----------------------------- */
export default function StockInPage() {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <QueryClientProvider client={queryClient}>
            <StockInInner />
        </QueryClientProvider>
    );
}
