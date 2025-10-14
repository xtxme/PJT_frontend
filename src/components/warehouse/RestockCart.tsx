// RestockCart.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import color from "@/app/styles/color";
import { Button } from "@mui/material";
import SupplierDropdown from '@/components/warehouse/SupplierDropdown';

/* ----------------------------- Zod Schemas ----------------------------- */
const CartItemSchema = z.object({
    product_id: z.string().min(1, 'product_id ว่างไม่ได้'),
    name: z.string().min(1, 'ชื่อว่างไม่ได้'),
    pending: z.number().int().min(0).optional(),
    qty: z.number()
        .refine(Number.isFinite, { message: 'จำนวนต้องเป็นตัวเลข' })
        .int('ต้องเป็นจำนวนเต็ม')
        .min(1, 'อย่างน้อย 1'),
    unit_cost: z.number()
        .refine(Number.isFinite, { message: 'ราคาต้องเป็นตัวเลข' })
        .min(0, 'ต้องไม่ติดลบ'),
    note: z.string().trim().max(300, 'ยาวเกิน 300 ตัวอักษร').nullable().optional(),
    update_cost: z.boolean().optional(),
});

const CartSchema = z.array(CartItemSchema).min(1, 'ต้องมีอย่างน้อย 1 รายการ');

const BatchPayloadSchema = z.object({
    supplier_id: z.number().int().positive().nullable(),
    expected_date: z.string().date().nullable().optional().or(z.literal('').transform(() => null)),
    note: z.string().trim().max(500).nullable().optional(),
    items: CartSchema,
});

/* -------------------------------- Types -------------------------------- */
type CartItem = z.infer<typeof CartItemSchema>;

type RestockCartProps = {
    onRegisterAddAction?: (
        fn: (item: {
            product_id: string;
            name: string;
            pending?: number;
            qty?: number;
            unit_cost?: number;
            note?: string | null;
        }) => void
    ) => void;

    onRegisterRemoveAction?: (fn: (product_id: string) => void) => void;
    onCreatedAction?: (payload: { batch_id: number }) => void;
};

type SupplierLite = { id: number; company_name: string; email?: string | null; tel?: string | null };

/* ---------------------------- Helper Functions ---------------------------- */
function toNum(v: any): number {
    // แปลงอินพุตเป็น number อย่างปลอดภัย
    const n = Number(v);
    return Number.isFinite(n) ? n : NaN;
}

function validateCartItems(cart: CartItem[]) {
    const parse = CartSchema.safeParse(cart);
    if (parse.success) return { ok: true as const, errors: {} as ErrorsState };

    // map error ต่อรายการ (ใช้ path: ['0','qty'] …)
    const fieldErrors: ErrorsState = {};
    for (const issue of parse.error.issues) {
        const [idxStr, field] = issue.path as (string | number)[];
        const idx = typeof idxStr === 'number' ? idxStr : Number(idxStr);
        const item = cart[idx];
        if (!item) continue;
        const key = item.product_id;
        if (!fieldErrors[key]) fieldErrors[key] = {};
        const f = String(field) as keyof RowFieldErrors;
        // เก็บแค่อันแรกพอ
        if (!fieldErrors[key][f]) fieldErrors[key][f] = issue.message;
    }
    return { ok: false as const, errors: fieldErrors };
}

/* ------------------------------- Error State ------------------------------ */
type RowFieldErrors = { qty?: string; unit_cost?: string; note?: string };
type ErrorsState = Record<string, RowFieldErrors>;

