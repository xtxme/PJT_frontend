import styled from "styled-components";
import ActivityLogHeader from "../ActivityLogHeader";
import ActivityLogTable from "../ActivityLogTable";
import type { ActivityLogEntry } from "./types";

const StyledDataLogBoard = styled.section`
  width: 100%;
  max-width: 1120px;
  border-radius: 32px;
  background: #f6f6fb;
  padding: 32px 36px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  box-shadow: 0 18px 45px rgba(20, 21, 40, 0.08);
`;

const activityLogEntries: ActivityLogEntry[] = [
  {
    user: "sales1",
    date: "2024-06-15",
    time: "10:45:23",
    detail: "PO021 - 120 รายการ",
    status: { label: "Update Stock", variant: "update" },
  },
  {
    user: "warehouse1",
    date: "2024-06-15",
    time: "09:30:15",
    detail: "PO001 - 50 รายการ",
    status: { label: "Stock In", variant: "stock-in" },
  },
  {
    user: "admin",
    date: "2024-06-15",
    time: "08:15:42",
    detail: "ชื่อ-นามสกุล ชื่อ user Role",
    status: { label: "Add User", variant: "add-user" },
  },
  {
    user: "owner1",
    date: "2024-06-15",
    time: "07:45:10",
    detail: "ชื่อ-นามสกุล ชื่อ user Role",
    status: { label: "Edit User", variant: "edit-user" },
  },
  {
    user: "sales2",
    date: "2024-06-14",
    time: "16:30:05",
    detail: "ใบเสร็จ #INV001",
    status: { label: "Order Completed", variant: "completed" },
  },
  {
    user: "sales1",
    date: "2024-06-10",
    time: "15:55:10",
    detail: "ใบเสร็จ #INV003",
    status: { label: "Cancel Order", variant: "cancelled" },
  },
];

export default function DataLogBoard() {
  return (
    <StyledDataLogBoard>
      <ActivityLogHeader />
      <ActivityLogTable entries={activityLogEntries} />
    </StyledDataLogBoard>
  );
}
