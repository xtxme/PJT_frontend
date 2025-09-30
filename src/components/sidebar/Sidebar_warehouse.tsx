'use client';

import styled from "styled-components";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  .nav-link {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 20px;
    border-radius: 99px;
    font: inherit;
    text-align: left;
    background-color: transparent;
    cursor: pointer;
    text-decoration: none;
    transition: background-color 0.2s ease;
    color: #000;
  }

  .nav-link:hover {
    background-color: #efefef;
  }

  .nav-link.active {
    background-color: #df6a33;
    color: #fff;
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
    line-height: 20px;
    display: flex;
    align-items: center;
  }
`;
export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/warehouse/stockIn", label: "บันทึกการรับเข้า", icon: "/images/dashboard-black-icon.svg" },
    { href: "/warehouse/updateStock", label: "ปรับปรุงข้อมูลสต็อก", icon: "/images/RoleAccess-gray-icon.svg" },
  ];

  return (
    <Aside>
      <img className="logo" src="/images/logo-black.webp" alt="logo-black" />
      <div className="divider" />
      <nav>
        <ul className="nav-list">
          {navItems.map(item => (
            <li key={item.href} className="nav-item">
              <Link
                href={item.href}
                className={`nav-link ${pathname === item.href ? "active" : ""}`}
              >
                <span className="icon">
                  <img src={item.icon} alt={`${item.label}-icon`} />
                </span>
                <span className="label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Aside>
  );
}