'use client';
import styled from 'styled-components';

const CardStyled = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
`;

export default function CustomerSection({ customers, selectedCustomer, setSelectedCustomer }: any) {
  const selected = customers.find((c: any) => c.id === selectedCustomer);

  return (
    <CardStyled>
      <h3>เลือกลูกค้า</h3>
      <select
        value={selectedCustomer}
        onChange={(e) => setSelectedCustomer(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          marginBottom: '12px',
        }}
      >
        <option value="">-- เลือกลูกค้า --</option>
        {customers.map((c: any) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {selected && (
        <div style={{ background: '#f9fafb', borderRadius: 8, padding: 10 }}>
          <div>👤 {selected.name}</div>
          <div>📍 {selected.address}</div>
        </div>
      )}
    </CardStyled>
  );
}
