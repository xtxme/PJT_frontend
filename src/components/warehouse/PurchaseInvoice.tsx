'use client';

import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem } from "@mui/material";
import color from "@/app/styles/color";

// ---- Types ----
type Category = { id: number; name: string };

type NewProductForm = {
    name: string;
    company?: string | null;
    image?: string | null;
    description?: string | null;
    category_id?: number | null;
    unit?: string | null;
    cost?: number | null;   // จะถูก backend แปลงเป็นทศนิยม 2 หลัก
    sell?: number | null;   // "
};

export default function PurchaseInvoice({
                                            categories,
                                            loadingCategories,
                                            onReloadCategories,
                                            onCreated,                 // optional: ให้หน้า parent เอาไว้ refetch รายการอื่น ๆ ถ้าต้องการ
                                        }: {
    categories: Category[];
    loadingCategories?: boolean;
    onReloadCategories?: () => void;
    onCreated?: (p: { id: string; name: string }) => void;
}) {
    const [openAdd, setOpenAdd] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<NewProductForm>({
        name: "",
        company: null,
        image: null,
        description: null,
        category_id: null,
        unit: null,
        cost: null,
        sell: null,
    });

    const onChange =
        (k: keyof NewProductForm) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const v = e.target.value;

                // ตัวเลขทศนิยม
                if (k === "cost" || k === "sell") {
                    return setForm((s) => ({ ...s, [k]: v === "" ? null : parseFloat(v) }));
                }
                // หมวดหมู่ (number)
                if (k === "category_id") {
                    return setForm((s) => ({ ...s, [k]: v === "" ? null : Number(v) }));
                }
                // string อื่น ๆ
                setForm((s) => ({ ...s, [k]: v === "" ? null : v }));
            };

    async function handleSave() {
        setSaving(true);
        try {
            const payload = {
                name: (form.name ?? "").trim(),
                company: form.company?.trim() || null,
                image: form.image?.trim() || null,
                description: form.description?.trim() || null,
                category_id: form.category_id ?? null,
                unit: form.unit?.trim() || null,
                cost: form.cost ?? null,   // backend: แปลงเป็น string(2 ทศนิยม) หรือ "0.00" ถ้า null
                sell: form.sell ?? null,   // "
            };

            if (!payload.name) throw new Error("กรุณาระบุชื่อสินค้า");

            const res = await fetch("/warehouse/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                cache: "no-store",
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const txt = await res.text().catch(() => "");
                throw new Error(txt || `บันทึกไม่สำเร็จ (${res.status})`);
            }

            const json = await res.json().catch(() => null);
            setOpenAdd(false);
            setForm({
                name: "",
                company: null,
                image: null,
                description: null,
                category_id: null,
                unit: null,
                cost: null,
                sell: null,
            });

            onCreated?.({ id: json?.id ?? "", name: json?.name ?? payload.name });
        } catch (err) {
            console.error(err);
            // TODO: แสดง snackbar/toast
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="col-span-1 bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">เพิ่มสินค้าใหม่</h3>

                <button
                    className="text-sm font-medium transition-all duration-150 hover:underline cursor-pointer"
                    style={{ color: color.colors.orange }}
                    onClick={() => {
                        onReloadCategories?.(); // เผื่อ reload cat ก่อนเปิด
                        setOpenAdd(true);
                    }}
                >
                    + เพิ่มสินค้า
                </button>
            </div>

            <p className="text-sm text-gray-500">
                ใช้สำหรับบันทึกสินค้าใหม่เข้าระบบ (ยังไม่สร้างบิลรับเข้านะ—การรวมหลายรายการไปสั่งให้ใช้ “ตะกร้าสั่งของเข้า”)
            </p>

            {/* Dialog: เพิ่มสินค้า */}
            <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth maxWidth="sm">
                <DialogTitle>เพิ่มสินค้า</DialogTitle>
                <DialogContent sx={{ pt: 1, display: "grid", gap: 2 }}>
                    <TextField
                        label="ชื่อสินค้า*"
                        value={form.name ?? ""}
                        onChange={onChange("name")}
                        required
                    />
                    <TextField
                        label="บริษัท/ผู้ขาย"
                        value={form.company ?? ""}
                        onChange={onChange("company")}
                    />
                    <TextField
                        label="รูปภาพ (URL)"
                        value={form.image ?? ""}
                        onChange={onChange("image")}
                    />
                    <TextField
                        label="คำอธิบาย"
                        value={form.description ?? ""}
                        onChange={onChange("description")}
                        multiline
                        minRows={2}
                    />

                    {/* หมวดหมู่ + หน่วยนับ */}
                    <div className="grid grid-cols-2 gap-2">
                        <TextField
                            select
                            label="หมวดหมู่"
                            value={form.category_id ?? ""}
                            onChange={onChange("category_id")}
                            disabled={loadingCategories}
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="หน่วยนับ"
                            placeholder="เช่น ชิ้น, อัน"
                            value={form.unit ?? ""}
                            onChange={onChange("unit")}
                        />
                    </div>

                    {/* ต้นทุน + ราคาขาย */}
                    <div className="grid grid-cols-2 gap-2">
                        <TextField
                            label="ต้นทุน (cost)"
                            type="number"
                            inputProps={{ step: "0.01", min: 0 }}
                            value={form.cost ?? ""}
                            onChange={onChange("cost")}
                        />
                        <TextField
                            label="ราคาขาย (sell)"
                            type="number"
                            inputProps={{ step: "0.01", min: 0 }}
                            value={form.sell ?? ""}
                            onChange={onChange("sell")}
                        />
                    </div>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setOpenAdd(false)} sx={{ textTransform: "none" }}>
                        ยกเลิก
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving || !form.name}
                        variant="contained"
                        sx={{
                            textTransform: "none",
                            backgroundColor: color.colors.orange,
                            "&:hover": { backgroundColor: color.colors.orange },
                        }}
                    >
                        {saving ? "กำลังบันทึก..." : "บันทึกสินค้า"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
