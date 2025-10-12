'use client';

import { useMemo } from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import styled from 'styled-components';

type HighestOrderCustomer = {
  customerId: number;
  name: string;
  value: number;
};

type RangeInfo = {
  start: string;
  end: string;
};

type HighestOrderCustomerChartProps = {
  customers: HighestOrderCustomer[];
  isLoading: boolean;
  error: string | null;
  range?: RangeInfo | null;
};

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

const RangeText = styled.p`
  font-size: 14px;
  color: #6d7e9c;
  margin: -24px 0 8px;
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

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6d7e9c;
  font-size: 14px;
  text-align: center;
`;

const LegendPlaceholder = styled.div`
  color: #6d7e9c;
  font-size: 14px;
  text-align: center;
`;

const rangeFormatter = new Intl.DateTimeFormat('th-TH', { month: 'short', year: 'numeric' });

export default function HighestOrderCustomerChart({
  customers,
  isLoading,
  error,
  range,
}: HighestOrderCustomerChartProps) {
  const chartData = useMemo(() => {
    return customers
      .map((customer) => {
        if (!customer || typeof customer !== 'object') {
          return null;
        }

        const idValue =
          typeof customer.customerId === 'number'
            ? customer.customerId
            : Number(customer.customerId);

        if (!Number.isFinite(idValue)) {
          return null;
        }

        const nameValue =
          typeof customer.name === 'string' && customer.name.trim().length > 0
            ? customer.name.trim()
            : `ลูกค้า ${idValue}`;

        const numericValue =
          typeof customer.value === 'number'
            ? customer.value
            : Number(customer.value ?? 0);

        const sanitizedValue =
          typeof numericValue === 'number' && Number.isFinite(numericValue)
            ? numericValue
            : 0;

        return {
          customerId: idValue,
          name: nameValue,
          value: sanitizedValue,
        };
      })
      .filter((item): item is HighestOrderCustomer => Boolean(item));
  }, [customers]);

  const formattedRange = useMemo(() => {
    if (!range?.start) {
      return null;
    }

    const startDate = new Date(range.start);
    if (Number.isNaN(startDate.getTime())) {
      return null;
    }

    return rangeFormatter.format(startDate);
  }, [range]);

  const hasData = chartData.length > 0;

  const renderChart = () => {
    if (isLoading) {
      return <Placeholder>กำลังโหลด...</Placeholder>;
    }

    if (error) {
      return <Placeholder>{error}</Placeholder>;
    }

    if (!hasData) {
      return <Placeholder>ไม่มีข้อมูลสำหรับช่วงเวลานี้</Placeholder>;
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={72}
            outerRadius={112}
            paddingAngle={2}
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={entry.customerId} fill={SLICE_COLORS[index % SLICE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number | string) => [
              `฿${Number(value).toLocaleString()}`,
              'มูลค่าการสั่งซื้อ',
            ]}
            labelStyle={{ color: '#1f2024', fontWeight: 600 }}
            wrapperStyle={{ borderRadius: 12, border: '1px solid rgba(15, 15, 15, 0.08)' }}
            cursor={{ fill: 'rgba(159, 166, 176, 0.08)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderLegend = () => {
    if (isLoading || error) {
      return null;
    }

    if (!hasData) {
      return <LegendPlaceholder>ไม่มีข้อมูลสำหรับแสดงกราฟ</LegendPlaceholder>;
    }

    return (
      <LegendGrid>
        {chartData.map((customer, index) => (
          <LegendItem key={customer.customerId}>
            <LegendDot $color={SLICE_COLORS[index % SLICE_COLORS.length]} />
            {customer.name}
          </LegendItem>
        ))}
      </LegendGrid>
    );
  };

  return (
    <ChartCard>
      <ChartTitle>Highest Order Value by Customer</ChartTitle>
      {formattedRange ? <RangeText>ข้อมูลเดือน {formattedRange}</RangeText> : null}
      <ChartWrapper>
        <ChartShadow>
          <ChartCanvas>
            {renderChart()}
          </ChartCanvas>
        </ChartShadow>
      </ChartWrapper>
      {renderLegend()}
    </ChartCard>
  );
}
