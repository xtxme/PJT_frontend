'use client';

import { useEffect, useMemo, useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, CircularProgress, IconButton, Tooltip,
    FormControl, InputLabel, Select, MenuItem, Box
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment"; // ★ NEW
import CachedIcon from "@mui/icons-material/Cached";
import SearchIcon from "@mui/icons-material/Search";
import color from "@/app/styles/color";
import CategorySelect from "@/components/warehouse/CategorySelect";
import Image from "next/image";
import { z } from "zod"; // ★ zod
import { api } from "@/app/lib/api";

// ---------------- zod schema ----------------
const NewProductSchema = z.object({
    name: z.string().trim().min(1, "กรุณาระบุชื่อสินค้า").max(120, "ชื่อยาวเกินไป"),
    image: z.preprocess(
        (v) => {
            const s = (v ?? "").toString().trim();
            return s === "" ? null : s;
        },
        z
            .string()
            .url("URL รูปภาพไม่ถูกต้อง")
            // ถ้าต้องการบังคับ Cloudinary คอมเมนต์บรรทัดนี้ออกได้
            .regex(/^https?:\/\/res\.cloudinary\.com\//i, "กรุณาใช้ Cloudinary URL")
            .nullable()
            .optional()
    ),
    description: z.preprocess(
        (v) => {
            const s = (v ?? "").toString().trim();
            return s === "" ? null : s;
        },
        z.string().max(500, "คำอธิบายยาวเกินไป").nullable().optional()
    ),
    category_id: z.number().int().positive("หมวดหมู่ไม่ถูกต้อง").nullable().optional(),
    unit: z.preprocess(
        (v) => {
            const s = (v ?? "").toString().trim();
            return s === "" ? null : s;
        },
        z.string().max(32, "หน่วยยาวเกินไป").nullable().optional()
    ),
});

// helper รวม error เป็น map
type FormErrors = Partial<Record<keyof NewProductForm, string>>;
function validateForm(f: NewProductForm): { ok: true; data: NewProductForm } | { ok: false; errors: FormErrors } {
    const parsed = NewProductSchema.safeParse(f);
    if (parsed.success) return { ok: true, data: parsed.data };
    const errors: FormErrors = {};
    for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof NewProductForm;
        if (!errors[key]) errors[key] = issue.message;
    }
    return { ok: false, errors };
}

function unwrapList<T = any>(json: any): T[] {
    if (Array.isArray(json)) return json as T[];
    if (Array.isArray(json?.data)) return json.data as T[];
    return [];
}

// ---- Types ----
type Category = { id: number; name: string };

type NewProductForm = {
    name: string;
    image?: string | null;
    description?: string | null;
    category_id?: number | null;
    unit?: string | null;
};

type StatusKey = "active" | "low_stock" | "restock_pending" | "pricing_pending";

type ProductRow = {
    company?: string | null;
    name: string;
    image?: string | null;
    quantity?: number | null;
    quantity_pending?: number | null;
    product_status?: StatusKey | string | null;
    // ★ NEW: เพิ่ม field สำหรับกรอง/เรียงฝั่งหน้า
    category_id?: number | null;
    description?: string | null;
    updated_at?: string | null; // ใช้ sort updated_at ฝั่งหน้าได้
};

const STATUS_OPTIONS: { key: StatusKey; label: string }[] = [
    { key: "active", label: "พร้อมขาย" },
    { key: "low_stock", label: "ใกล้หมด" },
    { key: "restock_pending", label: "รอสั่งเข้า" },
    { key: "pricing_pending", label: "รอตั้งราคา" },
];

const SORT_OPTIONS = [
    { value: "updated_at.desc", label: "อัปเดตล่าสุด ⬇︎" },
    { value: "updated_at.asc", label: "อัปเดตเก่าสุด ⬆︎" },
    { value: "name.asc", label: "ชื่อ A→Z" },
    { value: "name.desc", label: "ชื่อ Z→A" },
    { value: "quantity.desc", label: "จำนวนมาก→น้อย" },
    { value: "quantity.asc", label: "จำนวนน้อย→มาก" },
];


// ---- debounce helper ----
function useDebounced<T>(value: T, delay = 350) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

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
    onCreated?: (p: { company: string; name: string }) => void;
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

    // ---------- Filters ----------
    const [q, setQ] = useState("");
    const debouncedQ = useDebounced(q, 400);

    const [categoryId, setCategoryId] = useState<number | "">("");
    const [status, setStatus] = useState<StatusKey | "">("");
    const [sort, setSort] = useState<string>("updated_at.desc");

    // ถ้ายังอยากดึงจาก backend ด้วยพารามิเตอร์เดิม ก็ใช้ queryString นี้ต่อได้
    const queryString = useMemo(() => {
        const sp = new URLSearchParams();
        if (debouncedQ.trim()) sp.set("q", debouncedQ.trim());
        if (categoryId !== "") sp.set("category_id", String(categoryId));
        if (status !== "") sp.set("status", String(status));
        if (sort) sp.set("sort", sort);
        sp.set("page", "1");
        sp.set("pageSize", "50");
        return sp.toString();
    }, [debouncedQ, categoryId, status, sort]);

    // ใกล้ ๆ state ของ form
    const [errors, setErrors] = useState<FormErrors>({}); // ★ errors

    // แก้ฟังก์ชัน onChange เดิมให้ล้าง error ของ field นั้น ๆ
    const onChange =
        (k: keyof NewProductForm) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const v = e.target.value;
                setErrors((es) => ({ ...es, [k]: undefined })); // ★ clear error ระหว่างพิมพ์
                if (k === "category_id") {
                    return setForm((s) => ({ ...s, [k]: v === "" ? null : Number(v) }));
                }
                setForm((s) => ({ ...s, [k]: v === "" ? null : v }));
            };


    async function fetchProducts() {
        setLoadingList(true);
        setListError(null);
        try {
            const url = queryString ? `/warehouse/products?${queryString}` : `/warehouse/products`;
            const json = await api.get<any>(url);
            const rows = unwrapList<ProductRow>(json);
            setRows(rows);
        } catch (err: any) {
            setListError(err?.message ?? "โหลดรายการสินค้าไม่สำเร็จ");
        } finally {
            setLoadingList(false);
        }
    }

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryString]);

    async function handleSave() {
        setSaving(true);
        try {
            const r = validateForm(form);
            if (!r.ok) {
                setErrors(r.errors);
                throw new Error("กรุณาตรวจสอบข้อมูลที่กรอก");
            }
            const payload = r.data;

            const created = await api.post<any>("/warehouse/products", payload);

            setOpenAdd(false);
            setForm({ name: "", image: null, description: null, category_id: null, unit: null });
            setErrors({});

            onCreated?.({ company: created?.company ?? "", name: created?.name ?? payload.name });
            fetchProducts();
        } catch (err) {
            // ถ้าจะโชว์ toast ตรงนี้ก็ได้
            console.error(err);
            setListError((err as Error)?.message ?? "บันทึกไม่สำเร็จ");
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

    // ★ NEW: กรอง + เรียงฝั่งหน้า
    const filteredRows = useMemo(() => {
        let r = [...rows];

        // ค้นหาใน name/company/description
        const qq = debouncedQ.trim().toLowerCase();
        if (qq) {
            r = r.filter(x =>
                (x.name ?? "").toLowerCase().includes(qq) ||
                (x.company ?? "").toLowerCase().includes(qq) ||
                (x.description ?? "").toLowerCase().includes(qq)
            );
        }

        // กรองหมวดหมู่
        if (categoryId !== "") {
            r = r.filter(x => (x.category_id ?? null) === Number(categoryId));
        }

        // กรองสถานะ
        if (status !== "") {
            r = r.filter(x => (x.product_status ?? "") === status);
        }

        // เรียง
        const getTime = (s?: string | null) => (s ? new Date(s).getTime() : 0);
        const sorter: Record<string, (a: ProductRow, b: ProductRow) => number> = {
            "updated_at.desc": (a, b) => getTime(b.updated_at) - getTime(a.updated_at),
            "updated_at.asc":  (a, b) => getTime(a.updated_at) - getTime(b.updated_at),
            "name.asc":  (a, b) => (a.name ?? "").localeCompare(b.name ?? ""),
            "name.desc": (a, b) => (b.name ?? "").localeCompare(a.name ?? ""),
            "quantity.desc": (a, b) => (b.quantity ?? 0) - (a.quantity ?? 0),
            "quantity.asc":  (a, b) => (a.quantity ?? 0) - (b.quantity ?? 0),
        };
        const cmp = sorter[sort];
        if (cmp) r.sort(cmp);

        return r;
    }, [rows, debouncedQ, categoryId, status, sort]);

    return (
        <div className="col-span-1 bg-white rounded-xl shadow p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center mb-3">
                    <h3 className="font-semibold">รายการสินค้า</h3>
                    {/* Refresh */}
                    <Tooltip title="รีเฟรชรายการสินค้า">
            <span>
              <IconButton
                  color="primary"
                  onClick={fetchProducts}
                  disabled={loadingList}
                  aria-label="refresh products"
                  sx={{
                      animation: loadingList ? "spin 1s linear infinite" : "none",
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

            {/* Filters */}
            <Box className="mb-4 grid gap-3" sx={{ gridTemplateColumns: { xs: "1fr", sm: "3fr 1fr" } }}>
                {/* Search */}
                <TextField
                    size="small"
                    placeholder="ค้นหาชื่อ/คำอธิบาย…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" sx={{ opacity: 0.7 }} />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Sort */}
                <FormControl size="small">
                    <InputLabel id="sort-label">เรียงตาม</InputLabel>
                    <Select
                        labelId="sort-label"
                        label="เรียงตาม"
                        value={sort}
                        onChange={(e) => setSort(String(e.target.value))}
                    >
                        {SORT_OPTIONS.map((o) => (
                            <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

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
                    {filteredRows.map((r) => { // ★ ใช้ filteredRows
                        const key = `${r.company ?? '—'}::${r.name}`;
                        return (
                            <div
                                key={key}
                                className="flex items-center justify-between border border-zinc-200 rounded-lg p-3 hover:bg-zinc-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    {r.image ? (
                                        <div className="relative h-20 w-20 rounded-md border border-zinc-200 overflow-hidden">
                                            <Image src={r.image} alt={r.name} fill className="object-cover" />
                                        </div>
                                    ) : (
                                        <div className="h-20 w-20 rounded-md bg-zinc-100 border border-zinc-200" />
                                    )}

                                    <div>
                                        <div className="font-semibold">{r.name}</div>
                                        <div className="text-xs text-zinc-500"># {r.company ? ` บริษัท ${r.company}` : " —"}</div>
                                        <div className="text-xs text-zinc-500 mt-1">
                                            คลัง: {r.quantity ?? 0} | ค้างเข้า: {r.quantity_pending ?? 0}
                                        </div>
                                    </div>
                                </div>

                                <div>{statusChip(r.product_status)}</div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Dialog: Add new */}
            <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth maxWidth="sm">
                <DialogTitle>เพิ่มสินค้าใหม่</DialogTitle>
                <DialogContent className="!pt-4">
                    <div className="flex flex-col gap-3">
                        <TextField
                            label="ชื่อสินค้า"
                            value={form.name ?? ""}
                            onChange={onChange("name")}
                            fullWidth
                            autoFocus
                            error={!!errors.name}                 // ★
                            helperText={errors.name ?? ""}        // ★
                            onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
                        />

                        <TextField
                            label="ลิงก์รูปภาพ (เช่น Cloudinary URL)"
                            value={form.image ?? ""}
                            onChange={onChange("image")}
                            fullWidth
                            placeholder="https://res.cloudinary.com/.../image.jpg"
                            error={!!errors.image}                // ★
                            helperText={errors.image ?? ""}       // ★
                        />

                        <TextField
                            label="หน่วยนับ (เช่น ชิ้น, กล่อง)"
                            value={form.unit ?? ""}
                            onChange={onChange("unit")}
                            fullWidth
                            error={!!errors.unit}                 // ★
                            helperText={errors.unit ?? ""}        // ★
                        />

                        {/* ถ้า CategorySelect รองรับ prop error/helperText ก็ส่งลงไปได้
   ไม่งั้นอย่างน้อยส่งค่าและโชว์ข้อความใต้คอมโพเนนต์ */}
                        <CategorySelect
                            form={form}
                            setForm={setForm}
                            categories={categories}
                            setCategories={setCategories}
                            loadingCategories={!!loadingCategories}
                        />
                        {errors.category_id && (
                            <div className="text-red-600 text-sm mt-1">{errors.category_id}</div> // ★ แสดง error หมวดหมู่
                        )}

                        <TextField
                            label="คำอธิบาย"
                            value={form.description ?? ""}
                            onChange={onChange("description")}
                            fullWidth
                            multiline
                            minRows={3}
                            error={!!errors.description}          // ★
                            helperText={errors.description ?? ""} // ★
                        />

                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAdd(false)}>ยกเลิก</Button>
                    <Button onClick={handleSave} disabled={saving} variant="contained">
                        {saving ? "กำลังบันทึก..." : "บันทึก"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
