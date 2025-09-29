'use client';
import { useState } from 'react';
import styled from 'styled-components';

const mockCustomersWithTotal = [
  { id: 'c1', name: 'Alice', totalPaid: 12500 },
  { id: 'c2', name: 'Bob', totalPaid: 8900 },
  { id: 'c3', name: 'Charlie', totalPaid: 0 },
  { id: 'c4', name: 'Alice', totalPaid: 12500 },
  { id: 'c5', name: 'Bob', totalPaid: 8900 },
  { id: 'c6', name: 'Charlie', totalPaid: 0 },
];

const PageContainer = styled.div`
  // padding: 20px;
  color: #000000ff;
`;

const Header = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

const CustomerCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  }
`;

const CustomerName = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const CustomerId = styled.div`
  font-size: 14px;
  color: #555;
  margin-bottom: 12px;
`;

const TotalPaid = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #1c4bb9ff;
  text-align: right;
`;


export default function CustomerCardsPage() {
  const [customers] = useState(mockCustomersWithTotal);

  const grandTotal = customers.reduce((sum, c) => sum + c.totalPaid, 0);

  return (
    <PageContainer>
      <Header>ลูกค้าทั้งหมด</Header>
      <CardGrid>
        {customers.map(c => (
          <CustomerCard key={c.id}>
            <CustomerName>{c.name}</CustomerName>
            <CustomerId>ID: {c.id}</CustomerId>
            <TotalPaid>ยอดจ่าย: {c.totalPaid.toLocaleString()} THB</TotalPaid>
          </CustomerCard>
        ))}
      </CardGrid>
      <TotalPaid style={{ fontSize: 20, marginTop: 20 }}>ยอดรวมทั้งหมด: {grandTotal.toLocaleString()} THB</TotalPaid>
    </PageContainer>
  );
}