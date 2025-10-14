'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import {
    Autocomplete,
    CircularProgress,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import type { Category, ProductForm } from "@/app/types/warehouse";
import { z } from "zod";

type CategoryOption =
    | Category
    | { createNew: true; label: string; inputText: string };

const toDisplay = (c: Category) => c.name;

/* ---------- Zod schema ---------- */
const CategoryCreateSchema = z.object({
    name: z.string().trim().min(1, "กรุณาระบุชื่อหมวดหมู่").max(80, "ชื่อยาวเกินไป"),
});

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
    // Autocomplete state
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<Category[]>([]);
    const abortRef = useRef<AbortController | null>(null);

    // Dialog สร้างหมวดหมู่
    const [addOpen, setAddOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [adding, setAdding] = useState(false);
    const [addErr, setAddErr] = useState<string | null>(null);
    const canAdd = newName.trim().length > 0;

    // seed options จาก props.categories
    useEffect(() => {
        if (categories?.length) setOptions(categories);
    }, [categories]);

    // debounce 300ms
    const debouncedInput = useDebounce(input, 300);

    useEffect(() => {
        if (!open) return;
        fetchCategories(debouncedInput).catch(() => {});
    }, [open, debouncedInput]);

    async function fetchCategories(keyword: string) {
        abortRef.current?.abort();
        const ac = new AbortController();
        abortRef.current = ac;
        setLoading(true);
        try {
            const url = `/warehouse/categories?q=${encodeURIComponent(keyword)}&page=1&pageSize=10`;
            const res = await fetch(url, { cache: "no-store", signal: ac.signal });
            if (!res.ok) throw new Error("โหลดหมวดหมู่ไม่สำเร็จ");
            const j = await res.json();
            const rows: Category[] = j?.data ?? (Array.isArray(j) ? j : []);
            setOptions(rows);
        } finally {
            setLoading(false);
        }
    }

    const mergedOptions: CategoryOption[] = useMemo(() => {
        const base = options;
        const text = input.trim();
        if (text && !loading) {
            return [
                ...base,
                { createNew: true, label: `+ เพิ่มหมวดหมู่ใหม่… (${text})`, inputText: text },
            ];
        }
        return base;
    }, [options, input, loading]);

    const getOptionLabel = (opt: CategoryOption) =>
        "createNew" in opt ? opt.label : toDisplay(opt);

    const isOptionEqualToValue = (a: CategoryOption, b: Category | null) =>
        !("createNew" in a) && !!b && a.id === b.id;

    const selected =
        (form.category_id != null &&
            options.find((c) => c.id === form.category_id)) ||
        null;

    async function handleAddCategory() {
        // validate
        const parsed = CategoryCreateSchema.safeParse({ name: newName });
        if (!parsed.success) {
            setAddErr(parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง");
            return;
        }

        setAdding(true);
        setAddErr(null);
        try {
            const res = await fetch("/warehouse/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                cache: "no-store",
                body: JSON.stringify({ name: parsed.data.name }),
            });
            const t = await res.text().catch(() => "");
            if (!res.ok) {
                const msg = safeParseMsg(t) ?? "สร้างหมวดหมู่ไม่สำเร็จ";
                throw new Error(msg);
            }
            const j = safeParseJson(t) ?? {};
            const created: Category = { id: j.id, name: parsed.data.name };

            setOptions((prev) => [created, ...prev]);
            setCategories((prev) => {
                const exists = prev.some(
                    (c) => c.name.trim().toLowerCase() === created.name.toLowerCase()
                );
                const next = exists ? prev : [created, ...prev];
                next.sort((a, b) => a.name.localeCompare(b.name, "th"));
                return [...next];
            });
            setForm((s) => ({ ...s, category_id: created.id }));

            setAddOpen(false);
            setNewName("");
        } catch (e: any) {
            setAddErr(e?.message ?? "เกิดข้อผิดพลาด");
        } finally {
            setAdding(false);
        }
    }

    return (
        <>
            <Autocomplete<CategoryOption, false, false, false>
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                loading={loading || loadingCategories}
                options={mergedOptions}
                value={selected}
                getOptionLabel={getOptionLabel}
                isOptionEqualToValue={(a, b) => isOptionEqualToValue(a, b as Category)}
                renderOption={(props, option) => {
                    if ("createNew" in option) {
                        return (
                            <li {...props} key="__create_new__" style={{ fontStyle: "italic" }}>
                                {option.label}
                            </li>
                        );
                    }
                    return (
                        <li {...props} key={option.id}>
                            <div style={{ fontWeight: 500 }}>{option.name}</div>
                        </li>
                    );
                }}
                onInputChange={(_, v) => setInput(v)}
                onChange={(_, v) => {
                    if (!v) {
                        setForm((s) => ({ ...s, category_id: null }));
                        return;
                    }
                    if ("createNew" in v) {
                        setNewName(v.inputText);
                        setAddOpen(true);
                        return;
                    }
                    setForm((s) => ({ ...s, category_id: v.id }));
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="หมวดหมู่"
                        placeholder="พิมพ์เพื่อค้นหาหมวดหมู่"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading || loadingCategories ? <CircularProgress size={18} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                        fullWidth
                    />
                )}
            />

            {/* Dialog เพิ่มหมวดหมู่ */}
            <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>เพิ่มหมวดหมู่ใหม่</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        label="ชื่อหมวดหมู่ *"
                        value={newName}
                        onChange={(e) => {
                            setNewName(e.target.value);
                            setAddErr(null);
                        }}
                        error={!!addErr}
                        helperText={addErr}
                        autoFocus
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddOpen(false)}>ยกเลิก</Button>
                    <Button onClick={handleAddCategory} disabled={!canAdd || adding} variant="contained">
                        {adding ? "กำลังบันทึก…" : "บันทึก"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

/* ---------- helpers ---------- */
function useDebounce<T>(val: T, ms: number) {
    const [v, setV] = useState(val);
    useEffect(() => {
        const id = setTimeout(() => setV(val), ms);
        return () => clearTimeout(id);
    }, [val, ms]);
    return v;
}
function safeParseMsg(t: string) {
    try {
        const j = JSON.parse(t);
        return j?.message ?? null;
    } catch {
        return null;
    }
}
function safeParseJson(t: string) {
    try {
        return JSON.parse(t);
    } catch {
        return null;
    }
}
