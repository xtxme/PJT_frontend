'use client';

import styled from 'styled-components';
import StatusBadge from '@/componentsDataLog/statusBadge';
import { DataLogEntry } from '@/componentsDataLog/types';

type ActivityLogRowProps = {
  entry: DataLogEntry;
};

const StyledActivityLogRow = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 1.2fr 1.1fr 2.1fr auto;
  align-items: center;
  padding: 16px 18px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.42);
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(15, 15, 15, 0.08);
  }

  .cell {
    font-size: 15px;
    font-weight: 500;
    color: #323232;
  }

  .cell--user {
    font-weight: 600;
    color: #0f0f0f;
  }

  .cell--detail {
    color: #585858;
  }

  @media (max-width: 960px) {
    grid-template-columns: 1.2fr 1.1fr 2fr;
    grid-template-areas:
      'user date status'
      'detail detail status'
      'time time status';
    row-gap: 8px;

    .cell--user {
      grid-area: user;
    }

    .cell--date {
      grid-area: date;
      text-align: right;
    }

    .cell--time {
      grid-area: time;
      color: #6c6c6c;
    }

    .cell--detail {
      grid-area: detail;
    }

    .cell--status {
      grid-area: status;
      justify-self: end;
    }
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      'user'
      'date'
      'time'
      'detail'
      'status';
    text-align: left;

    .cell {
      width: 100%;
    }

    .cell--date,
    .cell--time {
      color: #6c6c6c;
    }

    .cell--status {
      justify-self: start;
    }
  }
`;

export default function ActivityLogRow({ entry }: ActivityLogRowProps) {
  return (
    <StyledActivityLogRow>
      <span className="cell cell--user">{entry.user}</span>
      <span className="cell cell--date">{entry.date}</span>
      <span className="cell cell--time">{entry.time}</span>
      <span className="cell cell--detail">{entry.detail}</span>
      <span className="cell cell--status">
        <StatusBadge label={entry.statusLabel} status={entry.status} />
      </span>
    </StyledActivityLogRow>
  );
}
