'use client';

import { useState } from 'react';
import styled from 'styled-components';
import CustomerCard from '@/components/sale/CustomerCard';

const mockCustomersWithTotal = [
  { id: 'C001', name: 'Alice', totalPaid: 12500, address: '123 ถนนนิมมานเหมินท์ ต.สุเทพ อ.เมือง จ.เชียงใหม่' },
  { id: 'C002', name: 'Bob', totalPaid: 8900, address: '45/2 ซอยสวนดอก อ.เมือง จ.เชียงใหม่' },
  { id: 'C003', name: 'Charlie', totalPaid: 0, address: '77 หมู่บ้านพฤกษา ต.สันทราย อ.สันทราย จ.เชียงใหม่' },
  { id: 'C004', name: 'David', totalPaid: 5600, address: '99/5 หมู่ 8 ต.ท่าวังตาล อ.สารภี จ.เชียงใหม่' },
  { id: 'C005', name: 'Ella', totalPaid: 4500, address: '222 หมู่ 3 ต.แม่เหียะ อ.เมือง จ.เชียงใหม่' },
  { id: 'C006', name: 'Frank', totalPaid: 7200, address: '12/7 ถนนช้างคลาน อ.เมือง จ.เชียงใหม่' },
];


const PageContainer = styled.div`
  padding: 20px;
  color: #000;
`;

export default function CustomerCardsPage() {
  const [customers] = useState(mockCustomersWithTotal);
  const grandTotal = customers.reduce((sum, c) => sum + c.totalPaid, 0);

  return (
    <PageContainer>
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
        <span>👥</span> ลูกค้าทั้งหมด
      </h2>
      <p className="text-gray-500 mb-3 text-sm">
        แสดงรายชื่อลูกค้าทั้งหมดและยอดชำระล่าสุด
      </p>

      <div className="flex flex-col gap-3">
        {customers.map((c) => (
          <CustomerCard key={c.id} customer={c} />
        ))}
      </div>

      <div style={{ marginTop: 20, fontWeight: 'bold' }}>
        💰 ยอดรวมทั้งหมด: {grandTotal.toLocaleString()} THB
      </div>
    </PageContainer>
  );
}
