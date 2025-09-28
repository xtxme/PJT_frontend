import Image from "next/image";
import styled from "styled-components";

type TrendDirection = "up" | "down";

interface SummaryCardProps {
  title: string;
  unit?: string;
  unitValue?: string;
  value: string;
  trendText: string;
  fixTrendText?: string;
  trendDirection?: TrendDirection;
}

const Card = styled.article`
  background: #d9d9d9;
  border-radius: 10px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  width: 256px;
  height: 160px;
  box-shadow: 0 12px 32px rgba(15, 15, 15, 0.08);

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 18px;
  font-weight: 700;
  transform: translateY(4px);

  span:first-child {
    font-family: ibmThai;
  }
`;

const Value = styled.div`
  font-size: 24px;
  font-weight: 700;
  line-height: 16px;
  font-family: ibmThai;
  transform: translateY(8px);
`;

const Trend = styled.div<{ negative?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ negative }) => (negative ? "#c0392b" : "#3f3f3f")};
  font-family: var(--font-ibm-plex-thai, inherit);

  img,
  svg {
    width: 20px;
    height: 20px;
  }
`;

export default function SummaryCard({
  title,
  unit,
  unitValue,
  value,
  trendText,
  fixTrendText,
  trendDirection = "up",
}: SummaryCardProps) {
  const isNegative = trendDirection === "down";

  return (
    <Card>
      <Header>
        <span>{title}</span>
        {unit ? <span>{unit}</span> : null}
      </Header>
      <Value>{unitValue ? `${unitValue} ${value}` : value}</Value>
      <Trend negative={isNegative}>
        {isNegative ? (
          <Image
            src="/images/ArrowFall.svg"
            alt="แนวโน้มลดลง"
            width={20}
            height={20}
          />
        ) : (
          <Image
            src="/images/ArrowRise.svg"
            alt="แนวโน้มเพิ่มขึ้น"
            width={20}
            height={20}
          />
        )}
        {trendText}
        {fixTrendText ? ` ${fixTrendText}` : ""}
      </Trend>
    </Card>
  );
}
