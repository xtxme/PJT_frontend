'use client';

import styled from 'styled-components';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const topSellerData = [
  { name: 'สินค้า A', units: 12000 },
  { name: 'สินค้า B', units: 28000 },
  { name: 'สินค้า C', units: 20000 },
  { name: 'สินค้า D', units: 30000 },
  { name: 'สินค้า E', units: 9000 },
  { name: 'สินค้า F', units: 22000 },
];

const formatOrderTick = (value: number) => (value === 0 ? '0' : `${Math.round(value / 1000)}K`);

const ChartCard = styled.article`
  background: #ffffff;
  border-radius: 25px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 20px 40px rgba(15, 15, 15, 0.06);
  border: 1px solid rgba(15, 15, 15, 0.08);
  width: 100%;
  font-family: var(--font-ibm-plex-sans-thai), 'IBM Plex Sans Thai', sans-serif;
`;

const Text = styled.div`
    display: flex;
    width: 100px;
    height: 22px;
    flex-direction: column;
    justify-content: center;
    font-size: 13px;
    color: #6d7e9c;
`;

const ChartTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: #1f2024;
  margin: 0;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 320px;

  @media (max-width: 768px) {
    height: 260px;
  }
`;

export default function DeadStockChart() {
  return (
    <ChartCard>
      <ChartTitle>Dead Stock</ChartTitle>
      <Text>ยอดสต็อกค้าง</Text>
      <ChartWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topSellerData}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="6 12" stroke="#dbe2ef" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6d7e9c', fontSize: 13, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6d7e9c', fontSize: 13, fontWeight: 500 }}
              tickFormatter={formatOrderTick}
              domain={[0, 30000]}
              label={{
                value: 'ยอดสั่งซื้อ',
                angle: -90,
                position: 'insideLeft',
                dx: -10,
                style: { fill: '#6d7e9c', fontSize: 14, fontWeight: 500 },
              }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(159, 166, 176, 0.12)' }}
              formatter={(value: number | string) => [`฿${Number(value).toLocaleString()}`, 'ยอดสั่งซื้อ']}
              labelStyle={{ color: '#1f2024', fontWeight: 600 }}
              wrapperStyle={{ borderRadius: 12, border: '1px solid rgba(15, 15, 15, 0.08)' }}
            />
            <Bar
              dataKey="units"
              fill="#df7544"
              radius={[14, 14, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </ChartCard>
  );
}
