'use client';

import { useMemo } from 'react';
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

type PurchaseSummaryPoint = {
  month_key: string;
  total_value: number;
};

type PurchaseSummaryChartProps = {
  points: PurchaseSummaryPoint[];
  isLoading: boolean;
  error: string | null;
};

const compactCurrencyFormatter = new Intl.NumberFormat('th-TH', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const currencyFormatter = new Intl.NumberFormat('th-TH', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

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

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6d7e9c;
  font-size: 14px;
`;

export default function PurchaseSummaryChart({ points, isLoading, error }: PurchaseSummaryChartProps) {
  const chartData = useMemo(() => {
    return points.map((point) => {
      const [yearPart, monthPart] = point.month_key.split('-');
      const year = Number(yearPart);
      const monthIndex = Number(monthPart) - 1;
      const labelDate =
        Number.isInteger(year) && Number.isInteger(monthIndex) ? new Date(year, monthIndex, 1) : null;

      const monthLabel =
        labelDate && !Number.isNaN(labelDate.getTime())
          ? labelDate.toLocaleDateString('th-TH', {
              month: 'short',
              year: '2-digit',
            })
          : point.month_key;

      const rawTotal = point.total_value;
      const totalValue =
        typeof rawTotal === 'number'
          ? rawTotal
          : rawTotal != null
            ? Number(rawTotal)
            : 0;

      return {
        month: monthLabel,
        totalValue: Number.isFinite(totalValue) ? totalValue : 0,
      };
    });
  }, [points]);

  const maxTotalValue = chartData.reduce((max, item) => {
    return item.totalValue > max ? item.totalValue : max;
  }, 0);

  const yDomainMax = maxTotalValue > 0 ? Math.ceil(maxTotalValue * 1.1) : 1;

  const renderContent = () => {
    if (isLoading) {
      return <Placeholder>กำลังโหลด...</Placeholder>;
    }

    if (error) {
      return <Placeholder>{error}</Placeholder>;
    }

    if (chartData.length === 0) {
      return <Placeholder>ไม่มีข้อมูลสำหรับช่วงเวลานี้</Placeholder>;
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="purchaseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EFBE46" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#EFBE46" stopOpacity={0} />
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
            tickFormatter={(value: number) => compactCurrencyFormatter.format(value)}
            domain={[0, yDomainMax]}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3', stroke: '#a0aec0' }}
            formatter={(value: number | string) => [
              `฿${currencyFormatter.format(Number(value))}`,
              'ยอดรวมมูลค่าสั่งสินค้าเข้า',
            ]}
            labelStyle={{ color: '#000000', fontWeight: 600 }}
            wrapperStyle={{ outline: 'none' }}
          />
          <Area
            type="monotone"
            dataKey="totalValue"
            stroke="#EFBE46"
            strokeWidth={3}
            fill="url(#purchaseGradient)"
            dot={false}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  return (
    <PurchaseChartCard>
      <ChartTitle>Stock In Purchase Summary</ChartTitle>
      <Text>ยอดสั่งซื้อสินค้าเข้า</Text>
      <ChartWrapper>{renderContent()}</ChartWrapper>
    </PurchaseChartCard>
  );
}
