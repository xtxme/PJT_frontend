'use client';

import styled from "styled-components";

const Aside = styled.aside`
  width: 264px;
  height: 100dvh;
  background-color: #FFFFFF;
  position: sticky;
  top: 0;
  border-right: 1px solid #e4e4e4;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 20px 28px;
  gap: 16px;

  .logo {
    width: 180px;
    height: auto;
  }

  .divider {
    width: 100%;
    height: 1px;
    background-color: #e4e4e4;
    margin-bottom: 4px;
    margin-top: -18px;
  }

  nav {
    width: 100%;
  }

  .nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .nav-item {
    width: 100%;
  }

  .nav-button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 20px;
    border: none;
    border-radius: 99px;
    font: inherit;
    text-align: left;
    background-color: transparent;
    cursor: pointer;
    transition: background-color 0.2s ease;
    outline: none;
  }

  .nav-button:hover {
    background-color: #efefef;
  }

  .nav-button:focus-visible {
    box-shadow: 0 0 0 2px rgba(78, 70, 220, 0.45);
  }

  .nav-button.active {
    background-color: #df7544;
  }

  .nav-button.active:hover {
    background-color: #c46436;
  }

  .icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .icon img {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }

  .label {
    font-size: 16px;
    font-weight: 500;
    color: #000;
    font-family: Poppins;
    line-height: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-self: stretch;
  }

  .label.active {
    color: #FFFFFF;
  }
`;

export default function Sidebar() {
  return (
    <Aside>
      <img className="logo" src="/images/logo-black.webp" alt="logo-black" />
      <div className="divider" />
      <nav>
        <ul className="nav-list">
          <li className="nav-item">
            <button type="button" className="nav-button active">
              <span className="icon active">
                <img src="/images/dashboard-wh-icon.svg" alt="dashboard-black-icon" />
              </span>
              <span className="label active">Dashboard</span>
            </button>
          </li>
          <li className="nav-item">
            <button type="button" className="nav-button">
              <span className="icon">
                <img src="/images/RoleAccess-gray-icon.svg" alt="RoleAccess-gray-icon" />
              </span>
              <span className="label">Role Access</span>
            </button>
          </li>
          <li className="nav-item">
            <button type="button" className="nav-button">
              <span className="icon">
                <img src="/images/DataLog-gray-icon.svg" alt="DataLog-gray-icon" />
              </span>
              <span className="label">Data Log</span>
            </button>
          </li>
          <li className="nav-item">
            <button type="button" className="nav-button">
              <span className="icon">
                <img src="/images/Pending-gray-icon.svg" alt="Pending-gray-icon" />
              </span>
              <span className="label">Product Pending</span>
            </button>
          </li>
        </ul>
      </nav>
    </Aside>
  );
}
