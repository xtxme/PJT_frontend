'use client';

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import styled from 'styled-components';

const highestOrderCustomers = [
  { name: 'นาย A', value: 480000 },
  { name: 'นาย B', value: 360000 },
  { name: 'นาย C', value: 240000 },
  { name: 'นาย D', value: 180000 },
];

const SLICE_COLORS = ['#df7544', '#5d5fef', '#23856d', '#f4a261'];

const ChartCard = styled.article`
  background: #ffffff;
  border-radius: 25px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 20px 40px rgba(15, 15, 15, 0.06);
  border: 1px solid rgba(15, 15, 15, 0.08);
  width: 100%;
  font-family: var(--font-ibm-plex-sans-thai), 'IBM Plex Sans Thai', sans-serif;
`;

const ChartTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: #1f2024;
  margin: 0;
`;

const ChartSubtitle = styled.p`
  font-size: 13px;
  color: #6d7e9c;
  margin: 0;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 280px;

  @media (max-width: 768px) {
    height: 240px;
  }
`;

const LegendGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px 24px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #6d7e9c;
`;

const LegendDot = styled.span<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

export default function HighestOrderCustomerChart() {
  return (
    <ChartCard>
      <ChartTitle>Highest Order Value by Customer</ChartTitle>
      <ChartSubtitle>มูลค่าสูงสุดที่ลูกค้าทำการสั่งซื้อในช่วงที่ผ่านมา</ChartSubtitle>
      <ChartWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={highestOrderCustomers}
              dataKey="value"
              nameKey="name"
              innerRadius={72}
              outerRadius={110}
              paddingAngle={3}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {highestOrderCustomers.map((entry, index) => (
                <Cell key={entry.name} fill={SLICE_COLORS[index % SLICE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number | string) => [`฿${Number(value).toLocaleString()}`, 'มูลค่าการสั่งซื้อ']}
              labelStyle={{ color: '#1f2024', fontWeight: 600 }}
              wrapperStyle={{ borderRadius: 12, border: '1px solid rgba(15, 15, 15, 0.08)' }}
              cursor={{ fill: 'rgba(159, 166, 176, 0.12)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartWrapper>
      <LegendGrid>
        {highestOrderCustomers.map((customer, index) => (
          <LegendItem key={customer.name}>
            <LegendDot $color={SLICE_COLORS[index % SLICE_COLORS.length]} />
            {customer.name}
          </LegendItem>
        ))}
      </LegendGrid>
    </ChartCard>
  );
}
