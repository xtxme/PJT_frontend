'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ActivityLogTable from '@/componentsDataLog/logTable';
import { DataLogEntry } from '@/componentsDataLog/types';
import PaginationControls from '@/componentsRole/paginationControls';

const activityLogs: DataLogEntry[] = [
  {
    id: 'log-1',
    user: 'sales1',
    date: '2024-06-15',
    time: '10:45:23',
    detail: 'PO021 - 120 รายการ',
    status: 'updateStock',
    statusLabel: 'Update Stock',
  },
  {
    id: 'log-2',
    user: 'warehouse1',
    date: '2024-06-15',
    time: '09:30:15',
    detail: 'PO001 - 50 รายการ',
    status: 'stockIn',
    statusLabel: 'Stock In',
  },
  {
    id: 'log-3',
    user: 'admin',
    date: '2024-06-15',
    time: '08:15:42',
    detail: 'ชื่อ-นามสกุล ชื่อ user Role',
    status: 'addUser',
    statusLabel: 'Add User',
  },
  {
    id: 'log-4',
    user: 'owner1',
    date: '2024-06-15',
    time: '07:45:10',
    detail: 'ชื่อ-นามสกุล ชื่อ user Role',
    status: 'editUser',
    statusLabel: 'Edit User',
  },
  {
    id: 'log-5',
    user: 'sales2',
    date: '2024-06-14',
    time: '16:30:05',
    detail: 'ใบเสร็จ #INV001',
    status: 'orderCompleted',
    statusLabel: 'Order Completed',
  },
  {
    id: 'log-6',
    user: 'sales1',
    date: '2024-06-10',
    time: '15:55:10',
    detail: 'ใบเสร็จ #INV003',
    status: 'cancelOrder',
    statusLabel: 'Cancel Order',
  },
];

const ROWS_PER_PAGE = 6;

const StyledDataLogBoard = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;

  .panel {
    width: 100%;
    max-width: 1120px;
    padding: 32px 36px;
    border-radius: 24px;
    background: #ffffff;
    box-shadow: 0 20px 48px rgba(15, 15, 15, 0.08);
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
  }

  .panel-title {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .panel-title h2 {
    margin: 0;
    font-size: 26px;
    font-weight: 700;
    color: #0f0f0f;
  }

  .panel-title p {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: #6c6c6c;
  }

  .pagination-row {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: auto;
  }

  .pagination-row nav {
    width: auto;
    justify-content: center;
  }

  @media (max-width: 1024px) {
    .panel {
      padding: 28px 24px;
    }
  }

  @media (max-width: 640px) {
    .panel {
      border-radius: 20px;
      padding: 24px 18px;
    }

    .panel-header {
      flex-direction: column;
      align-items: stretch;
    }

    .pagination-row {
      justify-content: center;
    }
  }
`;

export default function DataLogBoard() {
  const [page, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(activityLogs.length / ROWS_PER_PAGE));

  useEffect(() => {
    setPage((previous) => Math.min(previous, pageCount));
  }, [pageCount]);

  const startIndex = (page - 1) * ROWS_PER_PAGE;
  const paginatedEntries = activityLogs.slice(startIndex, startIndex + ROWS_PER_PAGE);

  return (
    <StyledDataLogBoard>
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <h2>Activity Log</h2>
            <p>กิจกรรมล่าสุดที่เกิดขึ้นในระบบ</p>
          </div>
        </div>
        <ActivityLogTable entries={paginatedEntries} />
        <div className="pagination-row">
          <PaginationControls currentPage={page} totalPages={pageCount} onPageChange={setPage} />
        </div>
      </div>
    </StyledDataLogBoard>
  );
}
