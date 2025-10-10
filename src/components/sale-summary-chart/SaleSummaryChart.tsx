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

type SaleSummaryPoint = {
  month: string;
  totalSales: number;
};

type SaleSummaryChartProps = {
  points: SaleSummaryPoint[];
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

export default function SaleSummaryChart({ points, isLoading, error }: SaleSummaryChartProps) {
  const chartData = useMemo(() => {
    return points.map((point) => {
      const [yearPart, monthPart] = point.month.split('-');
      const year = Number(yearPart);
      const monthIndex = Number(monthPart) - 1;
      const labelDate = Number.isInteger(year) && Number.isInteger(monthIndex)
        ? new Date(year, monthIndex, 1)
        : null;

      const monthLabel =
        labelDate && !Number.isNaN(labelDate.getTime())
          ? labelDate.toLocaleDateString('th-TH', {
              month: 'short',
              year: '2-digit',
            })
          : point.month;

      const rawTotal = point.totalSales;
      const totalSalesValue =
        typeof rawTotal === 'number'
          ? rawTotal
          : rawTotal != null
            ? Number(rawTotal)
            : 0;

      const totalSales = Number.isFinite(totalSalesValue) ? totalSalesValue : 0;

      return {
        month: monthLabel,
        totalSales,
      };
    });
  }, [points]);

  const maxTotalSales = chartData.reduce((max, item) => {
    return item.totalSales > max ? item.totalSales : max;
  }, 0);

  const yDomainMax = maxTotalSales > 0 ? Math.ceil(maxTotalSales * 1.1) : 1;

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
            <linearGradient id="saleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#df7544" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#df7544" stopOpacity={0} />
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
              'ยอดขาย',
            ]}
            labelStyle={{ color: ' #000000', fontWeight: 600 }}
            wrapperStyle={{ outline: 'none' }}
          />
          <Area
            type="monotone"
            dataKey="totalSales"
            stroke="#df7544"
            strokeWidth={3}
            fill="url(#saleGradient)"
            dot={false}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  return (
    <ChartCard>
      <ChartTitle>Sale Summary</ChartTitle>
      <Text>ยอดขายสินค้า</Text>
      <ChartWrapper>{renderContent()}</ChartWrapper>
    </ChartCard>
  );
}
