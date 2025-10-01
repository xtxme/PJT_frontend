'use client';

import styled from 'styled-components';
import RoleAccessAccountRow, { RoleAccessAccount } from '@/componentsRole/roleAccessAccountRow';
import PaginationControls from '@/componentsRole/paginationControls';
import SearchField from '@/componentsRole/search-field';

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

  .panel-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 54px;
    min-width: 132px;
    padding: 0 26px;
    border-radius: 27px;
    border: none;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.01em;
    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
    background: #ffffff;
    box-shadow: inset 0 0 0 1px #dadada;
    color: #0f0f0f;
    flex: 0 0 auto;
  }

  .panel-action:hover {
    transform: translateY(-1px);
  }

  .panel-action svg {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8px;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .panel-action--primary {
    box-shadow: inset 0 0 0 1px #d1d1d1;
  }

  .panel-action--secondary {
    box-shadow: inset 0 0 0 1px #cfcfcf;
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

    .panel-action {
      width: 100%;
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
  return (
    <StyledAccountBoard>
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <h2>Account</h2>
            <p className="panel-subtitle">ชื่อ - สกุล</p>
          </div>
          <div className="panel-controls">
            <SearchField id="role-access-search" placeholder="Search" />
            <button className="panel-action panel-action--secondary" type="button">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 5h16" />
                <path d="M8 12h8" />
                <path d="M11 19h5" />
              </svg>
              <span>Filter & Sort</span>
            </button>
            <button className="panel-action panel-action--primary" type="button">
              <span>Add User</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
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
