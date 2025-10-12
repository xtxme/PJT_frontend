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
  IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

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

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 16px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export default function CustomerCardsPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);

  // ฟอร์ม
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [totalPaid, setTotalPaid] = useState('');

  const grandTotal = customers.reduce(
    (sum, c) => sum + Number(c.totalPaid || 0),
    0
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5002/sale/customers');
        const data = await res.json();
        if (data.success) setCustomers(data.data);
      } catch (err) {
        console.error('❌ โหลดข้อมูลลูกค้าล้มเหลว:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setName('');
    setAddress('');
    setEmail('');
    setTel('');
    setTotalPaid('');
    setOpen(true);
  };

  const handleOpenEdit = (c: any) => {
    setEditingCustomer(c);
    setName(c.name);
    setAddress(c.address || '');
    setEmail(c.email || '');
    setTel(c.tel || '');
    setTotalPaid(c.totalPaid || 0);
    setOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !address.trim()) {
      alert('กรุณากรอกชื่อและที่อยู่');
      return;
    }

    setSaving(true);
    try {
      if (editingCustomer) {
        const res = await fetch(`http://localhost:5002/sale/customers/${editingCustomer.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, address, email, tel, totalPaid }),
        });
        const data = await res.json();
        if (data.success) {
          setCustomers((prev) =>
            prev.map((c) => (c.id === editingCustomer.id ? data.data : c))
          );
        }
      } else {
        const res = await fetch('http://localhost:5002/sale/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, address, email, tel, totalPaid }),
        });
        const data = await res.json();
        if (data.success) {
          setCustomers((prev) => [data.data, ...prev]);
        }
      }
      setOpen(false);
    } catch (err) {
      alert('❌ บันทึกล้มเหลว');
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
      <HeaderRow>
        <div>
          <h2>👥 ลูกค้าทั้งหมด</h2>
          <p className="text-gray-500 text-sm">แสดงรายชื่อลูกค้าทั้งหมดและยอดชำระล่าสุด</p>
        </div>
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

      {customers.map((c) => (
        <Card key={c.id}>
          <Info>
            <strong>{c.name}</strong>
            <span>📍 {c.address || '-'}</span>
            <span>📞 {c.tel || '-'}</span>
            <span>✉️ {c.email || '-'}</span>
            <span>💰 {Number(c.totalPaid || 0).toLocaleString()} THB</span>
          </Info>
          <div>
            <IconButton onClick={() => handleOpenEdit(c)} color="primary">
              <Edit />
            </IconButton>
          </div>
        </Card>
      ))}

      <div style={{ marginTop: 20, fontWeight: 'bold' }}>
        💰 ยอดรวมทั้งหมด: {grandTotal.toLocaleString()} THB
      </div>

      {/* Popup Add/Edit */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingCustomer ? '✏️ แก้ไขลูกค้า' : '+ เพิ่มลูกค้าใหม่'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="ชื่อ-นามสกุล" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="ที่อยู่" value={address} onChange={(e) => setAddress(e.target.value)} multiline />
          <TextField label="อีเมล" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="เบอร์โทร" value={tel} onChange={(e) => setTel(e.target.value)} />
          <TextField
            label="ยอดชำระเริ่มต้น (THB)"
            type="number"
            value={totalPaid}
            onChange={(e) => setTotalPaid(e.target.value)}
          />
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
