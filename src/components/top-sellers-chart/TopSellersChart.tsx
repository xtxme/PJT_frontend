'use client';

import { useMemo } from 'react';
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

type TopSeller = {
  productId: number;
  name: string;
  orders: number;
  company?: string | null;
};

type RangeInfo = {
  start: string;
  end: string;
};

type TopSellersChartProps = {
  products: TopSeller[];
  isLoading: boolean;
  error: string | null;
  range?: RangeInfo | null;
};

const formatQuantityTick = (value: number) =>
  value === 0 ? '0' : `${Math.round(value / 1000)}K`;

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
    width: 58px;
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
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const RangeText = styled.span`
  font-size: 14px;
  font-weight: 400;
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
  text-align: center;
  color: #6d7e9c;
  font-size: 14px;
`;

const quantityFormatter = new Intl.NumberFormat('th-TH');
const rangeFormatter = new Intl.DateTimeFormat('th-TH', {
  month: 'short',
  year: 'numeric',
});

export default function TopSellersChart({
  products,
  isLoading,
  error,
  range,
}: TopSellersChartProps) {
  const chartData = useMemo(() => {
    return products
      .map((product) => {
        if (!product || typeof product !== 'object') {
          return null;
        }

        const nameValue =
          typeof product.name === 'string' && product.name.trim().length > 0
            ? product.name.trim()
            : `สินค้า #${product.productId}`;

        const numericOrders =
          typeof product.orders === 'number'
            ? product.orders
            : Number(product.orders ?? 0);

        const sanitizedOrders =
          typeof numericOrders === 'number' && Number.isFinite(numericOrders)
            ? numericOrders
            : 0;

        return {
          key: product.productId,
          name: nameValue,
          orders: sanitizedOrders,
          company:
            typeof product.company === 'string' && product.company.trim().length > 0
              ? product.company.trim()
              : null,
        };
      })
      .filter(
        (item): item is { key: number; name: string; orders: number; company: string | null } =>
          Boolean(item),
      );
  }, [products]);

  const maxOrders = useMemo(() => {
    if (chartData.length === 0) {
      return 0;
    }
    return chartData.reduce((max, item) => (item.orders > max ? item.orders : max), 0);
  }, [chartData]);

  const yDomainMax = useMemo(() => {
    if (maxOrders <= 0) {
      return 10;
    }

    const padded = Math.ceil(maxOrders * 1.1);
    return padded === maxOrders ? padded + 1 : padded;
  }, [maxOrders]);

  const formattedRange = useMemo(() => {
    if (!range?.start) {
      return null;
    }

    const startDate = new Date(range.start);
    if (Number.isNaN(startDate.getTime())) {
      return null;
    }

    let endDate: Date | null = null;
    if (range.end) {
      const parsedEnd = new Date(range.end);
      if (!Number.isNaN(parsedEnd.getTime())) {
        endDate = new Date(parsedEnd.getTime() - 1);
      }
    }

    const startLabel = rangeFormatter.format(startDate);

    if (!endDate) {
      return `ข้อมูล: ${startLabel}`;
    }

    const sameMonth =
      startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getMonth() === endDate.getMonth();

    if (sameMonth) {
      return `ข้อมูล: ${startLabel}`;
    }

    const endLabel = rangeFormatter.format(endDate);
    return `ข้อมูล: ${startLabel} - ${endLabel}`;
  }, [range]);

  const renderChart = () => {
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
        <BarChart
          data={chartData}
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
            tickFormatter={formatQuantityTick}
            domain={[0, yDomainMax]}
            label={{
              value: 'จำนวนที่ขาย (ชิ้น)',
              angle: -90,
              position: 'insideLeft',
              dx: -10,
              style: { fill: '#6d7e9c', fontSize: 14, fontWeight: 500 },
            }}
          />
          <Tooltip
            cursor={{ fill: 'rgba(159, 166, 176, 0.12)' }}
            formatter={(value: number | string, _name, entry) => {
              const numeric =
                typeof value === 'number'
                  ? value
                  : value != null
                    ? Number(value)
                    : 0;

              const sanitized =
                typeof numeric === 'number' && Number.isFinite(numeric) ? numeric : 0;

              const companyLabel =
                entry && typeof entry.payload?.company === 'string' && entry.payload.company
                  ? ` (${entry.payload.company})`
                  : '';

              return [`${quantityFormatter.format(sanitized)} ชิ้น`, `ยอดขาย${companyLabel}`];
            }}
            labelStyle={{ color: '#1f2024', fontWeight: 600 }}
            wrapperStyle={{ borderRadius: 12, border: '1px solid rgba(15, 15, 15, 0.08)' }}
          />
          <Bar dataKey="orders" fill="#5aac71" radius={[14, 14, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <ChartCard>
      <ChartTitle>Top Sellers</ChartTitle>
      {formattedRange ? <RangeText>{formattedRange}</RangeText> : null}
      <Text>จำนวนชิ้นที่ขาย</Text>
      <ChartWrapper>{renderChart()}</ChartWrapper>
    </ChartCard>
  );
}
