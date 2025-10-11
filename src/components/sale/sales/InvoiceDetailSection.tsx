'use client';
import styled from 'styled-components';

const Frame = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  padding: 16px 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const InfoItem = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 4px 0;
`;

export default function InvoiceDetailSection({
  invoiceNo,
  date,
}: {
  invoiceNo: string;
  date: string;
}) {
  return (
    <Frame>
      <InfoItem>🧾 เลขที่บิล: {invoiceNo}</InfoItem>
      <InfoItem>📅 วันที่: {date}</InfoItem>
    </Frame>
  );
}
