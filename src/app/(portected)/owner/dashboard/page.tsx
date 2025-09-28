"use client";

import DashButton from "@/components/dash-button/DashButton";
import Image from "next/image";
import styled from "styled-components";

import SummaryCard from "@/components/summary-card/SummaryCard";

const DashboardPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 100%;
  color: #0f0f0f;

  .dash-text {
    font-family: ibmThai;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px;
  }

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
    margin-top: -6px;
  }

  .welcome h1 {
    font-family: ibmThai;
    font-size: 34px;
    font-style: normal;
    font-weight: 700;
    line-height: 1.2;
  }

  .cards-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(256px, 256px));
    gap: 24px;
    align-items: start;
    justify-items: start;
    justify-content: flex-start;
  }

  .leaderboard {
    background: #d9d9d9;
    border-radius: 28px;
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-height: 200px;
    grid-column: 1 / -1;
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
    padding: 24px 16px;

    .welcome h1 {
      font-size: 28px;
    }

    .cards-row {
      grid-template-columns: minmax(0, 1fr);
      justify-items: stretch;
    }

    .leaderboard {
      grid-column: 1 / -1;
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
            width={24}
            height={24}
          />
          <img src="/images/arrow-left.svg" alt="arrow-left" />
          <strong className="dash-text">Dashboard</strong>
        </div>
        <DashButton />
      </div>

      <div className="welcome">
        <h1>ยินดีต้อนรับ, คุณ xxxxxx</h1>
      </div>

      <div className="cards-row">
        <SummaryCard
          title="ยอดขายรวม"
          unit="฿"
          unitValue="฿"
          value="xxx,xxx"
          trendText="+xx.xx"
          fixTrendText="% จากเดือนที่แล้ว"
        />

        <SummaryCard
          title="กำไรสุทธิ"
          unit="฿"
          unitValue="฿"
          value="xxx,xxx"
          trendText="-xx.xx"
          fixTrendText="% จากเดือนที่แล้ว"
        />

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
