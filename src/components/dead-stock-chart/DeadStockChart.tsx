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

type DeadStockChange = {
  absolute: number;
  percent: number | null;
};

type DeadStockTotals = {
  dead_products: number;
  dead_qty: number;
  dead_value: number;
};

type DeadStockProduct = {
  product_id: number | null;
  product_name: string;
  dead_qty: number;
  dead_value: number;
};

type DeadStockLatestSummary = {
  month_key: string;
  totals: DeadStockTotals;
  products: DeadStockProduct[];
  compare_to_previous: {
    dead_products: DeadStockChange;
    dead_qty: DeadStockChange;
    dead_value: DeadStockChange;
  } | null;
};

type DeadStockChartProps = {
  products: DeadStockProduct[];
  isLoading: boolean;
  error: string | null;
  latest?: DeadStockLatestSummary | null;
};

const quantityFormatter = new Intl.NumberFormat('th-TH');
const currencyFormatter = new Intl.NumberFormat('th-TH', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const percentFormatter = new Intl.NumberFormat('th-TH', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const formatMonthLabel = (monthKey: string | null | undefined) => {
  if (!monthKey || typeof monthKey !== 'string') {
    return '';
  }
  const [yearStr, monthStr] = monthKey.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);

  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    return monthKey;
  }

  const date = new Date(year, month - 1, 1);

  if (Number.isNaN(date.getTime())) {
    return monthKey;
  }

  return new Intl.DateTimeFormat('th-TH', {
    month: 'short',
    year: 'numeric',
  }).format(date);
};

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

const ChartTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: #1f2024;
  margin: 0;
`;

const Subtitle = styled.div`
  display: flex;
  min-width: max-content;
  height: 22px;
  flex-direction: column;
  justify-content: center;
  font-size: 13px;
  color: #6d7e9c;
`;

const SummarySection = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

const SummaryBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SummaryValue = styled.span`
  font-size: 32px;
  font-weight: 700;
  color: #1f2024;
`;

const SummaryLabel = styled.span`
  font-size: 14px;
  color: #6d7e9c;
  font-weight: 500;
