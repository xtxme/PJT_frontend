import styled from "styled-components";
import type { ActivityLogEntry } from "../board/types";

type ActivityLogRowProps = {
  entry: ActivityLogEntry;
};

const StyledActivityLogRow = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr 2.2fr 1.3fr;
  align-items: center;
  padding: 14px 18px;
  border-radius: 16px;
  background: transparent;
  transition: background 0.2s ease;
  color: #4a4a57;
  font-size: 17px;
  line-height: 1.3;

  .cell-user {
    font-weight: 600;
    color: #1d1e25;
  }

  .cell-status {
    justify-self: end;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    border-radius: 999px;
    font-size: 15px;
    font-weight: 600;
    white-space: nowrap;
  }

  .status-badge.update {
    background: #ebe8ff;
    color: #6c5ce7;
  }

  .status-badge.stock-in {
    background: #e4f8ea;
    color: #2f9e44;
  }

  .status-badge.add-user {
    background: #e6f2ff;
    color: #3d7ff2;
  }

  .status-badge.edit-user {
    background: #fff2d6;
    color: #f0a500;
  }

  .status-badge.completed {
    background: #ececec;
    color: #4a4a57;
  }

  .status-badge.cancelled {
    background: #ffe4e5;
    color: #e15260;
  }

  &:hover {
    background: rgba(76, 81, 191, 0.04);
  }
`;

export default function ActivityLogRow({ entry }: ActivityLogRowProps) {
  return (
    <StyledActivityLogRow>
      <span className="cell cell-user">{entry.user}</span>
      <span className="cell">{entry.date}</span>
      <span className="cell">{entry.time}</span>
      <span className="cell">{entry.detail}</span>
      <span className="cell cell-status">
        <span className={`status-badge ${entry.status.variant}`}>
          {entry.status.label}
        </span>
      </span>
    </StyledActivityLogRow>
  );
}
