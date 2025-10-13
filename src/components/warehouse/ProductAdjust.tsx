'use client';

import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress } from "@mui/material";
import color from "@/app/styles/color";
import CategorySelect from "@/components/warehouse/CategorySelect";
import Image from "next/image";

// ---- Types ----
type Category = { id: number; name: string };

type NewProductForm = {
    name: string;
    image?: string | null;
    description?: string | null;
    category_id?: number | null;
    unit?: string | null;
};

type ProductRow = {
    company: string; // ← เปลี่ยนจาก id เป็น company
    name: string;
    image?: string | null;
    quantity?: number | null;
    quantity_pending?: number | null;
    product_status?: "active" | "low_stock" | "restock_pending" | "pricing_pending" | string | null;
};

export default function ProductAdjust({
                                          categories,
                                          loadingCategories,
                                          onReloadCategories,
                                          onCreated,
                                          setCategories,
                                      }: {
    categories: Category[];
    loadingCategories?: boolean;
    onReloadCategories?: () => void;
    onCreated?: (p: { company: string; name: string }) => void; // ← เปลี่ยนตรงนี้ด้วย
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}) {
    const [openAdd, setOpenAdd] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<NewProductForm>({
        name: "",
        image: null,
        description: null,
        category_id: null,
        unit: null,
    });

    const [rows, setRows] = useState<ProductRow[]>([]);
    const [loadingList, setLoadingList] = useState(false);
    const [listError, setListError] = useState<string | null>(null);

    const onChange =
        (k: keyof NewProductForm) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const v = e.target.value;
                if (k === "category_id") {
                    return setForm((s) => ({ ...s, [k]: v === "" ? null : Number(v) }));
                }
                setForm((s) => ({ ...s, [k]: v === "" ? null : v }));
            };

    async function fetchProducts() {
        setLoadingList(true);
        setListError(null);
        try {
            const res = await fetch("/warehouse/products", { cache: "no-store" });
            if (!res.ok) throw new Error(`โหลดรายการสินค้าไม่สำเร็จ (${res.status})`);
            const json = (await res.json()) as ProductRow[];
            setRows(json ?? []);
        } catch (err: any) {
            setListError(err?.message ?? "โหลดรายการสินค้าไม่สำเร็จ");
        } finally {
            setLoadingList(false);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    async function handleSave() {
        setSaving(true);
        try {
            const payload = {
                name: (form.name ?? "").trim(),
                image: form.image?.trim() || null,
                description: form.description?.trim() || null,
                category_id: form.category_id ?? null,
                unit: form.unit?.trim() || null,
            };

            if (!payload.name) throw new Error("กรุณาระบุชื่อสินค้า");

            const res = await fetch("/warehouse/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                cache: "no-store",
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error(`บันทึกไม่สำเร็จ (${res.status})`);
            const json = await res.json().catch(() => null);

            setOpenAdd(false);
            setForm({
                name: "",
                image: null,
                description: null,
                category_id: null,
                unit: null,
            });

            onCreated?.({ company: json?.company ?? "", name: json?.name ?? payload.name }); // ← เปลี่ยนเป็น company

            fetchProducts();
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    }

    const statusChip = (st?: ProductRow["product_status"]) => {
        const label =
            st === "low_stock"
                ? "ใกล้หมด"
                : st === "restock_pending"
                    ? "รอสั่งเข้า"
                    : st === "pricing_pending"
                        ? "รอตั้งราคา"
                        : st === "active"
                            ? "พร้อมขาย"
                            : st ?? "-";

        const cls =
            st === "low_stock"
                ? "bg-red-100 text-red-700 border-red-300"
                : st === "restock_pending"
                    ? "bg-amber-100 text-amber-800 border-amber-300"
                    : st === "pricing_pending"
                        ? "bg-slate-100 text-slate-700 border-slate-300"
                        : "bg-emerald-100 text-emerald-700 border-emerald-300";

        return <span className={`px-2 py-1 rounded-full text-xs border ${cls}`}>{label}</span>;
    };

    const empty = !loadingList && rows.length === 0;

    return (
        <div className="col-span-1 bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">รายการสินค้า</h3>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={fetchProducts}
                        size="small"
                        sx={{ textTransform: "none", borderColor: "#d4d4d8" }}
                        variant="outlined"
                    >
                        รีเฟรช
                    </Button>
                    <button
                        className="text-sm font-medium transition-all duration-150 hover:underline cursor-pointer"
                        style={{ color: color.colors.orange }}
                        onClick={() => {
                            onReloadCategories?.();
                            setOpenAdd(true);
                        }}
                    >
                        + เพิ่มสินค้า
                    </button>
                </div>
            </div>

            {loadingList ? (
                <div className="p-6 flex items-center gap-3 text-zinc-600">
                    <CircularProgress size={20} />
                    <span>กำลังโหลดรายการสินค้า…</span>
                </div>
            ) : listError ? (
                <div className="p-6 text-red-700">{listError}</div>
            ) : empty ? (
                <div className="p-6 text-zinc-600">ยังไม่มีสินค้าในระบบ</div>
            ) : (
                <div className="flex flex-col gap-3">
                    {rows.map((r,index:number) => (
                        <div
                            key={index}
                            className="flex items-center justify-between border border-zinc-200 rounded-lg p-3 hover:bg-zinc-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                {r.image ? (
                                    <div className="relative h-20 w-20 rounded-md border border-zinc-200 overflow-hidden">
                                        <Image
                                            src={r.image}
                                            alt={r.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-20 w-20 rounded-md bg-zinc-100 border border-zinc-200" />
                                )}

                                <div>
                                    <div className="font-semibold">{r.name}</div>
                                    <div className="text-xs text-zinc-500">#{r.company}</div>
                                    <div className="text-xs text-zinc-500 mt-1">
                                        คลัง: {r.quantity ?? 0} | ค้างเข้า: {r.quantity_pending ?? 0}
                                    </div>
                                </div>
                            </div>

                            <div>{statusChip(r.product_status)}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