`;

const ChangeBadge = styled.span<{ $tone: 'positive' | 'negative' | 'neutral' }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ $tone }) =>
    $tone === 'positive' ? '#15803d' : $tone === 'negative' ? '#b91c1c' : '#6d7e9c'};
  background: ${({ $tone }) =>
    $tone === 'positive'
      ? 'rgba(21, 128, 61, 0.12)'
      : $tone === 'negative'
        ? 'rgba(185, 28, 28, 0.12)'
        : 'rgba(109, 126, 156, 0.12)'};
  border-radius: 999px;
  padding: 6px 12px;
  display: inline-flex;
  align-items: center;
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

export default function DeadStockChart({ products, isLoading, error, latest }: DeadStockChartProps) {
  const chartData = useMemo(() => {
    return products
      .map((product) => {
        if (!product) {
          return null;
        }

        const deadQty =
          typeof product.dead_qty === 'number' && Number.isFinite(product.dead_qty)
            ? product.dead_qty
            : Number(product.dead_qty ?? 0);

        const deadValue =
          typeof product.dead_value === 'number' && Number.isFinite(product.dead_value)
            ? product.dead_value
            : Number(product.dead_value ?? 0);

        const sanitizedQty = Number.isFinite(deadQty) ? deadQty : 0;
        const sanitizedValue = Number.isFinite(deadValue) ? deadValue : 0;

        return {
          key: product.product_id ?? product.product_name,
          name: product.product_name,
          deadQty: sanitizedQty,
          deadValue: sanitizedValue,
        };
      })
      .filter((item): item is { key: string | number; name: string; deadQty: number; deadValue: number } =>
        Boolean(item),
      );
  }, [products]);

  const maxQty = useMemo(() => {
    if (chartData.length === 0) {
      return 0;
    }
    return chartData.reduce((max, item) => (item.deadQty > max ? item.deadQty : max), 0);
  }, [chartData]);

  const yDomainMax = useMemo(() => {
    if (maxQty <= 0) {
      return 10;
    }

    const padded = Math.ceil(maxQty * 1.1);
    return padded === maxQty ? padded + 1 : padded;
  }, [maxQty]);

  const latestMonthLabel = latest ? formatMonthLabel(latest.month_key) : null;
  const latestQty = latest?.totals.dead_qty ?? null;
  const latestProducts = latest?.totals.dead_products ?? null;
  const latestValue = latest?.totals.dead_value ?? null;
  const change = latest?.compare_to_previous?.dead_qty ?? null;

  const summaryValueText = (() => {
    if (isLoading) {
      return 'กำลังโหลด...';
    }

    if (error) {
      return '--';
    }

    if (latestQty == null) {
      return '--';
    }

    return `${quantityFormatter.format(Math.max(0, Math.round(latestQty)))} ชิ้น`;
  })();

  const summaryLabelText = (() => {
    if (isLoading) {
      return 'กำลังเตรียมข้อมูล';
    }

    if (error) {
      return 'ไม่สามารถโหลดข้อมูลล่าสุดได้';
    }

    const segments: string[] = [];

    if (latestMonthLabel) {
      segments.push(`เดือน ${latestMonthLabel}`);
    }

    if (latestProducts != null) {
      segments.push(
        `สินค้า Dead ${quantityFormatter.format(Math.max(0, Math.round(latestProducts)))} รายการ`,
      );
    }

    if (latestValue != null) {
      segments.push(`มูลค่า ฿${currencyFormatter.format(Math.max(0, latestValue))}`);
    }

    return segments.length > 0 ? segments.join(' • ') : 'ไม่มีข้อมูลล่าสุด';
  })();

  const changeBadge = (() => {
    if (isLoading || error) {
      return {
        text: 'เทียบเดือนก่อน: --',
        tone: 'neutral' as const,
      };
    }

    if (!change) {
      return {
        text: 'เทียบเดือนก่อน: --',
        tone: 'neutral' as const,
      };
    }

    const absolute = Math.round(change.absolute);
    const absValue = quantityFormatter.format(Math.abs(absolute));

    let tone: 'positive' | 'negative' | 'neutral' = 'neutral';
    let sign = '';
    if (absolute > 0) {
      tone = 'negative';
      sign = '+';
    } else if (absolute < 0) {
      tone = 'positive';
      sign = '-';
    }

    let percentPart = '';
    if (typeof change.percent === 'number' && Number.isFinite(change.percent)) {
      const percentValue = percentFormatter.format(Math.abs(change.percent));
      const percentSign = absolute === 0 ? '' : sign;
      percentPart = ` (${percentSign}${percentValue}%)`;
    } else if (absolute !== 0) {
      percentPart = ' (ใหม่)';
    }

    const valuePart = absolute === 0 ? '0' : `${sign}${absValue}`;

    return {
      text: `เทียบเดือนก่อน: ${valuePart} ชิ้น${percentPart}`,
      tone,
    };
  })();

  const renderChart = () => {
    if (isLoading) {
      return <Placeholder>กำลังโหลด...</Placeholder>;
    }

    if (error) {
      return <Placeholder>{error}</Placeholder>;
    }

    if (chartData.length === 0) {
      return <Placeholder>ไม่มีข้อมูลสำหรับช่วง 12 เดือนล่าสุด</Placeholder>;
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }} barCategoryGap="20%">
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
            tickFormatter={(value: number) => quantityFormatter.format(Math.max(0, Math.round(value)))}
            domain={[0, yDomainMax]}
            label={{
              value: 'จำนวนคงเหลือ (ชิ้น)',
              angle: -90,
              position: 'insideLeft',
              dx: -10,
              style: { fill: '#6d7e9c', fontSize: 14, fontWeight: 500 },
            }}
          />
          <Tooltip
            cursor={{ fill: 'rgba(159, 166, 176, 0.12)' }}
            formatter={(value, _name, props) => {
              const entry = props.payload as {
                name: string;
                deadQty: number;
                deadValue: number;
              };
              const qtyValue = typeof value === 'number' ? value : Number(value);
              return [
                `${quantityFormatter.format(Math.max(0, Math.round(qtyValue)))} ชิ้น`,
                entry ? `มูลค่า ฿${currencyFormatter.format(entry.deadValue ?? 0)}` : 'Dead Stock',
              ];
            }}
            labelFormatter={(_, payload) => {
              const entry = payload?.[0]?.payload as {
                name: string;
                deadValue: number;
              };

              if (!entry) {
                return '';
              }

              const valueText = currencyFormatter.format(entry.deadValue ?? 0);
              return `${entry.name} · ฿${valueText}`;
            }}
            wrapperStyle={{ borderRadius: 12, border: '1px solid rgba(15, 15, 15, 0.08)' }}
          />
          <Bar dataKey="deadQty" fill="#EFBE46" radius={[14, 14, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <ChartCard>
      <ChartTitle>Dead Stock</ChartTitle>
      <Subtitle>
        {latestMonthLabel ? `ยอดสต็อกค้าง · เดือน ${latestMonthLabel}` : 'ยอดสต็อกค้าง'}
      </Subtitle>
      <SummarySection>
        <SummaryBlock>
          <SummaryValue>{summaryValueText}</SummaryValue>
          <SummaryLabel>{summaryLabelText}</SummaryLabel>
        </SummaryBlock>
        <ChangeBadge $tone={changeBadge.tone}>{changeBadge.text}</ChangeBadge>
      </SummarySection>
      <ChartWrapper>{renderChart()}</ChartWrapper>
    </ChartCard>
  );
}
