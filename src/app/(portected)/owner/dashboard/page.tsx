"use client";

import Image from "next/image";
import styled from "styled-components";

const DashboardPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 40px 48px 64px;
  background: linear-gradient(110deg, rgba(0, 0, 0, 0.05) 0%, transparent 30%) #ffffff;
  min-height: 100%;
  color: #0f0f0f;

  .breadcrumb-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 600;
    font-size: 20px;
  }

  .breadcrumb span {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .period-selector {
    border: none;
    background: #f2f2f2;
    border-radius: 24px;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    font-weight: 500;
    color: #1f1f1f;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .period-selector:hover {
    background: #e6e6e6;
  }

  .period-selector svg {
    width: 16px;
    height: 16px;
  }

  .welcome {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .welcome h1 {
    font-size: 40px;
    font-weight: 700;
  }

  .cards-row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
  }

  .summary-card,
  .leaderboard {
    background: #d9d9d9;
    border-radius: 28px;
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-height: 200px;
  }

  .summary-card {
    box-shadow: 0 8px 20px rgba(15, 15, 15, 0.08);
  }

  .summary-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
  }

  .summary-card-value {
    font-size: 36px;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .summary-card-trend {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #1f1f1f;
  }

  .summary-card-trend.negative {
    color: #c0392b;
  }

  .summary-card-trend img {
    width: 24px;
    height: 24px;
  }

  .leaderboard {
    grid-column: span 3;
    box-shadow: 0 12px 24px rgba(15, 15, 15, 0.08);
  }

  .leaderboard h2 {
    font-size: 24px;
    font-weight: 600;
  }

  .leaderboard-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 16px;
  }

  .leaderboard-table thead th {
    text-align: left;
    font-weight: 500;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(15, 15, 15, 0.3);
  }

  .leaderboard-table tbody tr {
    border-bottom: 1px solid rgba(15, 15, 15, 0.08);
  }

  .leaderboard-table tbody tr:last-child {
    border-bottom: none;
  }

  .leaderboard-table td {
    padding: 16px 0;
    vertical-align: middle;
  }

  .leaderboard-table td:first-child {
    width: 80px;
  }

  .leaderboard-table td:last-child {
    text-align: right;
    font-weight: 600;
  }

  .rank {
    display: inline-flex;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #ffffff;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }

  .leaderboard-name {
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 500;
  }

  .trend-icon {
    display: inline-flex;
    width: 18px;
    height: 18px;
  }

  .trend-icon.down svg {
    width: 18px;
    height: 18px;
  }

  .trend-icon.up img {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 1024px) {
    padding: 32px 24px;

    .welcome h1 {
      font-size: 32px;
    }

    .cards-row {
      grid-template-columns: 1fr;
    }

    .leaderboard {
      grid-column: span 1;
    }
  }
`;

const salesLeaders = [
  { rank: 1, name: "สมชาย ใจดี", sales: "฿ xxxx", trend: "up" },
  { rank: 2, name: "สมหญิง รักงาน", sales: "฿ xxxx", trend: "down" },
  { rank: 3, name: "สมคิด ทันใจ", sales: "฿ xxxx", trend: "up" },
];

export default function OwnerDashboardPage() {
  return (
    <DashboardPage>
      <div className="breadcrumb-row">
        <div className="breadcrumb">
          <Image
            src="/images/dashboard-black-icon.svg"
            alt="Dashboard icon"
            width={32}
            height={32}
          />
          <span>Dashboard</span>
        </div>
        <button className="period-selector" type="button">
          Monthly
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="welcome">
        <h1>ยินดีต้อนรับ, คุณ xxxx</h1>
      </div>

      <div className="cards-row">
        <div className="summary-card">
          <div className="summary-card-header">
            <span>ยอดขายรวม</span>
            <span>฿</span>
          </div>
          <div className="summary-card-value">฿xxx,xxx</div>
          <div className="summary-card-trend">
            <Image
              src="/images/ArrowRise.svg"
              alt="ยอดขึ้น"
              width={24}
              height={24}
            />
            +xx.xx% จากเดือนที่แล้ว
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-header">
            <span>กำไรสุทธิ</span>
            <span>฿</span>
          </div>
          <div className="summary-card-value">฿xxx,xxx</div>
          <div className="summary-card-trend">
            <Image
              src="/images/ArrowRise.svg"
              alt="ยอดขึ้น"
              width={24}
              height={24}
            />
            +xx.xx% จากเดือนที่แล้ว
          </div>
        </div>

        <div className="leaderboard">
          <h2>ยอดขายรายบุคคลของพนักงาน</h2>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>อันดับ</th>
                <th>ชื่อ</th>
                <th>ยอดการขาย</th>
              </tr>
            </thead>
            <tbody>
              {salesLeaders.map((leader) => (
                <tr key={leader.rank}>
                  <td>
                    <span className="rank">{leader.rank}</span>
                  </td>
                  <td>
                    <div className="leaderboard-name">
                      <span className={`trend-icon ${leader.trend}`}>
                        {leader.trend === "up" ? (
                          <Image
                            src="/images/ArrowRise.svg"
                            alt="เพิ่มขึ้น"
                            width={18}
                            height={18}
                          />
                        ) : (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden
                          >
                            <path
                              d="M6 15l6-6 6 6"
                              stroke="#c0392b"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <span>{leader.name}</span>
                    </div>
                  </td>
                  <td>{leader.sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardPage>
  );
}
