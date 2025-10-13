'use client';
import styled from 'styled-components';

const Card = styled.div`
  background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  padding: 20px; display: flex; flex-direction: column;
`;

export default function CustomerSection({ customers, selectedCustomer, setSelectedCustomer }: any) {
  const customer = customers.find((c: any) => c.id === Number(selectedCustomer));

  return (
    <Card>
      <h3 className="font-semibold mb-3">เลือกลูกค้า</h3>
      <select
        value={selectedCustomer}
        onChange={(e) => setSelectedCustomer(e.target.value)}
        style={{ padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
      >
        <option value="">-- เลือกลูกค้า --</option>
        {customers.map((c: any) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      {customer && (
        <div style={{ marginTop: 10, background: '#f9fafb', padding: 12, borderRadius: 8 }}>
          👤 {customer.name}<br />
          📍 {customer.address}
        </div>
      )}
    </Card>
  );
}
