'use client';

import { useState } from 'react';
import styled from 'styled-components';
import CustomerCard from '@/components/sale/CustomerCard';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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

const mockCustomersWithTotal = [
  { id: 'C001', name: 'Alice', totalPaid: 12500, address: '123 ถนนนิมมานเหมินท์ ต.สุเทพ อ.เมือง จ.เชียงใหม่' },
  { id: 'C002', name: 'Bob', totalPaid: 8900, address: '45/2 ซอยสวนดอก อ.เมือง จ.เชียงใหม่' },
  { id: 'C003', name: 'Charlie', totalPaid: 0, address: '77 หมู่บ้านพฤกษา ต.สันทราย อ.สันทราย จ.เชียงใหม่' },
  { id: 'C004', name: 'David', totalPaid: 5600, address: '99/5 หมู่ 8 ต.ท่าวังตาล อ.สารภี จ.เชียงใหม่' },
  { id: 'C005', name: 'Ella', totalPaid: 4500, address: '222 หมู่ 3 ต.แม่เหียะ อ.เมือง จ.เชียงใหม่' },
  { id: 'C006', name: 'Frank', totalPaid: 7200, address: '12/7 ถนนช้างคลาน อ.เมือง จ.เชียงใหม่' },
];

export default function CustomerCardsPage() {
  const [customers, setCustomers] = useState(mockCustomersWithTotal);
  const [open, setOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newTotal, setNewTotal] = useState('');

  const grandTotal = customers.reduce((sum, c) => sum + c.totalPaid, 0);

  const handleAddCustomer = () => {
    if (!newName.trim() || !newAddress.trim()) {
      alert('กรุณากรอกชื่อและที่อยู่ลูกค้าให้ครบ');
      return;
    }

    const newCustomer = {
      id: `C${(customers.length + 1).toString().padStart(3, '0')}`,
      name: newName.trim(),
      address: newAddress.trim(),
      totalPaid: newTotal === '' ? 0 : Number(newTotal),
    };

    setCustomers([newCustomer, ...customers]);
    setNewName('');
    setNewAddress('');
    setNewTotal('');
    setOpen(false);
  };

  return (
    <PageContainer>
      {/* 🔹 ส่วนหัว */}
      <HeaderRow>
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span>👥</span> ลูกค้าทั้งหมด
          </h2>
          <p className="text-gray-500 text-sm">
            แสดงรายชื่อลูกค้าทั้งหมดและยอดชำระล่าสุด
          </p>
        </div>

        {/* 🔘 ปุ่มเปิด popup */}
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

      {/* 🔹 Popup สำหรับเพิ่มลูกค้า */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>+ เพิ่มลูกค้าใหม่</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="ชื่อลูกค้า"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            fullWidth
          />
          <TextField
            label="ที่อยู่ลูกค้า"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            fullWidth
            multiline
          />
          <TextField
            label="ยอดชำระเริ่มต้น (THB)"
            type="number"
            value={newTotal}
            onChange={(e) => setNewTotal(e.target.value)}
            fullWidth
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{ textTransform: 'none', color: '#777' }}
          >
            ยกเลิก
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none', borderRadius: '10px' }}
            onClick={handleAddCustomer}
          >
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🔹 รายการลูกค้า */}
      <div className="flex flex-col gap-3">
        {customers.map((c) => (
          <CustomerCard key={c.id} customer={c} />
        ))}
      </div>

      {/* 🔹 สรุปยอดรวมทั้งหมด */}
      <div style={{ marginTop: 20, fontWeight: 'bold' }}>
        💰 ยอดรวมทั้งหมด: {grandTotal.toLocaleString()} THB
      </div>
    </PageContainer>
  );
}
