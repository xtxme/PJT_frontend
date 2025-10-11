'use client';

import styled from 'styled-components';
import { Button } from '@mui/material';

const CustomerCardStyled = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.15);
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .name {
    font-size: 18px;
    font-weight: 600;
    color: #1c4bb9;
  }

  .id {
    font-size: 14px;
    color: #777;
  }

  .address {
    font-size: 14px;
    color: #444;
    line-height: 1.4;
    max-width: 500px;
  }

  .total {
    font-size: 16px;
    font-weight: bold;
    color: #2e7d32;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    .address {
      max-width: 100%;
    }

    button {
      align-self: flex-end;
    }
  }

`;

export default function CustomerCard({ customer }: { customer: any }) {
  return (
    <CustomerCardStyled>
      <div className="info">
        <p className="name">{customer.name}</p>
        <p className="id">ID: {customer.id}</p>
        <p className="address">📍 {customer.address}</p>
        <p className="total">ยอดจ่าย: {customer.totalPaid.toLocaleString()} THB</p>
      </div>

      <Button
        variant="contained"
        color="primary"
        sx={{
          textWrap: 'nowrap',
          padding: '10px 16px',
          borderRadius: '10px',
          boxShadow: 1,
          textTransform: 'none',
          fontWeight: 500,
        }}
        onClick={() => {
          alert(`เปิดข้อมูลลูกค้า: ${customer.name}`);
        }}
      >
        รายละเอียด
      </Button>
    </CustomerCardStyled>
  );
}
