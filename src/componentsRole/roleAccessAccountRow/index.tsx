'use client';

import styled from 'styled-components';

export type RoleAccessAccount = {
  id: string;
  name: string;
  role: string;
  roleValue?: string;
  username: string;
  email: string;
  lastLogin: string;
  status: 'Active' | 'Inactive';
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt?: string | null;
  updatedAt?: string | null;
};

const StyledAccountRow = styled.li`
  list-style: none;

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 20px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(15, 15, 15, 0.06);
    border: 1px solid #d9d9d9;
  }

  .row-identity {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
  }

  .row-avatar {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
  }

  .row-avatar img {
    width: 32px;
    height: 32px;
  }

  .row-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .row-name {
    font-size: 18px;
    font-weight: 700;
    color: #0f0f0f;
    margin: 0;
  }

  .row-contact {
    font-size: 14px;
    font-weight: 500;
    color: #3f3f3f;
    margin: 0;
    white-space: nowrap;
  }

  .row-last-login {
    font-size: 12px;
    font-weight: 500;
    color: #7a7a7a;
    margin: 0;
    white-space: nowrap;
  }

  .row-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .status-toggle {
    border: none;
    background: transparent;
    padding: 0;
    line-height: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s ease, opacity 0.2s ease;
  }

  .status-toggle:not(:disabled):hover {
    transform: translateY(-1px);
  }

  .status-toggle:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .status-toggle img {
    display: block;
  }

  .row-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    padding: 0 18px;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.02em;
    border: 1px solid transparent;
    white-space: nowrap;
  }

  .row-badge--role {
    background: #D9D9D9;
    border-color: #7D7D7D;
    color: #7D7D7D;
  }

  .row-badge--status {
    min-width: 92px;
  }

  .row-badge--status-active {
    background: #def5ee;
    border-color: #5aac71;
    color: #5aac71;
  }

  .row-badge--status-inactive {
    background: #FFC5C5;
    border-color: #DF0404;
    color: #DF0404;
  }

  .row-icon-button {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: #f3f3f3;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease, box-shadow 0.2s ease;
    box-shadow: inset 0 0 0 1px #d9d9d9;
  }

  .row-icon-button:hover {
    background: #e6e6e6;
  }

  .row-icon-button--danger {
    background: #fde6e6;
    box-shadow: inset 0 0 0 1px #f2b1b1;
  }

  .row-icon-button--danger:hover {
    background: #fdd1d1;
  }

  .row-icon-button svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke-width: 1.6px;
    stroke: currentColor;
  }

  @media (max-width: 960px) {
    .row {
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
    }

    .row-actions {
      align-self: stretch;
      justify-content: space-between;
    }

    .row-contact,
    .row-last-login {
      white-space: normal;
    }
  }
`;

type RoleAccessAccountRowProps = {
  account: RoleAccessAccount;
  onEdit?: (account: RoleAccessAccount) => void;
  onDelete?: (account: RoleAccessAccount) => void;
  onToggleStatus?: (
    account: RoleAccessAccount,
    nextStatus: RoleAccessAccount['status'],
  ) => void;
  isStatusUpdating?: boolean;
};

export default function RoleAccessAccountRow({
  account,
  onEdit,
  onDelete,
  onToggleStatus,
  isStatusUpdating,
}: RoleAccessAccountRowProps) {
  const statusModifier = account.status === 'Active' ? 'active' : 'inactive';
  const isActive = account.status === 'Active';
  const nextStatus = isActive ? 'Inactive' : 'Active';
  const isToggleDisabled = !onToggleStatus || isStatusUpdating;

  return (
    <StyledAccountRow>
      <div className="row">
        <div className="row-identity">
          <div className="row-avatar">
            <img src="/images/admin-icon.svg" alt="account-avatar" />
          </div>
          <div className="row-meta">
            <h3 className="row-name">{account.name || account.username}</h3>
            <p className="row-contact">@{account.username} | {account.email}</p>
            <p className="row-last-login">ล็อกอินล่าสุด: {account.lastLogin}</p>
          </div>
        </div>
        <div className="row-actions">
          <span className="row-badge row-badge--role">{account.role}</span>
          <span className={`row-badge row-badge--status row-badge--status-${statusModifier}`}>
            {account.status}
          </span>
          <button
            type="button"
            className="status-toggle"
            onClick={() => onToggleStatus?.(account, nextStatus)}
            disabled={isToggleDisabled}
            aria-pressed={isActive}
            aria-label={`เปลี่ยนสถานะเป็น ${nextStatus}`}
          >
            <img
              src={isActive ? '/images/on.svg' : '/images/off.svg'}
              alt=""
              width={64}
              height={30}
            />
          </button>
          <button
            className="row-icon-button"
            type="button"
            aria-label="แก้ไขสิทธิ์"
            onClick={() => onEdit?.(account)}
          >
            <img src="/images/edit.svg" alt="edit" 
                  width={10}
                  height={10}/>
          </button>
        </div>
      </div>
    </StyledAccountRow>
  );
}
