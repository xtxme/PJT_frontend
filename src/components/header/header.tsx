
import { useState } from 'react';
import styled from 'styled-components';

const HeaderBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px;
  background-color: #ffffff;
  border-bottom: 1px solid #e4e4e4;

  .brand {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .brand-text {
    width: 286px;
    height: 52px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .brand-title {
    font-size: 36px;
    font-weight: 600;
    line-height: 140%;
    color: #111a44;
  }

  .user {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .user-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: #000000;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .user-avatar::after {
    content: '\\1F464';
    color: #ffffff;
    font-size: 20px;
    line-height: 1;
  }

  .user-details {
    display: flex;
    flex-direction: column;
    gap: 2px;
    line-height: 1;
  }

  .user-name {
    display: flex;
    line-height: 24px;
    font-size: 16px;
    font-weight: 700;
    color: #111a44;
    text-transform: uppercase;
  }

  .user-role {
    line-height: 20px;
    font-weight: 400;
    font-size: 14px;
    color: #7f8499;
  }

  .user-divider {
    width: 1px;
    height: 44px;
    background-color: #d7d9e2;
    display: inline-block;
  }

  .logout-button {
    width: 138px;
    height: 48px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 18px 30px;
    border-radius: 4px;
    border: 1px solid #1c1f2c;
    background-color: transparent;
    font-size: 15px;
    font-weight: 500;
    color: #1c1f2c;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .logout-button:hover {
    background-color: #1c1f2c;
    color: #ffffff;
  }

  .logout-button-icon {
    position: relative;
    width: 20px;
    height: 20px;
  }

  .logout-button-icon::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 2px;
    width: 9px;
    height: 2px;
    background-color: currentColor;
    transform: translateY(-50%);
  }

  .logout-button-icon::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 1px;
    width: 6px;
    height: 6px;
    border-top: 2px solid currentColor;
    border-right: 2px solid currentColor;
    transform: translateY(-50%) rotate(45deg);
  }

  .logout-button-text {
        display: flex;
        width: 62px;
        height: 28px;
        flex-direction: column;
        justify-content: center;
        font-size: 18px;
        font-weight: 500;
    }

    .admin-icon{
        width: 50px;
        height: 50px;
    }

  @media (max-width: 960px) {
    padding: 16px 20px;

    .brand-title {
      font-size: 20px;
      letter-spacing: 0.08em;
    }

    .user {
      gap: 16px;
    }

    .logout-button {
      padding: 10px 18px;
    }
  }
`;

export default function AppHeader() {
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  return (
    <HeaderBar>
      <div className="brand">
        <div className="brand-text">
          <span className="brand-title">PJT INVENTORY</span>
        </div>
      </div>
      <div className="user">
        <div className="user-profile">
          <img className="admin-icon" src="/images/admin-icon.svg" alt="admin-icon" />
          <div className="user-details">
            <strong className="user-name">xxxxx</strong>
            <strong className="user-role">Admin</strong>
          </div>
        </div>
        <span className="user-divider" aria-hidden="true" />
        <button
          type="button"
          className="logout-button"
          onMouseEnter={() => setIsLogoutHovered(true)}
          onMouseLeave={() => setIsLogoutHovered(false)}
        >
          <img
            className="logout-button-icon"
            src={isLogoutHovered ? '/images/logout-wh-icon.svg' : '/images/logout-black-icon.svg'}
            alt="logout-icon"
          />
          <span className="logout-button-text">Logout</span>
        </button>
      </div>
    </HeaderBar>
  );
}
