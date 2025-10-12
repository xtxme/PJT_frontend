'use client';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

const Frame = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
`;

const InfoItem = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

export default function InvoiceDetailSection() {
  const [invoiceNo, setInvoiceNo] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    setInvoiceNo(`INV-${Date.now().toString().slice(-6)}`);
    setDate(new Date().toLocaleDateString('th-TH'));
  }, []);

  return (
    <Frame>
      <InfoItem>🧾 เลขที่บิล: {invoiceNo}</InfoItem>
      <InfoItem>📅 วันที่: {date}</InfoItem>
    </Frame>
  );
}
