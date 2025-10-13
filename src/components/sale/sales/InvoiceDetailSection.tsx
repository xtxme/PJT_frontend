'use client';
import styled from 'styled-components';

const Frame = styled.div`
  background: white; border-radius: 10px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.1);
  padding: 16px 20px;
  display: flex; justify-content: space-between;
`;

export default function InvoiceDetailSection({ invoiceNo, date }: any) {
  return (
    <Frame>
      <div>🧾 เลขที่บิล: {invoiceNo}</div>
      <div>📅 วันที่: {date}</div>
    </Frame>
  );
}
