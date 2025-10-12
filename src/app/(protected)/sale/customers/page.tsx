'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import CustomerCard from '@/components/sale/CustomerCard';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';

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

export default function CustomerCardsPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newTotal, setNewTotal] = useState('');
  const [saving, setSaving] = useState(false);

  const grandTotal = customers.reduce((sum, c) => sum + (c.totalPaid || 0), 0);

  // ✅ โหลดข้อมูลจาก backend
  useEffect(() => {
    const fetchCustomers = async () => {
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
    fetchCustomers();
  }, []);

  // ✅ เพิ่มลูกค้าใหม่
  const handleAddCustomer = async () => {
    if (!newName.trim() || !newAddress.trim()) {
      alert('กรุณากรอกชื่อและที่อยู่ลูกค้าให้ครบ');
      return;
    }

    try {
      setSaving(true);
      const res = await fetch('http://localhost:5002/sale/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          address: newAddress,
          totalPaid: newTotal === '' ? 0 : Number(newTotal),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCustomers((prev) => [data.data, ...prev]);
        setOpen(false);
        setNewName('');
        setNewAddress('');
        setNewTotal('');
      } else {
        alert(data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      console.error('❌ เพิ่มลูกค้าล้มเหลว:', err);
      alert('เกิดข้อผิดพลาดในการเพิ่มลูกค้า');
    } finally {
      setSaving(false);
    }
  };

  // ✅ Loading
  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center gap-3">
          <CircularProgress size={22} />
          <span>กำลังโหลดข้อมูลลูกค้า...</span>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <HeaderRow>
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span>👥</span> ลูกค้าทั้งหมด
          </h2>
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
          onClick={() => setOpen(true)}
        >
          + เพิ่มลูกค้าใหม่
        </Button>
      </HeaderRow>

      {/* Popup */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>+ เพิ่มลูกค้าใหม่</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="ชื่อลูกค้า" value={newName} onChange={(e) => setNewName(e.target.value)} fullWidth />
          <TextField label="ที่อยู่ลูกค้า" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} fullWidth multiline />
          <TextField label="ยอดชำระเริ่มต้น (THB)" type="number" value={newTotal} onChange={(e) => setNewTotal(e.target.value)} fullWidth />
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
            onClick={handleAddCustomer}
          >
            {saving ? 'กำลังบันทึก...' : 'บันทึก'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* รายการลูกค้า */}
      <div className="flex flex-col gap-3">
        {customers.length === 0 ? (
          <p className="text-gray-500 text-sm">ยังไม่มีข้อมูลลูกค้า</p>
        ) : (
          customers.map((c) => <CustomerCard key={c.id} customer={c} />)
        )}
      </div>

      {/* สรุปยอดรวม */}
      <div style={{ marginTop: 20, fontWeight: 'bold' }}>
        💰 ยอดรวมทั้งหมด: {grandTotal.toLocaleString()} THB
      </div>
    </PageContainer>
  );
}
