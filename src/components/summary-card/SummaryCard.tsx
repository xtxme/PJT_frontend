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
  background: #ffffff;
  border-radius: 10px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
  width: 256px;
  height: 160px;
  box-shadow: 0 12px 32px rgba(15, 15, 15, 0.08);
  margin-inline: 24px;


  @media (max-width: 600px) {
    width: 100%;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
`;

const ValueRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ValueText = styled.span`
  font-size: 24px;
  font-weight: 700;
  line-height: 20px;
  font-family: ibmThai;
`;

const UnitBadge = styled.span`
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
  color: #2f2f2f;

  svg {
    grid-area: 1 / 1;
  }

  span {
    grid-area: 1 / 1;
    z-index: 1;
  }
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
        {unit && (
          <UnitBadge>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
            >
              <circle cx="24" cy="24" r="24" fill="#EFBE46" />
            </svg>
            <span>{unit}</span>
          </UnitBadge>
        )}
      </Header>

      <ValueRow>
        <ValueText>{unitValue ? `${unitValue} ${value}` : value}</ValueText>
      </ValueRow>
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
