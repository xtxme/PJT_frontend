'use client';

import styled from 'styled-components';
import { Button } from '@mui/material';

const InvoiceCardStyled = styled.div`
  display: grid;
  grid-template-columns: 120px 120px 1.2fr 1fr 100px auto;
  align-items: center;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 14px 20px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.08);
  }

  > div {
    display: flex;
    align-items: center;
  }

  .date {
    color: #6b7280;
    font-size: 14px;
  }

  .id {
    font-weight: 600;
    color: #1c4bb9;
    font-size: 15px;
  }

  .customer {
    font-weight: 500;
    color: #374151;
  }

  .total {
    color: #15803d;
    font-weight: 600;
  }

  .buttons {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  font-size: 12.5px;
  font-weight: 600;
  color: #fff;
  border-radius: 8px;
  padding: 4px 10px;
  min-width: 60px;
  text-align: center;

  background-color: ${({ status }) =>
    status === 'สำเร็จ'
      ? '#2e7d32'
      : status === 'ยกเลิก'
        ? '#EF4444'
        : '#FACC15'};

  color: ${({ status }) =>
    status === 'ยกเลิก' || status === 'สำเร็จ' ? '#fff' : '#000'};
`;

interface Props {
  invoice: {
    id: number;
    date: string;
    customer: string;
    total: number;
    fileUrl: string;
    status: string;
  };
  onCancel: (id: number) => void;
}

export default function InvoiceCard({ invoice, onCancel }: Props) {
  const isCancelled = invoice.status === 'ยกเลิก';

  return (
    <InvoiceCardStyled>
      <div className="date">📅 {invoice.date}</div>
      <div className="id">{invoice.id}</div>
      <div className="customer">👤 {invoice.customer}</div>
      <div className="total">💰 {invoice.total.toLocaleString()} ฿</div>
      <div style={{ justifyContent: 'center' }}>
        <StatusBadge status={invoice.status}>{invoice.status}</StatusBadge>
      </div>
      <div className="buttons">
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#f97316',
            '&:hover': { backgroundColor: '#ea580c' },
            textTransform: 'none',
            borderRadius: '10px',
            fontWeight: 500,
            padding: '8px 16px',
          }}
          href={invoice.fileUrl}
          target="_blank"
        >
          เปิดบิล
        </Button>

        <Button
          variant="contained"
          disabled={isCancelled}
          sx={{
            backgroundColor: isCancelled ? '#9ca3af' : '#dc2626',
            '&:hover': {
              backgroundColor: isCancelled ? '#9ca3af' : '#b91c1c',
            },
            textTransform: 'none',
            borderRadius: '10px',
            fontWeight: 500,
            padding: '8px 16px',
            color: '#fff',
          }}
          onClick={() => !isCancelled && onCancel(invoice.id)}
        >
          ยกเลิกบิล
        </Button>
      </div>
    </InvoiceCardStyled>
  );
}
