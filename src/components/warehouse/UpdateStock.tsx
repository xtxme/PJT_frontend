'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    CircularProgress,
    Typography,
    Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

interface Product {
    id: string;
    image?: string;
    name: string;
    company?: string;
    systemQty: number;
    latestQty: number;
    newQty: number;
    match: boolean;
    count_note?: string;
}

export default function UpdateStockPage() {
    const [data, setData] = useState<Product[]>([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // โหลดข้อมูลจาก backend
    useEffect(() => {
        const fetchStock = async () => {
            try {
                const res = await axios.get('http://localhost:5002/warehouse/update/stock');
                setData(res.data);
            } catch (err) {
                console.error('❌ Error fetching stock data:', err);
                alert('❌ โหลดข้อมูลสินค้าไม่สำเร็จ');
            } finally {
                setLoading(false);
            }
        };
        fetchStock();
    }, []);

    // ตัวกรองสินค้า
    const filtered = data.filter((item) => {
        const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
        const matchFilter =
            filter === ''
                ? true
                : filter === 'match'
                    ? item.match
                    : !item.match;
        return matchSearch && matchFilter;
    });

    // ตรวจสอบค่าที่กรอก
    const validateQty = (product: Product): boolean => {
        const qty = product.newQty;
        const name = product.name;

        if (isNaN(qty)) {
            alert(`⚠️ ${name}: กรุณากรอกเป็นตัวเลขเท่านั้น`);
            return false;
        }
        if (qty < 0) {
            alert(`⚠️ ${name}: จำนวนต้องไม่ติดลบ`);
            return false;
        }
        if (!Number.isInteger(qty)) {
            alert(`⚠️ ${name}: กรุณากรอกจำนวนเต็ม`);
            return false;
        }
        if (qty > product.systemQty * 10) {
            alert(`⚠️ ${name}: จำนวนสูงเกินจริง`);
            return false;
        }
        return true;
    };

    // เปลี่ยนค่าที่พิมพ์
    const handleQtyChange = (id: string, newValue: string) => {
        const parsed = Number(newValue);
        setData((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, newQty: isNaN(parsed) ? 0 : parsed } : item
            )
        );
    };

    // กดบันทึก
    const handleSave = async (id: string) => {
        const target = data.find((p) => p.id === id);
        if (!target) return;

        // ตรวจสอบค่าก่อน
        if (!validateQty(target)) return;

        // Alert ยืนยัน
        const confirmed = window.confirm(
            `ยืนยันจะอัปเดตจำนวนสินค้า "${target.name}" เป็น ${target.newQty} ชิ้นใช่หรือไม่?`
        );
        if (!confirmed) return;

        setSaving(true);
        try {
            await axios.put(`http://localhost:5002/warehouse/update/stock/${id}`, {
                counted_qty: target.newQty,
                count_note: target.count_note ?? '',
            });

            alert(`✅ อัปเดตจำนวนสินค้า "${target.name}" สำเร็จแล้ว!`);

            // โหลดข้อมูลใหม่
            const res = await axios.get('http://localhost:5002/warehouse/update/stock');
            setData(res.data);
        } catch (err) {
            console.error('❌ Error updating stock:', err);
            alert(`❌ เกิดข้อผิดพลาดในการบันทึก "${target.name}"`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-4">
            <Typography variant="h6" gutterBottom>
                📦 การนับสต็อกสินค้า
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                ตรวจสอบและอัปเดตจำนวนสินค้าคงคลังให้ตรงกับจำนวนจริง
            </Typography>

            {/* Search + Filter */}
            <Box
                display="flex"
                alignItems="center"
                gap={2}
                mb={3}
                sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}
            >
                <TextField
                    fullWidth
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
                />

                <FormControl sx={{ minWidth: 160 }}>
                    <InputLabel>สถานะ</InputLabel>
                    <Select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        label="สถานะ"
                    >
                        <MenuItem value="">
                            <em>ทั้งหมด</em>
                        </MenuItem>
                        <MenuItem value="match">ตรงกับระบบ</MenuItem>
                        <MenuItem value="notMatch">ไม่ตรงกับระบบ</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" py={5}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box display="flex" flexDirection="column" gap={2}>
                    {filtered.map((item) => (
                        <Paper
                            key={item.id}
                            elevation={2}
                            sx={{
                                p: 2,
                                borderRadius: 3,
                                borderLeft: `6px solid ${item.match ? '#4CAF50' : '#F44336'}`,
                            }}
                        >
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                flexWrap="wrap"
                                gap={2}
                            >
                                <Box>
                                    <Typography fontWeight={600}>{item.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        บริษัท: {item.company ?? '-'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ระบบ: {item.systemQty} | ล่าสุด: {item.latestQty}
                                    </Typography>
                                </Box>

                                <Box display="flex" gap={1} alignItems="center">
                                    <TextField
                                        label="นับได้"
                                        type="number"
                                        size="small"
                                        value={item.newQty}
                                        onChange={(e) =>
                                            handleQtyChange(item.id, e.target.value)
                                        }
                                        inputProps={{
                                            min: 0,
                                            max: item.systemQty * 10,
                                            step: 1,
                                        }}
                                        sx={{ width: 110 }}
                                    />
                                    <Button
                                        variant="contained"
                                        disabled={saving}
                                        onClick={() => handleSave(item.id)}
                                        sx={{
                                            textTransform: 'none',
                                            borderRadius: '10px',
                                        }}
                                    >
                                        บันทึก
                                    </Button>
                                </Box>
                            </Box>

                            {!item.match && (
                                <Typography
                                    variant="body2"
                                    color="error"
                                    sx={{ mt: 1, fontStyle: 'italic' }}
                                >
                                    ⚠️ จำนวนไม่ตรงกับระบบ
                                </Typography>
                            )}
                        </Paper>
                    ))}

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
