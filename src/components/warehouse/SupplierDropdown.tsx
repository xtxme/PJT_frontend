'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Autocomplete, CircularProgress, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { z } from 'zod';

export type SupplierLite = { id: number; company_name: string; email?: string | null; tel?: string | null };

type Props = {
    value: SupplierLite | null;
    onChange: (v: SupplierLite | null) => void;
    label?: string;
};

type SupplierOption =
    | SupplierLite
    | { createNew: true; label: string; inputText: string };

const toDisplay = (s: SupplierLite) => s.company_name;

/* ---------- Zod schemas ---------- */
const SupplierCreateSchema = z.object({
    company_name: z.string().trim().min(1, 'กรุณาระบุชื่อบริษัท'),
    email: z
        .string()
        .trim()
        .optional()
        .transform((v) => (v === '' ? undefined : v))
        .pipe(z.string().email('อีเมลไม่ถูกต้อง').optional()),
    tel: z
        .string()
        .trim()
        .optional()
        .transform((v) => (v === '' ? undefined : v))
        .refine(
            (v) => v == null || /^[0-9+\-\s]{6,30}$/.test(v),
            { message: 'เบอร์โทรไม่ถูกต้อง' }
        ),
});

type SupplierCreate = z.infer<typeof SupplierCreateSchema>;

