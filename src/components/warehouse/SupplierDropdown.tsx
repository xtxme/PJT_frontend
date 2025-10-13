'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Autocomplete, CircularProgress, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

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
        if (!canAdd) return;
        setAdding(true);
        try {
            const res = await fetch('/warehouse/suppliers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
                body: JSON.stringify({
                    company_name: newName.trim(),
                    email: newEmail.trim() || null,
                    tel: newTel.trim() || null,
                }),
            });
            if (!res.ok) {
                const t = await res.text().catch(() => '');
                const msg = safeParseMsg(t) ?? 'เพิ่มซัพพลายเออร์ไม่สำเร็จ';
                throw new Error(msg);
            }
            const created: SupplierLite = await res.json();
            // อัปเดต options ให้มีตัวใหม่ และเลือกให้ทันที
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
                        // เปิด dialog เพิ่มใหม่ โดยเติมชื่อจาก input
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
                            onChange={(e) => setNewName(e.target.value)}
                            autoFocus
                        />
                        <TextField
                            label="อีเมล"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                        />
                        <TextField
                            label="เบอร์โทร"
                            value={newTel}
                            onChange={(e) => setNewTel(e.target.value)}
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
