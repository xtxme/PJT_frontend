'use client';
import styled from 'styled-components';

const CardStyled = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #111827;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 6px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 12px;
  &:focus {
    outline: none;
    border-color: #1c4bb9;
    box-shadow: 0 0 4px rgba(28, 75, 185, 0.4);
  }
`;

const CustomerInfo = styled.div`
  font-size: 14px;
  color: #444;
  line-height: 1.6;
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px 14px;
  border: 1px solid #eee;
`;

const Name = styled.div`
  font-weight: 600;
  color: #1c4bb9;
`;

const Address = styled.div`
  font-size: 14px;
  margin-top: 4px;
`;

export default function CustomerSection({
  customers,
  selectedCustomer,
  setSelectedCustomer,
}: {
  customers: { id: string; name: string; address: string }[];
  selectedCustomer: string;
  setSelectedCustomer: (id: string) => void;
}) {
  const selectedCustomerData = customers.find((c) => c.id === selectedCustomer);

  return (
    <CardStyled>
      <Header>เลือกลูกค้า</Header>

      {/* Dropdown เลือกลูกค้า */}
      <Select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
        <option value="">-- เลือกลูกค้า --</option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>

      {/* แสดงข้อมูลลูกค้าที่เลือก */}
      {selectedCustomer && selectedCustomerData && (
        <CustomerInfo>
          <Name>👤 {selectedCustomerData.name}</Name>
          <Address>📍 {selectedCustomerData.address}</Address>
        </CustomerInfo>
      )}
    </CardStyled>
  );
}
