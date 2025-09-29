'use client';
import { useState } from 'react';
import styled from 'styled-components';

const mockInvoices = [
  { id: 'inv1', customer: 'Alice', date: '2025-09-29', total: 12500, fileUrl: 'https://cmu.to/arsaapply' },
  { id: 'inv2', customer: 'Bob', date: '2025-09-28', total: 8900, fileUrl: '/bills/inv2.pdf' },
  { id: 'inv3', customer: 'Charlie', date: '2025-09-27', total: 0, fileUrl: '/bills/inv3.pdf' },
];

const PageContainer = styled.div`
  padding: 20px;
  color: #000;
`;

const Header = styled.h1`
  font-size: 24px;
  margin-bottom: 16px;
`;

const TableContainer = styled.div`
  max-height: 500px; // กำหนดความสูงตาราง
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const InvoiceTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  vertical-align: middle; /* ให้เนื้อหากลางแนวตั้ง */
  text-align: center;
`;

const TableHeader = styled.th`
  position: sticky;
  top: 0;
  background: #f5f5f5;
  padding: 8px;
  border-bottom: 1px solid #ddd;
`;

const TableCell = styled.td`
  padding: 8px;
  border-bottom: 1px solid #eee;
`;

const FileButton = styled.a`
  background-color: #1c4bb9;
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #153a8d;
  }
`;

export default function InvoiceListPage() {
  const [invoices] = useState(mockInvoices);

  const grandTotal = invoices.reduce((sum, inv) => sum + inv.total, 0);

  return (
    <PageContainer>
      <Header>บิลทั้งหมด</Header>
      <TableContainer>
        <InvoiceTable>
          <thead>
            <tr>
              <TableHeader>บิล</TableHeader>
              <TableHeader>ลูกค้า</TableHeader>
              <TableHeader>วันที่</TableHeader>
              <TableHeader>ยอดรวม (THB)</TableHeader>
              <TableHeader>ไฟล์บิล</TableHeader>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id}>
                <TableCell>{inv.id}</TableCell>
                <TableCell>{inv.customer}</TableCell>
                <TableCell>{inv.date}</TableCell>
                <TableCell>{inv.total.toLocaleString()}</TableCell>
                <TableCell>
                  <FileButton href={inv.fileUrl} target="_blank" rel="noopener noreferrer">
                    เปิดบิล
                  </FileButton>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </InvoiceTable>
      </TableContainer>
      <div style={{ marginTop: 16, fontWeight: 'bold' }}>
        ยอดรวมบิลทั้งหมด: {grandTotal.toLocaleString()} THB
      </div>
    </PageContainer>
  );
}