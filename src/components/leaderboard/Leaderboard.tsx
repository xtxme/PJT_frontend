"use client";

import styled from "styled-components";

type LeaderboardRow = {
  rank: number;
  name: string;
  totalSales: number;
};

type LeaderboardProps = {
  rows: LeaderboardRow[];
  isLoading?: boolean;
  error?: string | null;
  monthLabel?: string | null;
};

const currencyFormatter = new Intl.NumberFormat("th-TH", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

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
  height: 420px;
  justify-self: end;

  @media (max-width: 1200px) {
    max-width: 100%;
    justify-self: stretch;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #0f0f0f;
  font-family: var(--font-ibm-plex-sans-thai), 'IBM Plex Sans Thai', sans-serif;
`;

const Subtitle = styled.span`
  font-size: 13px;
  color: rgba(15, 15, 15, 0.6);
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

const TableMessageRow = styled.tr``;

const TableMessageCell = styled.td`
  padding: 32px 0;
  text-align: center;
  color: rgba(15, 15, 15, 0.6);
  font-weight: 500;
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
  background: #efbe46;
  align-items: center;
  justify-content: center;
  font-weight: 600;

  color: #0f0f0f;
  text-align: center;
  font-family: var(--font-ibm-plex-sans-thai), 'IBM Plex Sans Thai', sans-serif;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 6px 12px rgba(15, 15, 15, 0.08);
`;

const LeaderboardName = styled.span`
  display: inline-block;
  font-weight: 500;
`;

export default function Leaderboard({
  rows,
  isLoading = false,
  error = null,
  monthLabel = null,
}: LeaderboardProps) {
  const renderTableBody = () => {
    const topRows = rows ? rows.slice(0, 5) : [];
    if (isLoading) {
      return (
        <TableMessageRow>
          <TableMessageCell colSpan={3}>กำลังโหลดข้อมูล...</TableMessageCell>
        </TableMessageRow>
      );
    }

    if (error) {
      return (
        <TableMessageRow>
          <TableMessageCell colSpan={3}>{error}</TableMessageCell>
        </TableMessageRow>
      );
    }

    if (topRows.length === 0) {
      return (
        <TableMessageRow>
          <TableMessageCell colSpan={3}>ยังไม่มีข้อมูลยอดขาย</TableMessageCell>
        </TableMessageRow>
      );
    }

    return topRows.map((leader) => (
      <TableRow key={leader.rank}>
        <TableCell>
          <RankCellContent>
            <Rank>{leader.rank}</Rank>
          </RankCellContent>
        </TableCell>
        <TableCell>
          <LeaderboardName>{leader.name}</LeaderboardName>
        </TableCell>
        <TableCell>{currencyFormatter.format(leader.totalSales ?? 0)}</TableCell>
      </TableRow>
    ));
  };

  return (
    <LeaderboardCard>
      <Header>
        <Title>ยอดขายรายบุคคลของพนักงาน</Title>
        {monthLabel ? <Subtitle>เดือน {monthLabel}</Subtitle> : null}
      </Header>
      <LeaderboardTable>
        <thead>
          <tr>
            <TableHeaderCell>อันดับ</TableHeaderCell>
            <TableHeaderCell>ชื่อ</TableHeaderCell>
            <TableHeaderCell>ยอดการขาย</TableHeaderCell>
          </tr>
        </thead>
        <tbody>{renderTableBody()}</tbody>
      </LeaderboardTable>
    </LeaderboardCard>
  );
}
