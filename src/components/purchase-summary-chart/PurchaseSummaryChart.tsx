'use client';

import styled from 'styled-components';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const data = [
    { month: 'Jan', sales: 6500 },
    { month: 'Feb', sales: 12000 },
    { month: 'Mar', sales: 18500 },
    { month: 'Apr', sales: 32000 },
    { month: 'May', sales: 8000 },
    { month: 'Jun', sales: 21000 },
    { month: 'Jul', sales: 26000 },
    { month: 'Aug', sales: 6500 },
    { month: 'Sep', sales: 12000 },
    { month: 'Oct', sales: 18500 },
    { month: 'Nov', sales: 32000 },
    { month: 'Dec', sales: 21000 },
];

const formatCurrency = (value: number) => `${Math.round(value / 1000)}K`;

const PurchaseChartCard = styled.article`
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
`;

const Text = styled.div`
    display: flex;
    width: 128px;
    height: 22px;
    flex-direction: column;
    justify-content: center;
    font-size: 13px;
    color: #6d7e9c;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 320px;

  @media (max-width: 768px) {
    height: 260px;
  }
`;

export default function PurchaseSummaryChart() {
    return (
        <PurchaseChartCard>
            <ChartTitle>Stock In Purchase Summary</ChartTitle>
            <Text>ยอดสั่งซื้อสินค้าเข้า</Text>
            <ChartWrapper>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <defs>
                        <linearGradient id="saleGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#000000" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                        </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="8 12" stroke="#dbe2ef" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6d7e9c', fontSize: 12, fontWeight: 500 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6d7e9c', fontSize: 12, fontWeight: 500 }}
                            tickFormatter={formatCurrency}
                            domain={[0, 40000]}
                        />
                        <Tooltip
                            cursor={{ strokeDasharray: '3 3', stroke: '#a0aec0' }}
                            formatter={(value: number | string) => [`฿${Number(value).toLocaleString()}`, 'ยอดขาย']}
                            labelStyle={{ color: ' #000000', fontWeight: 600 }}
                            wrapperStyle={{ outline: 'none' }}
                            />
                            <Area
                            type="monotone"
                            dataKey="sales"
                            stroke="#df7544"
                            strokeWidth={3}
                            fill="url(#saleGradient)"
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartWrapper>
        </PurchaseChartCard>
    );
}