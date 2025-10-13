'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

type CartItem = {
    product_id: string;        // from ProductRow.id (string/uuid) — ถ้าของคุณเป็น number ให้แปลงเป็น string ตอน add
    name: string;
    pending?: number;          // ใช้โชว์เฉย ๆ
    qty: number;               // ปริมาณที่จะสั่ง
    unit_cost: number;         // ราคาต่อหน่วย (สั่ง)
    note?: string | null;
};

type SupplierLite = { id: number; company_name: string; email?: string | null; tel?: string | null };

type RestockCartProps = {
    onRegisterAddAction?: (fn: (item: { product_id: string; name: string; pending?: number }) => void) => void;
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

    // ---- add function ให้ parent ----
    useEffect(() => {
        if (!onRegisterAddAction) return;
        const add = (p: { product_id: string; name: string; pending?: number }) => {
            setCart((prev) => {
                // ถ้ามีของเดิมอยู่แล้ว ให้ focus ที่เดิม (เพิ่ม qty +1 เบา ๆ)
                const idx = prev.findIndex((x) => x.product_id === p.product_id);
                if (idx >= 0) {
                    const next = prev.slice();
                    next[idx] = { ...next[idx], qty: Math.max(1, next[idx].qty + 1) };
                    return next;
                }
                return [
                    ...prev,
                    { product_id: p.product_id, name: p.name, pending: p.pending ?? 0, qty: 1, unit_cost: 0 },
                ];
            });
        };
        onRegisterAddAction(add);
    }, [onRegisterAddAction]);

    // ---- supplier search ----
    async function searchSuppliers(keyword: string): Promise<SupplierLite[]> {
        const url = `/warehouse/suppliers?q=${encodeURIComponent(keyword)}&page=1&pageSize=10`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error('โหลดซัพพลายเออร์ไม่สำเร็จ');
        const json = await res.json();
        const rows: SupplierLite[] = Array.isArray(json) ? json : (json.data ?? []);
        return rows;
    }

    const doSearchSupplier = async () => {
        setSupError(null);
        setSupLoading(true);
        try {
            const rows = await searchSuppliers(supplierKeyword.trim());
            if (rows.length === 0) {
                setSupError('ไม่พบซัพพลายเออร์ที่ค้นหา');
            } else {
                // เลือกตัวแรกให้ก่อน (หรือคุณจะทำเป็น dropdown ก็ได้)
                setSupplier(rows[0]);
            }
        } catch (e: any) {
            setSupError(e?.message ?? 'ค้นหาไม่สำเร็จ');
        } finally {
            setSupLoading(false);
        }
    };

    // ---- remove / update ----
    const removeItem = (product_id: string) => {
        setCart((prev) => prev.filter((x) => x.product_id !== product_id));
    };

    const updateItem = (product_id: string, field: 'qty' | 'unit_cost' | 'note', value: any) => {
        setCart((prev) =>
            prev.map((x) =>
                x.product_id === product_id ? { ...x, [field]: field === 'note' ? value : Number(value) } : x
            )
        );
    };

    const totalLines = cart.length;
    const validForSubmit = useMemo(() => {
        if (totalLines === 0) return false;
        const everyQtyOk = cart.every((x) => Number.isFinite(x.qty) && x.qty > 0);
        const everyCostOk = cart.every((x) => Number.isFinite(x.unit_cost) && x.unit_cost >= 0);
        return everyQtyOk && everyCostOk;
    }, [cart, totalLines]);

    // ---- submit: POST /warehouse/stock-in/batches ----
    const { mutate: createBatch, isPending } = useMutation({
        mutationFn: async () => {
            if (!validForSubmit) throw new Error('ข้อมูลไม่ครบ');
            const payload = {
                supplier_id: supplier?.id ?? null,
                expected_date: expectedDate || null, // yyyy-mm-dd
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
        onSuccess: (json: any) => {
            // เคลียร์ตะกร้า + แจ้ง parent
            setCart([]);
            setBatchNote('');
            if (onCreatedAction && json?.batch_id) onCreatedAction({ batch_id: json.batch_id });
        },
    });

    return (
        <div className="rounded-2xl border border-zinc-800/40 p-4 bg-zinc-900/20 backdrop-blur">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">ตะกร้าสั่งของเข้า</h3>
                {totalLines > 0 ? (
                    <span className="text-sm opacity-70">รวม {totalLines} รายการ</span>
                ) : (
                    <span className="text-sm opacity-50">ยังไม่มีสินค้าในตะกร้า</span>
                )}
            </div>

            {/* table */}
            <div className="overflow-x-auto rounded-xl border border-zinc-800/50">
                <table className="min-w-full text-sm">
                    <thead className="bg-zinc-800/40">
                    <tr>
                        <th className="px-3 py-2 text-left">สินค้า</th>
                        <th className="px-3 py-2 text-right">ค้างรับ</th>
                        <th className="px-3 py-2 text-right">จำนวน</th>
                        <th className="px-3 py-2 text-right">ราคาต่อหน่วย</th>
                        <th className="px-3 py-2">หมายเหตุ</th>
                        <th className="px-3 py-2"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {cart.map((it) => (
                        <tr key={it.product_id} className="border-t border-zinc-800/50">
                            <td className="px-3 py-2">{it.name}</td>
                            <td className="px-3 py-2 text-right">{it.pending ?? 0}</td>
                            <td className="px-3 py-2">
                                <input
                                    type="number"
                                    min={1}
                                    className="w-24 text-right bg-transparent border border-zinc-700 rounded-md px-2 py-1"
                                    value={it.qty}
                                    onChange={(e) => updateItem(it.product_id, 'qty', e.target.value)}
                                />
                            </td>
                            <td className="px-3 py-2">
                                <input
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    className="w-28 text-right bg-transparent border border-zinc-700 rounded-md px-2 py-1"
                                    value={it.unit_cost}
                                    onChange={(e) => updateItem(it.product_id, 'unit_cost', e.target.value)}
                                />
                            </td>
                            <td className="px-3 py-2">
                                <input
                                    type="text"
                                    className="w-56 bg-transparent border border-zinc-700 rounded-md px-2 py-1"
                                    value={it.note ?? ''}
                                    onChange={(e) => updateItem(it.product_id, 'note', e.target.value)}
                                    placeholder="ระบุสี/ไซต์/ล็อต ฯลฯ (ถ้ามี)"
                                />
                            </td>
                            <td className="px-3 py-2 text-right">
                                <button
                                    onClick={() => removeItem(it.product_id)}
                                    className="text-red-400 hover:text-red-300 underline"
                                >
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
                    <label className="block text-sm mb-1">ซัพพลายเออร์</label>
                    {supplier ? (
                        <div className="flex items-center gap-2">
                            <div className="text-sm">
                                <div className="font-medium">{supplier.company_name}</div>
                                <div className="opacity-70">{supplier.email ?? supplier.tel ?? '-'}</div>
                            </div>
                            <button
                                onClick={() => setSupplier(null)}
                                className="ml-auto text-xs underline opacity-80"
                            >
                                เปลี่ยน
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <input
                                className="flex-1 bg-transparent border border-zinc-700 rounded-md px-2 py-1"
                                placeholder="พิมพ์ชื่อบริษัทเพื่อค้นหา"
                                value={supplierKeyword}
                                onChange={(e) => setSupplierKeyword(e.target.value)}
                            />
                            <button
                                onClick={doSearchSupplier}
                                disabled={!supplierKeyword.trim() || supLoading}
                                className="px-3 py-1 rounded-md border border-zinc-700 hover:bg-zinc-800"
                            >
                                ค้นหา
                            </button>
                        </div>
                    )}
                    {!!supError && <div className="text-xs text-red-400 mt-1">{supError}</div>}
                </div>

                <div>
                    <label className="block text-sm mb-1">วันคาดว่าจะได้รับ</label>
                    <input
                        type="date"
                        className="w-full bg-transparent border border-zinc-700 rounded-md px-2 py-1"
                        value={expectedDate}
                        onChange={(e) => setExpectedDate(e.target.value)}
                    />
                </div>

                <div>
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
                <button
                    onClick={() => setCart([])}
                    disabled={cart.length === 0 || isPending}
                    className="px-3 py-2 rounded-md border border-zinc-700 hover:bg-zinc-800 disabled:opacity-50"
                >
                    ล้างตะกร้า
                </button>
                <div className="ml-auto flex items-center gap-2">
                    <button
                        onClick={() => createBatch()}
                        disabled={!validForSubmit || isPending || cart.length === 0}
                        className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50"
                    >
                        {isPending ? 'กำลังสร้างบิล…' : 'สร้างบิลสั่งเข้า'}
                    </button>
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
