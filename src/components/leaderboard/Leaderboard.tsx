"use client";

import styled from "styled-components";

type TrendDirection = "up" | "down";

type SalesLeader = {
  rank: number;
  name: string;
  sales: string;
  trend?: TrendDirection;
};

const LeaderboardCard = styled.article`
  background: #ffffff;
  border-radius: 28px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 20px 40px rgba(15, 15, 15, 0.06);
  border: 1px solid rgba(15, 15, 15, 0.08);
  width: 540px;
  height: 340px;
  justify-self: end;

  @media (max-width: 1200px) {
    max-width: 100%;
    justify-self: stretch;
  }
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #0f0f0f;
  font-family: var(--font-ibm-plex-sans-thai), 'IBM Plex Sans Thai', sans-serif;
`;

const LeaderboardTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
  color: #1f1f1f;
`;

const TableHeaderCell = styled.th`
  text-align: left;
  font-weight: 500;
  color: rgba(15, 15, 15, 0.6);
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(15, 15, 15, 0.16);
`;

const TableRow = styled.tr`
  border-bottom: 1px solid rgba(15, 15, 15, 0.08);

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 12px 0;
  vertical-align: middle;

  &:first-child {
    width: 72px;
  }

  &:last-child {
    text-align: left;
    font-weight: 600;
  }
`;

const RankCellContent = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const Rank = styled.span`
  display: inline-flex;
  width: 24px;
  height: 24px;
  border-radius: 5px;
  background: #EFBE46;
  align-items: center;
  justify-content: center;
  font-weight: 600;

  color: #0f0f0f;
  text-align: center;
  font-family: var(--font-ibm-plex-sans-thai), 'IBM Plex Sans Thai', sans-serif;
  font-size: 12px;
  font-weight: 600;
`;

const LeaderboardName = styled.span`
  display: inline-block;
  font-weight: 500;
`;

const TrendIcon = styled.span<{ $trend: TrendDirection }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: ${({ $trend }) => ($trend === "up" ? "#2abf75" : "#e25c5c")};
`;

const TrendPlaceholder = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
`;

function TrendArrow({ direction }: { direction: TrendDirection }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      {direction === "up" ? (
        <path d="M6 2l4 4H2L6 2z" fill="currentColor" />
      ) : (
        <path d="M6 10l4-4H2l4 4z" fill="currentColor" />
      )}
    </svg>
  );
}

const salesLeaders: SalesLeader[] = [
  { rank: 1, name: "สมชาย ใจดี", sales: "฿ xxxx", trend: "up" },
  { rank: 2, name: "สมหญิง รักงาน", sales: "฿ xxxx", trend: "down" },
  { rank: 3, name: "วิชัย ขยัน", sales: "฿ xxxx", trend: "down" },
  { rank: 4, name: "มาลี ใส่ใจ", sales: "฿ xxxx", trend: "down" },
];

export default function Leaderboard() {
  return (
    <LeaderboardCard>
      <Title>ยอดขายรายบุคคลของพนักงาน</Title>
      <LeaderboardTable>
        <thead>
          <tr>
            <TableHeaderCell>อันดับ</TableHeaderCell>
            <TableHeaderCell>ชื่อ</TableHeaderCell>
            <TableHeaderCell>ยอดการขาย</TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          {salesLeaders.map((leader) => (
            <TableRow key={leader.rank}>
              <TableCell>
                <RankCellContent>
                  <Rank>{leader.rank}</Rank>
                  {leader.trend ? (
                    <TrendIcon $trend={leader.trend}>
                      <TrendArrow direction={leader.trend} />
                    </TrendIcon>
                  ) : (
                    <TrendPlaceholder aria-hidden />
                  )}
                </RankCellContent>
              </TableCell>
              <TableCell>
                <LeaderboardName>{leader.name}</LeaderboardName>
              </TableCell>
              <TableCell>{leader.sales}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </LeaderboardTable>
    </LeaderboardCard>
  );
}
