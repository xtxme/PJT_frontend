'use client';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
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
`;

export default function CustomerList() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [search, setSearch] = useState('');

    // ฟอร์ม
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState('');
    const [totalPaid, setTotalPaid] = useState('');

    const grandTotal = customers.reduce((sum, c) => sum + Number(c.totalPaid || 0), 0);

    // โหลดลูกค้าเริ่มต้น
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

    // ✅ realtime search (delay 300ms ป้องกันยิง API ถี่เกิน)
    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchCustomers(search);
        }, 300);
        return () => clearTimeout(timeout);
    }, [search]);

    // เปิด popup แก้ไข
    const handleOpenEdit = (c: Customer) => {
        setEditingCustomer(c);
        setName(c.name);
        setAddress(c.address || '');
        setEmail(c.email || '');
        setTel(c.tel || '');
        setTotalPaid(String(c.totalPaid || 0));
        setOpen(true);
    };

    // เปิด popup เพิ่ม
    const handleOpenAdd = () => {
        setEditingCustomer(null);
        setName('');
        setAddress('');
        setEmail('');
        setTel('');
        setTotalPaid('');
        setOpen(true);
    };

    // ✅ บันทึก (เพิ่มหรือแก้ไข) แล้วอัปเดต list ทันที
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
                    // แก้ไข → อัปเดตใน state
                    setCustomers((prev) =>
                        prev.map((c) => (c.id === editingCustomer.id ? data.data : c))
                    );
                } else {
                    // เพิ่มใหม่ → ใส่ไว้บนสุด
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

    // ถ้ายังโหลดอยู่
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
            <HeaderRow>
                <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">👥 ลูกค้าทั้งหมด</h2>
                    <p className="text-gray-500 text-sm">ค้นหา แก้ไข และเพิ่มลูกค้าใหม่</p>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <TextField
                        size="small"
                        placeholder="🔍 พิมพ์ชื่อ/เบอร์/อีเมล..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
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
                </div>
            </HeaderRow>

            {/* การ์ดลูกค้า */}
            {customers.length > 0 ? (
                customers.map((c) => (
                    <CustomerCard key={c.id} customer={c} onEdit={handleOpenEdit} />
                ))
            ) : (
                <div style={{ marginTop: 20, color: '#999', fontStyle: 'italic' }}>
                    ❗ ไม่พบข้อมูลลูกค้า
                </div>
            )}

            {/* รวมยอดทั้งหมด */}
            <div style={{ marginTop: 20, fontWeight: 'bold' }}>
                💰 ยอดรวมทั้งหมด: {grandTotal.toLocaleString()} THB
            </div>

            {/* Popup เพิ่ม/แก้ไข */}
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
