'use client';

import styled from 'styled-components';

export type RoleAccessAccount = {
  id: string;
  name: string;
  role: string;
  username: string;
  email: string;
  lastLogin: string;
  status: 'Active' | 'Inactive';
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
  }

  .row__identity {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
  }

  .row__avatar {
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

  .row__avatar img {
    width: 32px;
    height: 32px;
  }

  .row__meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .row__name {
    font-size: 18px;
    font-weight: 700;
    color: #0f0f0f;
    margin: 0;
  }

  .row__contact {
    font-size: 14px;
    font-weight: 500;
    color: #3f3f3f;
    margin: 0;
    white-space: nowrap;
  }

  .row__last-login {
    font-size: 12px;
    font-weight: 500;
    color: #7a7a7a;
    margin: 0;
    white-space: nowrap;
  }

  .row__actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .row__badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    padding: 0 18px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.02em;
    border: 1px solid transparent;
    white-space: nowrap;
  }

  .row__badge--role {
    background: #ededed;
    border-color: #d7d7d7;
    color: #444444;
  }

  .row__badge--status {
    min-width: 92px;
  }

  .row__badge--status-active {
    background: #def5ee;
    border-color: #7ec3aa;
    color: #157347;
  }

  .row__badge--status-inactive {
    background: #fce3e3;
    border-color: #f4a9a9;
    color: #b42318;
  }

  .row__icon-button {
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

  .row__icon-button:hover {
    background: #e6e6e6;
  }

  .row__icon-button--danger {
    background: #fde6e6;
    box-shadow: inset 0 0 0 1px #f2b1b1;
  }

  .row__icon-button--danger:hover {
    background: #fdd1d1;
  }

  .row__icon-button svg {
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

    .row__actions {
      align-self: stretch;
      justify-content: space-between;
    }

    .row__contact,
    .row__last-login {
      white-space: normal;
    }
  }
`;

type RoleAccessAccountRowProps = {
  account: RoleAccessAccount;
};

export default function RoleAccessAccountRow({ account }: RoleAccessAccountRowProps) {
  const statusModifier = account.status === 'Active' ? 'active' : 'inactive';

  return (
    <StyledAccountRow>
      <div className="row">
        <div className="row__identity">
          <div className="row__avatar">
            <img src="/images/admin-icon.svg" alt="account-avatar" />
          </div>
          <div className="row__meta">
            <h3 className="row__name">{account.name}</h3>
            <p className="row__contact">@{account.username} | {account.email}</p>
            <p className="row__last-login">ล็อกอินล่าสุด: {account.lastLogin}</p>
          </div>
        </div>
        <div className="row__actions">
          <span className="row__badge row__badge--role">{account.role}</span>
          <span className={`row__badge row__badge--status row__badge--status-${statusModifier}`}>
            {account.status}
          </span>
          <button className="row__icon-button" type="button" aria-label="แก้ไขสิทธิ์">
            <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 17.5V20h2.5L18.81 7.69a1.4 1.4 0 0 0 0-2L17 3.88a1.4 1.4 0 0 0-2 0L4 14.91z" />
              <path d="M12.8 6.2l4.9 4.9" />
            </svg>
          </button>
          <button className="row__icon-button row__icon-button--danger" type="button" aria-label="ลบผู้ใช้">
            <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 7h14" />
              <path d="M9 7V5h6v2" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M7 7l1 12h8l1-12" />
            </svg>
          </button>
        </div>
      </div>
    </StyledAccountRow>
  );
}
