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
  --log-columns: repeat(5, minmax(0, 1fr));
  --log-gap: 32px;

  .table-header {
    display: grid;
    grid-template-columns: var(--log-columns);
    align-items: center;
    padding: 0 18px;
    color: #6c6c6c;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    text-align: left;
    column-gap: var(--log-gap);
  }

  .table-header span {
    justify-self: flex-start;
  }

  .table-header span:last-child {
    justify-self: flex-start;
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