export default function SupplierDropdown({ value, onChange, label = 'ซัพพลายเออร์' }: Props) {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<SupplierLite[]>([]);
    const abortRef = useRef<AbortController | null>(null);

    // ---- เพิ่มใหม่ (Dialog) ----
    const [addOpen, setAddOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newTel, setNewTel] = useState('');
    const [adding, setAdding] = useState(false);
    const canAdd = newName.trim().length > 0;

    // error state จาก zod
    const [addErr, setAddErr] = useState<{ name?: string; email?: string; tel?: string }>({});

    // debounce 300ms
    const debouncedInput = useDebounce(input, 300);

    useEffect(() => {
        if (!open) return;
        fetchSuppliers(debouncedInput).catch(() => {});
    }, [open, debouncedInput]);

    async function fetchSuppliers(keyword: string) {
        abortRef.current?.abort();
        const ac = new AbortController();
        abortRef.current = ac;
        setLoading(true);
        try {
            const url = `/warehouse/suppliers?q=${encodeURIComponent(keyword)}&page=1&pageSize=10`;
            const res = await fetch(url, { cache: 'no-store', signal: ac.signal });
            if (!res.ok) throw new Error('โหลดไม่สำเร็จ');
            const j = await res.json();
            const rows: SupplierLite[] = j?.data ?? (Array.isArray(j) ? j : []);
            setOptions(rows);
        } finally {
            setLoading(false);
        }
    }

    const mergedOptions: SupplierOption[] = useMemo(() => {
        const base = options;
        const text = input.trim();
        if (text && !loading) {
            // แทรกตัวเลือก "เพิ่มใหม่"
            return [
                ...base,
                { createNew: true, label: `+ เพิ่มซัพพลายเออร์ใหม่… (${text})`, inputText: text },
            ];
        }
        return base;
    }, [options, input, loading]);

    const getOptionLabel = (opt: SupplierOption) =>
        'createNew' in opt ? opt.label : toDisplay(opt);

    const isOptionEqualToValue = (a: SupplierOption, b: SupplierLite) =>
        !('createNew' in a) && a.id === b?.id;

    async function handleAddSupplier() {
        // validate ด้วย Zod
        const parsed = SupplierCreateSchema.safeParse({
            company_name: newName,
            email: newEmail,
            tel: newTel,
        } satisfies SupplierCreate);

        if (!parsed.success) {
            // map error ไป state
            const fieldErrs: { name?: string; email?: string; tel?: string } = {};
            for (const issue of parsed.error.issues) {
                const p = issue.path[0];
                if (p === 'company_name') fieldErrs.name = issue.message;
                if (p === 'email') fieldErrs.email = issue.message;
                if (p === 'tel') fieldErrs.tel = issue.message;
            }
            setAddErr(fieldErrs);
            return;
        }

        setAdding(true);
        setAddErr({});
        try {
            const payload = {
                company_name: parsed.data.company_name.trim(),
                email: parsed.data.email ?? null,
                tel: parsed.data.tel ?? null,
            };

            const res = await fetch('/warehouse/suppliers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const t = await res.text().catch(() => '');
                const msg = safeParseMsg(t) ?? 'เพิ่มซัพพลายเออร์ไม่สำเร็จ';
                throw new Error(msg);
            }
            const created: SupplierLite = await res.json();

            setOptions((prev) => [created, ...prev]);
            onChange(created);
            setAddOpen(false);
            setNewName('');
            setNewEmail('');
            setNewTel('');
        } catch (e: any) {
            alert(e?.message ?? 'เกิดข้อผิดพลาด');
        } finally {
            setAdding(false);
        }
    }

    return (
        <>
            <Autocomplete<SupplierOption, false, false, false>
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                loading={loading}
                options={mergedOptions}
                value={value ?? null}
                getOptionLabel={getOptionLabel}
                isOptionEqualToValue={(a, b) => isOptionEqualToValue(a, b as SupplierLite)}
                renderOption={(props, option) => {
                    if ('createNew' in option) {
                        return (
                            <li {...props} key="__create_new__" style={{ fontStyle: 'italic' }}>
                                {option.label}
                            </li>
                        );
                    }
                    const sub = option.email || option.tel || '-';
                    return (
                        <li {...props} key={option.id}>
                            <div>
                                <div style={{ fontWeight: 500 }}>{option.company_name}</div>
                                <div style={{ opacity: 0.7, fontSize: 12 }}>{sub}</div>
                            </div>
                        </li>
                    );
                }}
                onInputChange={(_, v) => setInput(v)}
                onChange={(_, v) => {
                    if (!v) return onChange(null);
                    if ('createNew' in v) {
                        setNewName(v.inputText);
                        setAddOpen(true);
                        return;
                    }
                    onChange(v);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        placeholder="พิมพ์ชื่อบริษัทเพื่อค้นหา"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress size={18} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />

            {/* Dialog เพิ่มซัพพลายเออร์ */}
            <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>เพิ่มซัพพลายเออร์ใหม่</DialogTitle>
                <DialogContent dividers>
                    <div className="grid gap-3 py-2">
                        <TextField
                            label="ชื่อบริษัท *"
                            value={newName}
                            onChange={(e) => {
                                setNewName(e.target.value);
                                setAddErr((s) => ({ ...s, name: undefined }));
                            }}
                            error={!!addErr.name}
                            helperText={addErr.name}
                            autoFocus
                        />
                        <TextField
                            label="อีเมล"
                            value={newEmail}
                            onChange={(e) => {
                                setNewEmail(e.target.value);
                                setAddErr((s) => ({ ...s, email: undefined }));
                            }}
                            error={!!addErr.email}
                            helperText={addErr.email}
                        />
                        <TextField
                            label="เบอร์โทร"
                            value={newTel}
                            onChange={(e) => {
                                setNewTel(e.target.value);
                                setAddErr((s) => ({ ...s, tel: undefined }));
                            }}
                            error={!!addErr.tel}
                            helperText={addErr.tel}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddOpen(false)}>ยกเลิก</Button>
                    <Button onClick={handleAddSupplier} disabled={!canAdd || adding} variant="contained">
                        {adding ? 'กำลังบันทึก…' : 'บันทึก'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

function safeParseMsg(t: string) {
    try {
        const j = JSON.parse(t);
        return j?.message ?? null;
    } catch {
        return null;
    }
}

function useDebounce<T>(val: T, ms: number) {
    const [v, setV] = useState(val);
    useEffect(() => {
        const id = setTimeout(() => setV(val), ms);
        return () => clearTimeout(id);
    }, [val, ms]);
    return v;
}
