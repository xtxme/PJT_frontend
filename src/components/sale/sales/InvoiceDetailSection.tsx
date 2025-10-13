'use client';
import styled from 'styled-components';

const Frame = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.1);
  padding: 16px 20px;

  /* ✅ จัดเรียงในแนวตั้ง (2 แถว) และชิดซ้ายทั้งหมด */
  display: flex;
  flex-direction: column;
  justify-content: center; /* อยู่กลางในแนว Y */
  align-items: flex-start; /* ชิดซ้ายทั้งหมด */

  min-height: 120px; /* เพิ่มพื้นที่ให้ดูสมดุล */
  line-height: 1.6;

`;

export default function InvoiceDetailSection({ invoiceNo, date }: any) {
  return (
    <Frame>
      <p className="font-semibold mb-2">🧾 เลขที่บิล: {invoiceNo}</p>
      <p className="font-semibold mb-2">📅 วันที่: {date}</p>
    </Frame>
  );
}
