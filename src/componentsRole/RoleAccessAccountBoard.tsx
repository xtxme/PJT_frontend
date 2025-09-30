'use client';

import styled from 'styled-components';
import RoleAccessAccountRow, { RoleAccessAccount } from './RoleAccessAccountRow';
import PaginationControls from './PaginationControls';

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
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 20px;
  }

  .panel-title {
    display: flex;
    flex-direction: column;
    gap: 20px;
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

  .panel-actions {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  .panel-action {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    height: 44px;
    padding: 0 18px;
    border-radius: 999px;
    border: none;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.01em;
    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .panel-action:hover {
    transform: translateY(-1px);
  }

  .panel-action--secondary {
    background: #f8f8f8;
    box-shadow: inset 0 0 0 1px #dadada;
    color: #3f3f3f;
  }

  .panel-action--primary {
    background: #0ac786;
    color: #ffffff;
    box-shadow: 0 10px 20px rgba(10, 199, 134, 0.2);
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

    .panel-actions {
      justify-content: space-between;
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
          <div className="panel-actions">
            <button className="panel-action panel-action--secondary" type="button">
              <svg viewBox="0 0 24 24">
                <path d="M4 5h16" />
                <path d="M6 10h12" />
                <path d="M10 15h8" />
                <path d="M14 20h4" />
              </svg>
              Filter & Short
            </button>
            <button className="panel-action panel-action--primary" type="button">
              <svg viewBox="0 0 24 24">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
              Add User
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
