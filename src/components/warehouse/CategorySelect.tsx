import { useState } from "react";
import {
    TextField, MenuItem, Dialog, DialogTitle,
    DialogContent, DialogActions, Button, CircularProgress
} from "@mui/material";
import {Category, ProductForm} from "@/app/types/warehouse";

const ADD_SENTINEL = "__ADD__";

export default function CategorySelect({
                                           form,
                                           setForm,
                                           categories,
                                           setCategories,
                                           loadingCategories,
                                       }: {
    form: ProductForm;
    setForm: React.Dispatch<React.SetStateAction<ProductForm>>;
    categories: Category[];
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    loadingCategories: boolean;
}) {
    // --- state สำหรับ dialog เพิ่มหมวดหมู่ ---
    const [openAdd, setOpenAdd] = useState(false);
    const [newCatName, setNewCatName] = useState("");
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- onChange เฉพาะ category: รองรับ sentinel สำหรับเปิด dialog ---
    const onCategoryChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const v = e.target.value as string;
        if (v === ADD_SENTINEL) {
            // เปิด dialog เพื่อสร้างหมวดหมู่ใหม่ แทนที่จะเซ็ตค่า
            setNewCatName("");
            setError(null);
            setOpenAdd(true);
            return;
        }

        // ค่าอื่นถือว่าเป็น id (number หรือ string ของ number)
        const n = v === "" ? null : Number(v);
        setForm(s => ({ ...s, category_id: n }));
    };

    const handleCreateCategory = async () => {
        const name = newCatName.trim();
        if (!name) {
            setError("กรุณาระบุชื่อหมวดหมู่");
            return;
        }
        setError(null);
        setCreating(true);
        try {
            const res = await fetch("/warehouse/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            const j = await res.json().catch(() => ({}));
            if (!res.ok) {
                // 409 = มีชื่อซ้ำ, 400 = ไม่ระบุชื่อ, อื่น ๆ
                throw new Error(j?.message ?? "สร้างหมวดหมู่ไม่สำเร็จ");
            }

            const created: Category = { id: j.id, name: name }; // backend ส่ง { id, name }
            // อัปเดตรายการ categories (กันซ้ำแบบเร็ว ๆ)
            setCategories((prev) => {
                const exists = prev.some(
                    (c) => c.name.trim().toLowerCase() === name.toLowerCase()
                );
                const next = exists ? prev : [...prev, created];
                // จะ sort ตามชื่อก็ได้ ถ้าอยากคงลำดับเดิมให้ตัด sort ทิ้ง
                next.sort((a, b) => a.name.localeCompare(b.name, "th"));
                return next;
            });

            // เลือกหมวดหมู่ที่เพิ่งสร้าง
            setForm((s) => ({ ...s, category_id: created.id }));

            setOpenAdd(false);
        } catch (e: any) {
            setError(e?.message ?? "สร้างหมวดหมู่ไม่สำเร็จ");
        } finally {
            setCreating(false);
        }
    };

    return (
        <>
            <TextField
                select
                label="หมวดหมู่"
                value={form.category_id ?? ""}
                onChange={onCategoryChange}
                disabled={loadingCategories || creating}
                fullWidth
            >
                {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                    </MenuItem>
                ))}

                {/* เส้นคั่นเล็ก ๆ เพื่อแยก action */}
                <MenuItem disabled divider value="" />

                {/* ปุ่มเพิ่มหมวดหมู่ */}
                <MenuItem value={ADD_SENTINEL}>
                    {creating ? (
                        <>
                            <CircularProgress size={18} style={{ marginRight: 8 }} />
                            กำลังสร้าง…
                        </>
                    ) : (
                        "＋ เพิ่มหมวดหมู่ใหม่"
                    )}
                </MenuItem>
            </TextField>

            {/* Dialog สร้างหมวดหมู่ */}
            <Dialog open={openAdd} onClose={() => (creating ? null : setOpenAdd(false))} fullWidth>
                <DialogTitle>เพิ่มหมวดหมู่ใหม่</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="ชื่อหมวดหมู่"
                        fullWidth
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        disabled={creating}
                    />
                    {error ? (
                        <div style={{ color: "#d32f2f", marginTop: 8 }}>{error}</div>
                    ) : null}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAdd(false)} disabled={creating}>
                        ยกเลิก
                    </Button>
                    <Button onClick={handleCreateCategory} disabled={creating} variant="contained">
                        {creating ? "กำลังบันทึก…" : "บันทึก"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
