// app/warehouse/update-stock/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import UpdateStock from '@/components/warehouse/UpdateStock';
import { api } from "@/app/lib/api";

function unwrapList<T = any>(json: any): T[] {
    if (Array.isArray(json)) return json;
    if (Array.isArray(json?.data)) return json.data;
    return [];
}

export async function fetchStock() {
    const json = await api.get("/warehouse/update/stock");
    return unwrapList(json);
}

export default function UpdateStockPage() {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['stockList'],
        queryFn: fetchStock,
    });

    return (
        <div className="p-2">
            <UpdateStock
                data={data ?? []}
                loading={isLoading}
                onReload={refetch}
            />
        </div>
    );
}
