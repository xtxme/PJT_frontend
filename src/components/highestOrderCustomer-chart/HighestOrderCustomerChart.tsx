'use client';

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import styled from 'styled-components';

const highestOrderCustomers = [
  { name: 'นาย A', value: 480000 },
  { name: 'นาย B', value: 360000 },
  { name: 'นาย C', value: 240000 },
  { name: 'นาย D', value: 180000 },
  { name: 'นาย E', value: 180000 },
  { name: 'นาย F', value: 120000 },

];

const SLICE_COLORS = ['#df7544', '#ef8f62', '#f2a37f', '#f5b89b', '#f8ccb8', '#fbe1d4'];

const ChartCard = styled.article`
  background: #ffffff;
  border-radius: 25px;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  box-shadow: 0 24px 48px rgba(15, 15, 15, 0.08);
  border: 1px solid rgba(15, 15, 15, 0.06);
  width: 100%;
  font-family: var(--font-ibm-plex-sans-thai), 'IBM Plex Sans Thai', sans-serif;
`;

const ChartTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: #1f2024;
  margin: 0;
  text-align: center;
`;

const ChartWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ChartShadow = styled.div`
  width: 100%;
  max-width: 320px;
  display: flex;
  justify-content: center;
  filter: drop-shadow(0 20px 36px rgba(15, 15, 15, 0.12));
`;

const ChartCanvas = styled.div`
  width: 100%;
  height: 260px;

  @media (max-width: 768px) {
    height: 220px;
  }
`;

const LegendGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(140px, 1fr));
  gap: 18px 24px;
  justify-items: center;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 500;
  color: #3c3c3c;
`;

const LegendDot = styled.span<{ $color: string }>`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

export default function HighestOrderCustomerChart() {
  return (
    <ChartCard>
      <ChartTitle>Highest Order Value by Customer</ChartTitle>
      <ChartWrapper>
        <ChartShadow>
          <ChartCanvas>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={highestOrderCustomers}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={72}
                  outerRadius={112}
                  paddingAngle={2}
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
                  cursor={{ fill: 'rgba(159, 166, 176, 0.08)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCanvas>
        </ChartShadow>
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
