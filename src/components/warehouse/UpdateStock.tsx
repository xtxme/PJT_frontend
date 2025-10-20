'use client';

import { useMemo, useState } from 'react';
import {
    Box, Button, CircularProgress, FormControl, InputAdornment, InputLabel,
    MenuItem, Paper, Select, TextField, Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type Product = {
    id: string;
    name: string;
    company?: string;
    systemQty: number;
    latestQty: number;
    newQty: number;
    match: boolean;
    count_note?: string;         // โน้ตที่ “อยู่ในระบบ” (เดิม)
    last_counted_at?: string | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '';
// ตัวอย่าง .env.local:

async function api<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, init);
    if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.message ?? `HTTP ${res.status}`);
    }
    return res.json();
}

async function fetchStock(): Promise<Product[]> {
    return api<Product[]>('/warehouse/update/stock');
}

export default function UpdateStock() {
    const qc = useQueryClient();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['stockList'],
        queryFn: fetchStock,
    });

    // เก็บการแก้ต่อแถวแบบ local
    const [editing, setEditing] = useState<Record<string, Partial<Product>>>({});

    const handleChange = (id: string, key: keyof Product, value: any) => {
        setEditing((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }));
    };

    // PUT — บันทึก “ผลนับ” (ไม่ปรับ quantity ในระบบ)
    const saveCount = useMutation({
        mutationFn: async (p: Product) => {
            return api(`/warehouse/update/stock/${p.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    counted_qty: p.newQty,
                    count_note: p.count_note ?? '', // เก็บโน้ตใหม่ (หรือเดิม) ไปพร้อมกัน
                }),
            });
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['stockList'] }),
    });

    // PATCH — ปรับ “จำนวนในระบบ” ให้เท่ากับที่นับได้
    const adjustQty = useMutation({
        mutationFn: async (p: Product) => {
            return api(`/warehouse/products/${p.id}/adjust-quantity`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quantity: p.newQty,
                    note: p.count_note ?? '',
                }),
            });
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['stockList'] }),
    });

    const filtered = useMemo(() => {
        if (!data) return [];
        return data.filter((item) => {
            const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
            const matchFilter = filter === '' ? true : filter === 'match' ? item.match : !item.match;
            return matchSearch && matchFilter;
        });
    }, [data, search, filter]);

    return (
        <div className="p-2">
            <Typography variant="h6" gutterBottom>📦 การนับสต็อกสินค้า</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                ตรวจสอบและอัปเดตจำนวนเมื่อ “นับจริง” ไม่ตรงกับ “ในระบบ”
            </Typography>

            {/* Search + Filter */}
            <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                <TextField
                    variant="outlined"
                    placeholder="ค้นหาสินค้า..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ flex: 1, minWidth: 200 }}
                />
                <FormControl sx={{ minWidth: 160 }}>
                    <InputLabel>สถานะ</InputLabel>
                    <Select value={filter} onChange={(e) => setFilter(e.target.value)} label="สถานะ">
                        <MenuItem value=""><em>ทั้งหมด</em></MenuItem>
                        <MenuItem value="match">ตรงกับระบบ</MenuItem>
                        <MenuItem value="notMatch">ไม่ตรงกับระบบ</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {isLoading ? (
                <Box display="flex" justifyContent="center" py={5}><CircularProgress /></Box>
            ) : (
                <Box display="flex" flexDirection="column" gap={2}>
                    {filtered.map((item) => {
                        const local = editing[item.id] || {};
                        const merged: Product = { ...item, ...local };

                        return (
                            <Paper
                                key={item.id}
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    borderLeft: `6px solid ${item.match ? '#4CAF50' : '#F44336'}`,
                                }}
                            >
                                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                                    <Box>
                                        <Typography fontWeight={600}>{item.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            บริษัท: {item.company ?? '-'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            ระบบ: {item.systemQty} | ล่าสุด: {item.latestQty}
                                        </Typography>

                                        {/* ✅ โชว์ “โน้ตเดิมในระบบ” ถ้ามี */}
                                        {item.count_note && (
                                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                โน้ตก่อนหน้า: <em>{item.count_note}</em>
                                            </Typography>
                                        )}
                                    </Box>

                                    <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                                        <TextField
                                            label="นับได้"
                                            type="number"
                                            size="small"
                                            value={merged.newQty}
                                            onChange={(e) => handleChange(item.id, 'newQty', Number(e.target.value))}
                                            sx={{ width: 110 }}
                                            inputProps={{ min: 0, step: 1 }}
                                        />
                                        <TextField
                                            label="โน้ต (แก้ไข/เพิ่ม)"
                                            size="small"
                                            value={merged.count_note ?? item.count_note ?? ''} // ถ้า local ยังไม่เคยแก้ ให้โชว์โน้ตเดิม
                                            onChange={(e) => handleChange(item.id, 'count_note', e.target.value)}
                                            sx={{ minWidth: 200 }}
                                        />

                                        <Button
                                            variant="outlined"
                                            size="small"
                                            disabled={saveCount.isPending}
                                            onClick={() => saveCount.mutate(merged)}
                                            sx={{ borderRadius: '10px', textTransform: 'none' }}
                                        >
                                            {saveCount.isPending ? 'กำลังบันทึก…' : 'บันทึกผลนับ'}
                                        </Button>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            disabled={adjustQty.isPending}
                                            onClick={() => adjustQty.mutate(merged)}
                                            sx={{ borderRadius: '10px', textTransform: 'none' }}
                                        >
                                            {adjustQty.isPending ? 'กำลังปรับ…' : 'ปรับจำนวนในระบบ'}
                                        </Button>
                                    </Box>
                                </Box>

                                {!item.match && (
                                    <Typography variant="body2" color="error" sx={{ mt: 1, fontStyle: 'italic' }}>
                                        ⚠️ จำนวนไม่ตรงกับระบบ
                                    </Typography>
                                )}
                            </Paper>
                        );
                    })}

                    {filtered.length === 0 && (
                        <Typography align="center" color="text.secondary" py={4}>
                            ไม่พบข้อมูลสินค้า
                        </Typography>
                    )}
                </Box>
            )}
        </div>
    );
}
