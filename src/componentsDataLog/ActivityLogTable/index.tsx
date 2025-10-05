import styled from "styled-components";
import ActivityLogRow from "../ActivityLogRow";
import type { ActivityLogEntry } from "../board/types";

type ActivityLogTableProps = {
  entries: ActivityLogEntry[];
};

const StyledActivityLogTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  .table-head {
    display: grid;
    grid-template-columns: 1.3fr 1fr 1fr 2.2fr 1.3fr;
    padding: 0 18px;
    color: #9d9dad;
    font-size: 16px;
    font-weight: 600;
  }

  .table-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

export default function ActivityLogTable({ entries }: ActivityLogTableProps) {
  return (
    <StyledActivityLogTable>
      <div className="table-head">
        <span>User</span>
        <span>Date</span>
        <span>Time</span>
        <span>Detail</span>
        <span>Status</span>
      </div>
      <div className="table-body">
        {entries.map((entry) => (
          <ActivityLogRow key={`${entry.user}-${entry.date}-${entry.time}`} entry={entry} />
        ))}
      </div>
    </StyledActivityLogTable>
  );
}
