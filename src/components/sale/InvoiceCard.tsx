'use client';

import styled from 'styled-components';
import { Button } from '@mui/material';

const InvoiceCardStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 10px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  .in-card {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding-left: 20px;
    width: 100%;

    .invoice-id {
      flex: 1 1 150px;
      font-weight: 500;
      color: #1c4bb9;
    }

    .invoice-detail {
      flex: 1 1 180px;
      color: #444;
    }

    .invoice-amount {
      flex: 1 1 120px;
      font-weight: 600;
      color: #2e7d32;
    }

    @media screen and (max-width: 1200px) {
      .invoice-id {
        flex-basis: 100%;
      }
      .invoice-detail {
        flex: 1 1 45%;
      }
    }
  }
`;

export default function InvoiceCard({ invoice }: { invoice: any }) {
  return (
    <InvoiceCardStyled className="border-for-card">
      <div className="flex flex-col pl-4 w-full">
        {/* วันที่ */}
        <div className="text-sm text-gray-600 flex items-center gap-2 mb-1">
          📅 <span>{invoice.date}</span>
        </div>

        {/* รายละเอียดบิล */}
        <div className="in-card">
          <p className="invoice-id">🧾 {invoice.id}</p>
          <p className="invoice-detail">ลูกค้า: {invoice.customer}</p>
          <p className="invoice-amount">ยอดรวม: {invoice.total.toLocaleString()} ฿</p>
        </div>
      </div>

      {/* ปุ่มเปิดไฟล์ */}
      <Button
        variant="contained"
        color="primary"
        sx={{
          textWrap: 'nowrap',
          padding: '12px 20px',
          mr: 2,
          borderRadius: '12px',
          boxShadow: 1,
          textTransform: 'none',
          fontWeight: 500,
        }}
        href={invoice.fileUrl}
        target="_blank"
      >
        เปิดบิล
      </Button>
    </InvoiceCardStyled>
  );
}
