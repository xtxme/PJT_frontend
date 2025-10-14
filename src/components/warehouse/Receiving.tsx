'use client';

import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button, IconButton, Tooltip } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import color from "@/app/styles/color";
import type { OpenReceiveItem } from "@/app/types/warehouse";

type Props = {
    openItems: OpenReceiveItem[];
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
};

export default function Receiving({ openItems, isLoading, isError, refetch }: Props) {
    const [receiveQtys, setReceiveQtys] = useState<Record<number, number>>({});
    const [itemsView, setItemsView] = useState<OpenReceiveItem[]>(openItems);

    useEffect(() => {
        setItemsView(openItems);
    }, [openItems]);

    const updateQty = (item_id: number, value: string) => {
        const num = Number(value);
        setReceiveQtys((prev) => ({
            ...prev,
            [item_id]: Number.isFinite(num) && num >= 0 ? num : 0,
        }));
    };

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
        onMutate: ({ itemId, qty }) => {
            const prev = itemsView;
            const next = prev
                .map((it) => {
                    if (it.item_id !== itemId) return it;
                    const dec = Math.min(qty, it.remain);
                    return {
                        ...it,
                        received_qty: it.received_qty + dec,
                        remain: Math.max(0, it.remain - dec),
                    };
                })
                .filter((it) => it.remain > 0);
            setItemsView(next);
            return { prev };
        },
        onError: (_err, _vars, ctx) => {
            if (ctx?.prev) setItemsView(ctx.prev);
        },
        onSettled: () => {
            refetch();
        },
    });

    const batches = useMemo(() => {
        return Object.values(
            itemsView.reduce((acc, item) => {
                if (!acc[item.batch_id]) acc[item.batch_id] = { batch_id: item.batch_id, items: [] as OpenReceiveItem[] };
                acc[item.batch_id].items.push(item);
                return acc;
            }, {} as Record<number, { batch_id: number; items: OpenReceiveItem[] }>)
        );
    }, [itemsView]);

    return (
        <div className="bg-white rounded-xl shadow p-4">
            {/* ── Header + Refresh ───────────────────────────────────────── */}
            <div className="flex items-center mb-3">
                <h3 className="font-semibold">รับสินค้า</h3>
                <Tooltip title="รีเฟรชรายการค้างรับ">
          <span>
            <IconButton
                color="primary"
                onClick={refetch}
                disabled={isLoading}
                aria-label="refresh open receives"
                sx={{
                    // หมุนเบา ๆ ตอนกำลังโหลด
                    animation: isLoading ? "spin 1s linear infinite" : "none",
                    "@keyframes spin": {
                        "0%": { transform: "rotate(0deg)" },
                        "100%": { transform: "rotate(360deg)" },
                    },
                }}
            >
              <CachedIcon />
            </IconButton>
          </span>
                </Tooltip>
            </div>

            {isLoading && <p className="text-gray-500 text-sm text-center py-8">กำลังโหลดข้อมูล…</p>}
            {isError && (
                <p className="text-red-500 text-sm text-center py-8 cursor-pointer">
                    โหลดข้อมูลไม่สำเร็จ
                    <button onClick={refetch} className="underline ml-1">
                        ลองอีกครั้ง
                    </button>
                </p>
            )}
            {!isLoading && !isError && batches.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-8">ไม่มีรายการค้างรับ</p>
            )}

            {batches.map((batch) => (
                <div
                    key={batch.batch_id}
                    className="border rounded-lg mb-5 overflow-hidden"
                    style={{ borderColor: color.colors.orange }}
                >
                    <div className="px-4 py-2 font-medium text-white" style={{ backgroundColor: color.colors.orange }}>
                        บิล #{batch.batch_id}
                    </div>

                    {batch.items.map((item) => {
                        const remain = item.remain;
                        const current = Math.min(receiveQtys[item.item_id] ?? remain, remain);

                        return (
                            <div key={item.item_id} className="flex justify-between items-center px-4 py-3 border-t text-sm">
                                <div>
                                    <p className="font-medium text-gray-800">{item.name}</p>
                                    <p className="text-gray-500">ค้างรับ {remain} / สั่ง {item.ordered_qty}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min={0}
                                        max={remain}
                                        value={current}
                                        onChange={(e) => updateQty(item.item_id, e.target.value)}
                                        className="w-20 border border-gray-300 rounded-md p-1 text-right text-sm"
                                    />
                                    <Button
                                        variant="contained"
                                        size="small"
                                        disabled={isPending || current <= 0 || remain <= 0}
                                        onClick={() => receiveItem({ itemId: item.item_id, qty: current })}
                                        sx={{ px: 2.5, py: 0.6, borderRadius: "8px", textTransform: "none" }}
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
