//RestockCart.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import color from "@/app/styles/color";
import {Button} from "@mui/material";
import SupplierDropdown from '@/components/warehouse/SupplierDropdown';

type CartItem = {
    product_id: string;
    name: string;
    pending?: number;
    qty: number;
    unit_cost: number;
    note?: string | null;
    update_cost?: boolean; // มี field นี้ไว้ แต่ไม่ต้องเพิ่ม UI อะไรเพิ่ม
};

type SupplierLite = { id: number; company_name: string; email?: string | null; tel?: string | null };

type RestockCartProps = {
    /** ให้ parent ลงทะเบียนฟังก์ชัน add-to-cart (รับ qty/unit_cost ได้) */
    onRegisterAddAction?: (fn: (item: { product_id: string; name: string; pending?: number; qty?: number; unit_cost?: number; note?: string | null }) => void) => void;
    /** เรียกเมื่อสร้างบิลสำเร็จ */
    onCreatedAction?: (payload: { batch_id: number }) => void;
};

export default function RestockCart({ onRegisterAddAction, onCreatedAction }: RestockCartProps) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [supplierKeyword, setSupplierKeyword] = useState('');
    const [supplier, setSupplier] = useState<SupplierLite | null>(null);
    const [supLoading, setSupLoading] = useState(false);
    const [supError, setSupError] = useState<string | null>(null);
    const [expectedDate, setExpectedDate] = useState<string>(''); // yyyy-mm-dd
    const [batchNote, setBatchNote] = useState<string>('');

    // register add-to-cart ให้ parent
    useEffect(() => {
        if (!onRegisterAddAction) return;
        const add = (p: { product_id: string; name: string; pending?: number; qty?: number; unit_cost?: number; note?: string | null }) => {
            setCart((prev) => {
                const idx = prev.findIndex((x) => x.product_id === p.product_id);
                if (idx >= 0) {
                    const next = prev.slice();
                    next[idx] = {
                        ...next[idx],
                        qty: p.qty ?? Math.max(1, next[idx].qty + 1),
                        unit_cost: p.unit_cost ?? next[idx].unit_cost,
                        note: p.note ?? next[idx].note,
                    };
                    return next;
                }
                return [
                    ...prev,
                    {
                        product_id: p.product_id,
                        name: p.name,
                        pending: p.pending ?? 0,
                        qty: p.qty ?? 1,
                        unit_cost: p.unit_cost ?? 0,
                        note: p.note ?? null,
                        update_cost: true, // ค่าเริ่มต้น true (แต่ไม่ได้ใช้ UI)
                    },
                ];
            });
        };
        onRegisterAddAction(add);
    }, [onRegisterAddAction]);

    async function searchSuppliers(keyword: string): Promise<SupplierLite[]> {
        const url = `/warehouse/suppliers?q=${encodeURIComponent(keyword)}&page=1&pageSize=10`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error('โหลดซัพพลายเออร์ไม่สำเร็จ');
        const json = await res.json();
        const rows: SupplierLite[] = Array.isArray(json) ? json : (json.data ?? []);
        return rows;
    }

    const removeItem = (product_id: string) => {
        setCart((prev) => prev.filter((x) => x.product_id !== product_id));
    };

    const updateItem = (product_id: string, field: 'qty' | 'unit_cost' | 'note', value: any) => {
        setCart((prev) =>
            prev.map((x) => (x.product_id === product_id ? { ...x, [field]: field === 'note' ? value : Number(value) } : x))
        );
    };

    const totalLines = cart.length;
    const validForSubmit = useMemo(() => {
        if (totalLines === 0) return false;
        const everyQtyOk = cart.every((x) => Number.isFinite(x.qty) && x.qty > 0);
        const everyCostOk = cart.every((x) => Number.isFinite(x.unit_cost) && x.unit_cost >= 0);
        return everyQtyOk && everyCostOk;
    }, [cart, totalLines]);

    // === helper: อัปเดตราคาทุนของสินค้า ตาม unit_cost หลังสร้างบิลสำเร็จ ===
    // แทนที่ทั้งฟังก์ชัน
    async function updateProductCosts(items: CartItem[], supplierId?: number | null) {
        const cleaned = items
            .map((it) => ({
                product_id: String(it.product_id ?? "").trim(),        // ✅ string
                cost: Number(it.unit_cost),
            }))
            .filter((x) => x.product_id && Number.isFinite(x.cost) && x.cost >= 0);

        if (cleaned.length === 0) return;

        try {
            const res = await fetch('/warehouse/products/cost-bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
                body: JSON.stringify({
                    supplier_id: supplier?.id ?? null,                    // ผูกซัพพลายเออร์ทั้งชุด (ถ้ามี)
                    items: cleaned,                                       // ✅ product_id เป็น string แล้ว
                }),
            });
            if (res.ok) return;
            // ถ้าไม่ใช่ 404 ค่อย fallback
        } catch (e) {
            console.warn('cost-bulk error:', e);
        }

        // fallback: PATCH รายตัว (string id)
        await Promise.all(cleaned.map(async (x) => {
            try {
                const r = await fetch(`/warehouse/products/${encodeURIComponent(x.product_id)}/cost`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    cache: 'no-store',
                    body: JSON.stringify({ cost: x.cost, supplier_id: supplier?.id ?? null }),
                });
                if (!r.ok) console.warn('patch cost failed for', x.product_id, await r.text());
            } catch (e) {
                console.warn('patch cost error for', x.product_id, e);
            }
        }));
    }


    const { mutate: createBatch, isPending } = useMutation({
        mutationFn: async () => {
            if (!validForSubmit) throw new Error('ข้อมูลไม่ครบ');
            const payload = {
                supplier_id: supplier?.id ?? null,
                expected_date: expectedDate || null,
                note: batchNote || null,
                items: cart.map((it) => ({
                    product_id: it.product_id,
                    qty: it.qty,
                    unit_cost: it.unit_cost,
                    note: it.note ?? null,
                })),
            };
            const res = await fetch('/warehouse/stock-in/batches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const msg = await safeMessage(res);
                throw new Error(msg || 'สร้างบิลไม่สำเร็จ');
            }
            return res.json();
        },
        onSuccess: async (json: any) => {
            // ✅ อัปเดตราคาทุน ตาม unit_cost ของแถวในตะกร้า
            try {
                await updateProductCosts(cart);
            } catch (e) {
                console.warn('update cost after batch error:', e);
            }

            setCart([]);
            setBatchNote('');
            onCreatedAction?.({ batch_id: json?.batch_id });
        },
    });

    return (
        <div className="rounded-2xl border-for-card">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">ตะกร้าสั่งของเข้า</h3>
                {totalLines > 0 ? (
                    <span className="text-sm opacity-70">รวม {totalLines} รายการ</span>
                ) : (
                    <span className="text-sm opacity-50">ยังไม่มีสินค้าในตะกร้า</span>
                )}
            </div>

            <div
                className="overflow-x-auto rounded-xl border"
                style={{ borderColor: color.colors.orange }}
            >
                <table className="min-w-full text-sm">
                    <thead>
                    <tr style={{ backgroundColor: `${color.colors.orange}cc` }}>
                        <th className="px-3 py-2 text-left text-white">สินค้า</th>
                        <th className="px-3 py-2 text-right text-white">ค้างรับ</th>
                        <th className="px-3 py-2 text-right text-white">จำนวน</th>
                        <th className="px-3 py-2 text-right text-white">ราคาต่อหน่วย</th>
                        <th className="px-3 py-2 text-right text-white">หมายเหตุ</th>
                        <th className="px-3 py-2 text-white"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {cart.map((it) => (
                        <tr key={it.product_id} className="border-t border-zinc-800/50">
                            <td className="px-3 py-2">{it.name}</td>
                            <td className="px-3 py-2 text-right">{it.pending ?? 0}</td>
                            <td className="px-3 py-2 text-right">
                                <input
                                    type="number"
                                    min={1}
                                    className="w-24 text-right bg-transparent border border-zinc-700 rounded-md px-2 py-1"
                                    value={it.qty}
                                    onChange={(e) => updateItem(it.product_id, 'qty', e.target.value)}
                                />
                            </td>
                            <td className="px-3 py-2 text-right">
                                <input
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    className="w-28 text-right bg-transparent border border-zinc-700 rounded-md px-2 py-1"
                                    value={it.unit_cost}
                                    onChange={(e) => updateItem(it.product_id, 'unit_cost', e.target.value)}
                                />
                            </td>
                            <td className="px-3 py-2 text-right">
                                <input
                                    type="text"
                                    className="w-56 bg-transparent border border-zinc-700 rounded-md px-2 py-1"
                                    value={it.note ?? ''}
                                    onChange={(e) => updateItem(it.product_id, 'note', e.target.value)}
                                    placeholder="ระบุสี/ไซต์/ล็อต ฯลฯ (ถ้ามี)"
                                />
                            </td>
                            <td className="px-3 py-2 text-right">
                                <button onClick={() => removeItem(it.product_id)} className="text-red-400 hover:text-red-300 underline">
                                    ลบ
                                </button>
                            </td>
                        </tr>
                    ))}
                    {cart.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-3 py-6 text-center opacity-60">
                                กด “ดำเนินการ” จากรายการ Low Stock เพื่อเพิ่มสินค้าเข้าตะกร้า
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* supplier / expected / note */}
            <div className="grid sm:grid-cols-3 gap-3 mt-4">
                <div className="sm:col-span-1">
                    <SupplierDropdown value={supplier} onChange={setSupplier} label="ซัพพลายเออร์" />
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-sm mb-1">โน้ตของบิล</label>
                    <input
                        type="text"
                        className="w-full bg-transparent border border-zinc-700 rounded-md px-2 py-1"
                        value={batchNote}
                        onChange={(e) => setBatchNote(e.target.value)}
                        placeholder="เงื่อนไขการสั่ง/ส่ง/เครดิต ฯลฯ"
                    />
                </div>
            </div>

            {/* actions */}
            <div className="flex items-center gap-3 mt-4">
                <Button
                    onClick={() => setCart([])}
                    disabled={cart.length === 0 || isPending}
                    variant="outlined"
                    sx={{
                        px: 3,
                        py: 1,
                        borderColor: "grey.700",
                        color: "grey.200",
                        "&:hover": { backgroundColor: "grey.800" },
                        "&.Mui-disabled": { opacity: 0.5 },
                    }}
                >
                    ล้างตะกร้า
                </Button>

                <div className="ml-auto flex items-center gap-2">
                    <Button
                        onClick={() => createBatch()}
                        disabled={!validForSubmit || isPending || cart.length === 0}
                        variant="contained"
                        color="primary"
                        sx={{
                            px: 4,
                            py: 1.2,
                            textTransform: "none",
                            "&.Mui-disabled": { opacity: 0.5 },
                        }}
                    >
                        {isPending ? "กำลังสร้างบิล…" : "สร้างบิลสั่งเข้า"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

async function safeMessage(res: Response): Promise<string | null> {
    try {
        const t = await res.text();
        const j = JSON.parse(t);
        return j?.message ?? null;
    } catch {
        return null;
    }
}
