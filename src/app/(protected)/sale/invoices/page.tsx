'use client';

import { useState } from 'react';
import styled from 'styled-components';
import InvoiceCard from '@/components/sale/InvoiceCard';

const mockInvoices = [
  { id: 'INV-001', customer: 'Alice', date: '2025-09-29', total: 12500, fileUrl: 'https://cmu.to/arsaapply', status: 'สำเร็จ' },
  { id: 'INV-002', customer: 'Bob', date: '2025-09-28', total: 8900, fileUrl: '/bills/inv2.pdf', status: 'ยกเลิก' },
  { id: 'INV-003', customer: 'Charlie', date: '2025-09-27', total: 0, fileUrl: '/bills/inv3.pdf', status: 'สำเร็จ' },
];

const PageContainer = styled.div`
  padding: 20px;
  color: #000;
`;

export default function InvoiceListPage() {
  const [invoices, setInvoices] = useState(mockInvoices);
  const grandTotal = invoices.reduce((sum, inv) => sum + inv.total, 0);

  const cancelInvoice = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id && inv.status !== 'ยกเลิก'
          ? { ...inv, status: 'ยกเลิก' }
          : inv
      )
    );
  };

  return (
    <PageContainer>
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
        <span>🧾</span> บิลทั้งหมด
      </h2>
      <p className="text-gray-500 mb-3 text-sm">
        รายการบิลที่ออกทั้งหมด พร้อมสถานะและยอดรวมสุทธิ
      </p>

      <div className="flex flex-col gap-3">
        {invoices.map((invoice) => (
          <InvoiceCard
            key={invoice.id}
            invoice={invoice}
            onCancel={cancelInvoice}
          />
        ))}
      </div>

      <div style={{ marginTop: 20, fontWeight: 'bold' }}>
        💰 ยอดรวมบิลทั้งหมด: {grandTotal.toLocaleString()} THB
      </div>
    </PageContainer>
  );
}
