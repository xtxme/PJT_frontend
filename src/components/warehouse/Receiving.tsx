'use client';

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@mui/material";
import color from "@/app/styles/color";

// ---- Types ----
type OpenReceiveItem = {
    batch_id: number;
    item_id: number;
    product_id: string;
    name: string;
    ordered_qty: number;
    received_qty: number;
    remain: number;
    unit_cost: string;
    supplier_id: number | null;
    expected_date: string | null;
    status: string;
};

// ---- Fetcher ----
async function fetchOpenReceives(): Promise<OpenReceiveItem[]> {
    const res = await fetch("/warehouse/stock-in/open", { cache: "no-store" });
    if (!res.ok) throw new Error("โหลดรายการค้างรับไม่สำเร็จ");
    const json = await res.json();
    return Array.isArray(json) ? json : json.data ?? [];
}

// ---- Component ----
export default function Receiving() {
    const { data: openItems = [], isLoading, isError, refetch } = useQuery({
        queryKey: ["warehouse", "stock-in-open"],
        queryFn: fetchOpenReceives,
        staleTime: 20_000,
        refetchOnWindowFocus: false,
    });

    const [receiveQtys, setReceiveQtys] = useState<Record<number, number>>({});

    const updateQty = (item_id: number, value: string) => {
        const num = Number(value);
        setReceiveQtys((prev) => ({
            ...prev,
            [item_id]: Number.isFinite(num) && num >= 0 ? num : 0,
        }));
    };

    // ---- Mutation: รับของ ----
    const { mutate: receiveItem, isPending } = useMutation({
        mutationFn: async (payload: { itemId: number; qty: number }) => {
            const res = await fetch(`/warehouse/stock-in/items/${payload.itemId}/receive`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ receive_qty: payload.qty }),
            });
            if (!res.ok) {
                const j = await res.json().catch(() => null);
                throw new Error(j?.message ?? "รับของไม่สำเร็จ");
            }
            return res.json();
        },
        onSuccess: () => {
            refetch();
        },
    });

    // ---- Group by Batch ----
    const batches = Object.values(
        openItems.reduce((acc, item) => {
            if (!acc[item.batch_id]) acc[item.batch_id] = { batch_id: item.batch_id, items: [] as OpenReceiveItem[] };
            acc[item.batch_id].items.push(item);
            return acc;
        }, {} as Record<number, { batch_id: number; items: OpenReceiveItem[] }>)
    );

    return (
        <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-3">รับสินค้า</h3>

            {isLoading && (
                <p className="text-gray-500 text-sm text-center py-8">กำลังโหลดข้อมูล…</p>
            )}
            {isError && (
                <p className="text-red-500 text-sm text-center py-8">
                    โหลดข้อมูลไม่สำเร็จ
                    <button onClick={() => refetch()} className="underline ml-1">ลองอีกครั้ง</button>
                </p>
            )}

            {!isLoading && !isError && batches.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-8">ไม่มีรายการค้างรับ</p>
            )}

            {batches.map((batch) => (
                <div key={batch.batch_id} className="border rounded-lg mb-5 overflow-hidden" style={{ borderColor: color.colors.orange }}>
                    <div className="px-4 py-2 font-medium text-white" style={{ backgroundColor: color.colors.orange }}>
                        บิล #{batch.batch_id}
                    </div>

                    {batch.items.map((item) => {
                        const current = receiveQtys[item.item_id] ?? item.remain;
                        const remain = item.remain;
                        return (
                            <div
                                key={item.item_id}
                                className="flex justify-between items-center px-4 py-3 border-t text-sm"
                            >
                                <div>
                                    <p className="font-medium text-gray-800">{item.name}</p>
                                    <p className="text-gray-500">
                                        ค้างรับ {remain} / สั่ง {item.ordered_qty}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min={1}
                                        max={remain}
                                        value={current}
                                        onChange={(e) => updateQty(item.item_id, e.target.value)}
                                        className="w-20 border border-gray-300 rounded-md p-1 text-right text-sm"
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        disabled={isPending || current <= 0}
                                        onClick={() => receiveItem({ itemId: item.item_id, qty: current })}
                                        sx={{
                                            px: 2.5,
                                            py: 0.6,
                                            borderRadius: "8px",
                                            textTransform: "none",
                                        }}
                                    >
                                        รับสินค้า
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