/* --------------------------------- View ---------------------------------- */
export default function RestockCart({ onRegisterAddAction, onRegisterRemoveAction, onCreatedAction }: RestockCartProps) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [supplier, setSupplier] = useState<SupplierLite | null>(null);
    const [expectedDate, setExpectedDate] = useState<string>(''); // yyyy-mm-dd (เผื่อใช้ทีหลัง)
    const [batchNote, setBatchNote] = useState<string>('');
    const [errors, setErrors] = useState<ErrorsState>({});

    // register add-to-cart ให้ parent
    useEffect(() => {
        if (!onRegisterAddAction) return;
        const add = (p: { product_id: string; name: string; pending?: number; qty?: number; unit_cost?: number; note?: string | null }) => {
            setCart((prev) => {
                const idx = prev.findIndex((x) => x.product_id === p.product_id);
                if (idx >= 0) {
                    const next = prev.slice();
                    const curr = next[idx];
                    next[idx] = {
                        ...curr,
                        qty: p.qty ?? Math.max(1, curr.qty + 1),
                        unit_cost: p.unit_cost ?? curr.unit_cost,
                        note: p.note ?? curr.note,
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
                        update_cost: true,
                    },
                ];
            });
        };
        onRegisterAddAction(add);
    }, [onRegisterAddAction]);

    // register remove-from-cart
    useEffect(() => {
        if (!onRegisterRemoveAction) return;
        onRegisterRemoveAction((product_id: string) => {
            setCart((prev) => prev.filter((x) => x.product_id !== product_id));
        });
    }, [onRegisterRemoveAction]);

    const removeItem = (product_id: string) => {
        setCart((prev) => prev.filter((x) => x.product_id !== product_id));
        setErrors((es) => {
            const n = { ...es };
            delete n[product_id];
            return n;
        });
    };

    const updateItem = (product_id: string, field: 'qty' | 'unit_cost' | 'note', value: any) => {
        setCart((prev) =>
            prev.map((x) =>
                x.product_id === product_id
                    ? {
                        ...x,
                        [field]:
                            field === 'note'
                                ? value
                                : toNum(value),
                    }
                    : x
            )
        );
    };

    // วาลิเดตทุกครั้งที่ cart เปลี่ยน
    useEffect(() => {
        const { errors: newErrors } = validateCartItems(
            cart.map((it) => ({
                ...it,
                // บังคับให้ qty/unit_cost เป็น number เสมอ
                qty: toNum(it.qty),
                unit_cost: toNum(it.unit_cost),
            }))
        );
        setErrors(newErrors);
    }, [cart]);

    const totalLines = cart.length;

    const validForSubmit = useMemo(() => {
        const res = validateCartItems(
            cart.map((it) => ({ ...it, qty: toNum(it.qty), unit_cost: toNum(it.unit_cost) }))
        );
        return res.ok;
    }, [cart]);

    // === helper: อัปเดตราคาทุนของสินค้า ตาม unit_cost หลังสร้างบิลสำเร็จ ===
    async function updateProductCosts(items: CartItem[], supplierId?: number | null) {
        const cleaned = items
            .map((it) => ({
                product_id: String(it.product_id ?? "").trim(),
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
                    supplier_id: supplierId ?? null,
                    items: cleaned,
                }),
            });
            if (res.ok) return;
        } catch (e) {
            console.warn('cost-bulk error:', e);
        }

        // fallback: PATCH รายตัว (string id)
        await Promise.all(
            cleaned.map(async (x) => {
                try {
                    const r = await fetch(`/warehouse/products/${encodeURIComponent(x.product_id)}/cost`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        cache: 'no-store',
                        body: JSON.stringify({ cost: x.cost, supplier_id: supplierId ?? null }),
                    });
                    if (!r.ok) console.warn('patch cost failed for', x.product_id, await r.text());
                } catch (e) {
                    console.warn('patch cost error for', x.product_id, e);
                }
            })
        );
    }

    const { mutate: createBatch, isPending } = useMutation({
        mutationFn: async () => {
            // วาลิเดต payload ด้วย Zod อีกชั้นก่อนยิง
            const payload = {
                supplier_id: supplier?.id ?? null,
                expected_date: expectedDate || null,
                note: batchNote || null,
                items: cart.map((it) => ({
                    ...it,
                    qty: toNum(it.qty),
                    unit_cost: toNum(it.unit_cost),
                })),
            };

            const parsed = BatchPayloadSchema.safeParse(payload);
            if (!parsed.success) {
                // หา error แรกที่อ่านง่าย
                const first = parsed.error.issues[0];
                throw new Error(first?.message || 'ข้อมูลไม่ครบ');
            }

            const res = await fetch('/warehouse/stock-in/batches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
                body: JSON.stringify(parsed.data),
            });
            if (!res.ok) {
                const msg = await safeMessage(res);
                throw new Error(msg || 'สร้างบิลไม่สำเร็จ');
            }
            return res.json();
        },
        onSuccess: async (json: any) => {
            try {
                await updateProductCosts(cart, supplier?.id ?? null);
            } catch (e) {
                console.warn('update cost after batch error:', e);
            }
            setCart([]);
            setBatchNote('');
            setErrors({});
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

            <div className="overflow-x-auto rounded-xl border" style={{ borderColor: color.colors.orange }}>
                <table className="min-w-full text-sm">
                    <thead>
                    <tr style={{ backgroundColor: `${color.colors.orange}` }}>
                        <th className="px-3 py-2 text-left text-white">สินค้า</th>
                        <th className="px-3 py-2 text-right text-white">ค้างรับ</th>
                        <th className="px-3 py-2 text-right text-white">จำนวน</th>
                        <th className="px-3 py-2 text-right text-white">ราคาต่อหน่วย</th>
                        <th className="px-3 py-2 text-right text-white">หมายเหตุ</th>
                        <th className="px-3 py-2 text-white"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {cart.map((it) => {
                        const err = errors[it.product_id] ?? {};
                        const qtyErr = !!err.qty;
                        const costErr = !!err.unit_cost;
                        const noteErr = !!err.note;
                        return (
                            <tr key={it.product_id} className="border-t border-zinc-800/50 align-top">
                                <td className="px-3 py-2">{it.name}</td>
                                <td className="px-3 py-2 text-right">{it.pending ?? 0}</td>
                                <td className="px-3 py-2 text-right">
                                    <input
                                        type="number"
                                        min={1}
                                        className={`w-24 text-right bg-transparent border rounded-md px-2 py-1 ${qtyErr ? 'border-red-500' : 'border-zinc-700'}`}
                                        value={String(it.qty)}
                                        onChange={(e) => updateItem(it.product_id, 'qty', e.target.value)}
                                        aria-invalid={qtyErr}
                                    />
                                    {qtyErr && <div className="text-xs text-red-400 mt-1">{err.qty}</div>}
                                </td>
                                <td className="px-3 py-2 text-right">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min={0}
                                        className={`w-28 text-right bg-transparent border rounded-md px-2 py-1 ${costErr ? 'border-red-500' : 'border-zinc-700'}`}
                                        value={String(it.unit_cost)}
                                        onChange={(e) => updateItem(it.product_id, 'unit_cost', e.target.value)}
                                        aria-invalid={costErr}
                                    />
                                    {costErr && <div className="text-xs text-red-400 mt-1">{err.unit_cost}</div>}
                                </td>
                                <td className="px-3 py-2 text-right">
                                    <input
                                        type="text"
                                        className={`w-56 bg-transparent border rounded-md px-2 py-1 ${noteErr ? 'border-red-500' : 'border-zinc-700'}`}
                                        value={it.note ?? ''}
                                        onChange={(e) => updateItem(it.product_id, 'note', e.target.value)}
                                        placeholder="ระบุสี/ไซต์/ล็อต ฯลฯ (ถ้ามี)"
                                        aria-invalid={noteErr}
                                    />
                                    {noteErr && <div className="text-xs text-red-400 mt-1">{err.note}</div>}
                                </td>
                                <td className="px-3 py-2 text-right">
                                    <button onClick={() => removeItem(it.product_id)} className="text-red-400 hover:text-red-300 underline">
                                        ลบ
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
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
                    onClick={() => { setCart([]); setErrors({}); }}
                    disabled={cart.length === 0 || isPending}
                    variant="outlined"
                    sx={{ px: 3, py: 1, "&.Mui-disabled": { opacity: 0.5 } }}
                >
                    ล้างตะกร้า
                </Button>

                <div className="ml-auto flex items-center gap-2">
                    <Button
                        onClick={() => createBatch()}
                        disabled={!validForSubmit || isPending || cart.length === 0}
                        variant="contained"
                        color="primary"
                        sx={{ px: 4, py: 1.2, textTransform: "none", "&.Mui-disabled": { opacity: 0.5 } }}
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
