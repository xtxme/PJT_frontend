'use client';
import { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import CustomerCard, { Customer } from './CustomerCard';

const PageContainer = styled.div`
  padding: 20px;
  color: #000;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 10px;
`;

export default function CustomerList() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [search, setSearch] = useState('');

    // form
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState('');
    const [totalPaid, setTotalPaid] = useState('');

    // sorting
    const [sortField, setSortField] = useState<'name' | 'totalPaid' | 'id'>('id');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const grandTotal = customers.reduce((sum, c) => sum + Number(c.totalPaid || 0), 0);

    const fetchCustomers = async (keyword = '') => {
        try {
            const res = await fetch(
                `http://localhost:5002/sale/customers/search?keyword=${encodeURIComponent(keyword)}`
            );
            const data = await res.json();
            if (data.success) setCustomers(data.data);
        } catch (err) {
            console.error('❌ โหลดข้อมูลลูกค้าล้มเหลว:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // realtime search
    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchCustomers(search);
        }, 300);
        return () => clearTimeout(timeout);
    }, [search]);

    // เรียงข้อมูล (computed)
    const sortedCustomers = useMemo(() => {
        const sorted = [...customers];
        sorted.sort((a, b) => {
            let valA: any = a[sortField];
            let valB: any = b[sortField];
            if (sortField === 'name') {
                valA = valA?.toString().toLowerCase() || '';
                valB = valB?.toString().toLowerCase() || '';
            } else if (sortField === 'totalPaid') {
                valA = Number(valA || 0);
                valB = Number(valB || 0);
            }
            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [customers, sortField, sortOrder]);

    const handleOpenEdit = (c: Customer) => {
        setEditingCustomer(c);
        setName(c.name);
        setAddress(c.address || '');
        setEmail(c.email || '');
        setTel(c.tel || '');
        setTotalPaid(String(c.totalPaid || 0));
        setOpen(true);
    };

    const handleOpenAdd = () => {
        setEditingCustomer(null);
        setName('');
        setAddress('');
        setEmail('');
        setTel('');
        setTotalPaid('');
        setOpen(true);
    };

    const handleSave = async () => {
        if (!name.trim() || !address.trim()) {
            alert('⚠️ กรุณากรอกชื่อและที่อยู่');
            return;
        }

        setSaving(true);
        try {
            let res;
            if (editingCustomer) {
                res = await fetch(
                    `http://localhost:5002/sale/customers/${editingCustomer.id}`,
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, address, email, tel, totalPaid }),
                    }
                );
            } else {
                res = await fetch('http://localhost:5002/sale/customers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, address, email, tel, totalPaid }),
                });
            }

            const data = await res.json();
            if (data.success && data.data) {
                if (editingCustomer) {
                    setCustomers((prev) =>
                        prev.map((c) => (c.id === editingCustomer.id ? data.data : c))
                    );
                } else {
                    setCustomers((prev) => [data.data, ...prev]);
                }
                setOpen(false);
            } else {
                alert('❌ บันทึกล้มเหลว');
            }
        } catch (err) {
            console.error('❌ บันทึกล้มเหลว:', err);
            alert('❌ เกิดข้อผิดพลาดในการบันทึก');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <PageContainer>
                <CircularProgress size={22} />
                <span> กำลังโหลดข้อมูลลูกค้า...</span>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">👥 ลูกค้าทั้งหมด</h2>
            <p className="text-gray-500 mb-3 text-sm">ค้นหา แก้ไข เพิ่ม และเรียงลำดับลูกค้า</p>

            <HeaderRow>
                <TextField
                    size="small"
                    placeholder="🔍 พิมพ์ชื่อ/เบอร์/อีเมล..."
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ flex: 1, minWidth: 200 }}
                />
                <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>เรียงตาม</InputLabel>
                    <Select
                        value={sortField}
                        label="เรียงตาม"
                        onChange={(e) => setSortField(e.target.value as any)}
                    >
                        <MenuItem value="id">วันที่ล่าสุด</MenuItem>
                        <MenuItem value="name">ชื่อลูกค้า</MenuItem>
                        <MenuItem value="totalPaid">ยอดรวม</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    variant="outlined"
                    onClick={() =>
                        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                    }
                >
                    {sortOrder === 'asc' ? '⬇️ น้อย → มาก' : '⬆️ มาก → น้อย'}
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#16a34a',
                        '&:hover': { backgroundColor: '#15803d' },
                        borderRadius: '10px',
                        textTransform: 'none',
                        color: '#fff',
                    }}
                    onClick={handleOpenAdd}
                >
                    + เพิ่มลูกค้าใหม่
                </Button>
            </HeaderRow>

            {sortedCustomers.length > 0 ? (
                sortedCustomers.map((c) => (
                    <CustomerCard key={c.id} customer={c} onEdit={handleOpenEdit} />
                ))
            ) : (
                <div style={{ marginTop: 20, color: '#999', fontStyle: 'italic' }}>
                    ❗ ไม่พบข้อมูลลูกค้า
                </div>
            )}

            <div style={{ marginTop: 20, fontWeight: 'bold' }}>
                💰 ยอดรวมทั้งหมด: {grandTotal.toLocaleString()} THB
            </div>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>
                    {editingCustomer ? '✏️ แก้ไขลูกค้า' : '+ เพิ่มลูกค้าใหม่'}
                </DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
                >
                    <TextField label="ชื่อ-นามสกุล" value={name} onChange={(e) => setName(e.target.value)} />
                    <TextField label="ที่อยู่" value={address} onChange={(e) => setAddress(e.target.value)} multiline />
                    <TextField label="อีเมล" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextField label="เบอร์โทร" value={tel} onChange={(e) => setTel(e.target.value)} />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpen(false)} sx={{ textTransform: 'none', color: '#777' }}>
                        ยกเลิก
                    </Button>
                    <Button
                        variant="contained"
                        disabled={saving}
                        sx={{
                            textTransform: 'none',
                            borderRadius: '10px',
                            backgroundColor: saving ? '#9ca3af' : '#2563eb',
                            '&:hover': { backgroundColor: saving ? '#9ca3af' : '#1d4ed8' },
                        }}
                        onClick={handleSave}
                    >
                        {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                    </Button>
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
}
