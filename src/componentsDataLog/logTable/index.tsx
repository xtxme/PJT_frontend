'use client';

import styled from 'styled-components';
import ActivityLogRow from '@/componentsDataLog/logRow';
import { DataLogEntry } from '@/componentsDataLog/types';

type ActivityLogTableProps = {
  entries: DataLogEntry[];
};

const StyledActivityLogTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  .table-header {
    display: grid;
    grid-template-columns: 1.4fr 1.2fr 1.1fr 2.1fr auto;
    align-items: center;
    padding: 0 18px;
    color: #7f7f7f;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .table-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  @media (max-width: 960px) {
    .table-header {
      display: none;
    }
  }
`;

export default function ActivityLogTable({ entries }: ActivityLogTableProps) {
  return (
    <StyledActivityLogTable>
      <div className="table-header">
        <span>User</span>
        <span>Date</span>
        <span>Time</span>
        <span>Detail</span>
        <span>Status</span>
      </div>
      <div className="table-body">
        {entries.map((entry) => (
          <ActivityLogRow key={entry.id} entry={entry} />
        ))}
      </div>
    </StyledActivityLogTable>
  );
}
