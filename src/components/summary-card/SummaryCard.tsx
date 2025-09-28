import Image from "next/image";
import styled from "styled-components";

type TrendDirection = "up" | "down";

interface SummaryCardProps {
  title: string;
  unit?: string;
  value: string;
  trendText: string;
  trendDirection?: TrendDirection;
}

const Card = styled.article`
  background: #d9d9d9;
  border-radius: 10px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  width: 256px;
  height: 160px;
  box-shadow: 0 8px 20px rgba(15, 15, 15, 0.08);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
`;

const Value = styled.div`
  font-size: 36px;
  font-weight: 700;
  letter-spacing: 0.02em;
`;

const Trend = styled.div<{ negative?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ negative }) => (negative ? "#c0392b" : "#1f1f1f")};

  img,
  svg {
    width: 24px;
    height: 24px;
  }
`;

export default function SummaryCard({
  title,
  unit,
  value,
  trendText,
  trendDirection = "up",
}: SummaryCardProps) {
  const isNegative = trendDirection === "down";

  return (
    <Card>
      <Header>
        <span>{title}</span>
        {unit ? <span>{unit}</span> : null}
      </Header>
      <Value>{value}</Value>
      <Trend negative={isNegative}>
        {isNegative ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M6 15l6-6 6 6"
              stroke="#c0392b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <Image
            src="/images/ArrowRise.svg"
            alt="แนวโน้มเพิ่มขึ้น"
            width={24}
            height={24}
          />
        )}
        {trendText}
      </Trend>
    </Card>
  );
}
