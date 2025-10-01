'use client';

import { useState } from 'react';
import styled from 'styled-components';
import AddUserButton from '@/componentsRole/addUser';
import FilterButton from '@/componentsRole/filter';
import RoleAccessAccountRow, { RoleAccessAccount } from '@/componentsRole/roleAccessAccountRow';
import PaginationControls from '@/componentsRole/paginationControls';
import SearchField from '@/componentsRole/search-field';
import AddUserPopup from '@/componentsRole/addUser-popUp';

const StyledAccountBoard = styled.section`
  width: 100%;

  .panel {
    width: 100%;
    max-width: 1106px;
    border-radius: 17px;
    background: #ffffff;
    padding: 28px 32px;
    box-shadow: 0 20px 40px rgba(15, 15, 15, 0.08);
    display: flex;
    flex-direction: column;
    gap: 10px;
    transform: translateX(14px);
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 24px;
  }

  .panel-title {
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex: 0 0 auto;
  }

  .panel-title h2 {
    font-size: 26px;
    font-weight: 700;
    color: #0f0f0f;
    margin: 0;
  }

  .panel-subtitle {
    font-size: 16px;
    font-weight: 600;
    color: #6c6c6c;
    margin: 0;
  }

  .panel-controls {
    display: flex;
    align-items: center;
    gap: 18px;
    flex: 1 1 520px;
    min-width: 360px;
    margin-left: auto;
    padding: 8px 12px;
    border-radius: 30px;
  }

  .panel-list {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  @media (max-width: 960px) {
    .panel {
      padding: 24px;
    }

    .panel-header {
      flex-direction: column;
      align-items: stretch;
    }

    .panel-controls {
      flex: 1 1 auto;
      min-width: 0;
      width: 100%;
      flex-wrap: wrap;
      justify-content: center;
      margin-left: 0;
      gap: 12px;
    }
  }

  @media (max-width: 640px) {
    .panel-controls {
      flex-direction: column;
      align-items: stretch;
    }

  }
`;

const mockAccounts: RoleAccessAccount[] = [
  {
    id: 'admin',
    name: 'ผู้ดูแลระบบ',
    role: 'ผู้ดูแลระบบ',
    username: 'admin',
    email: 'admin@company.com',
    lastLogin: '2024-06-15 09:30',
    status: 'Active',
  },
  {
    id: 'owner',
    name: 'เจ้าของร้าน',
    role: 'เจ้าของร้าน',
    username: 'owner1',
    email: 'owner@company.com',
    lastLogin: '2024-06-15 08:15',
    status: 'Active',
  },
  {
    id: 'sales-a',
    name: 'พนักงานขาย A',
    role: 'พนักงานขาย',
    username: 'sales1',
    email: 'sales1@company.com',
    lastLogin: '2024-06-15 10:45',
    status: 'Active',
  },
  {
    id: 'sales-b',
    name: 'พนักงานขาย B',
    role: 'พนักงานขาย',
    username: 'sales2',
    email: 'sales2@company.com',
    lastLogin: '2024-06-10 16:20',
    status: 'Inactive',
  },
  {
    id: 'warehouse',
    name: 'พนักงานคลัง A',
    role: 'พนักงานคลัง',
    username: 'warehouse1',
    email: 'warehouse1@company.com',
    lastLogin: '2024-06-15 07:00',
    status: 'Active',
  },
];

export default function RoleAccessAccountBoard() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  return (
    <StyledAccountBoard>
      <AddUserPopup open={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} />
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <h2>Account</h2>
            <p className="panel-subtitle">ชื่อ - สกุล</p>
          </div>
          <div className="panel-controls">
            <SearchField id="role-access-search" placeholder="Search" />
            <FilterButton aria-label="กรองและจัดเรียงบัญชีผู้ใช้" />
            <AddUserButton aria-label="เพิ่มบัญชีผู้ใช้" onClick={() => setIsAddUserOpen(true)} />
          </div>
        </div>
        <ul className="panel-list">
          {mockAccounts.map((account) => (
            <RoleAccessAccountRow key={account.id} account={account} />
          ))}
        </ul>
        <PaginationControls />
      </div>
    </StyledAccountBoard>
  );
}
