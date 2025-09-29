"use client";

import DashButton from "@/components/dash-button/DashButton";
import Image from "next/image";
import styled from "styled-components";

import SummaryCard from "@/components/summary-card/SummaryCard";
import Leaderboard from "@/components/leaderboard/leaderboard";
import Saleboard from "@/components/saleboard/Saleboard";

const DashboardPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 100%;
  color: #0f0f0f;

  .dash-text {
    font-family: var(--font-ibm-plex-sans-thai), 'IBM Plex Sans Thai', sans-serif;
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
    gap: 8px;
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
    font-family: var(--font-ibm-plex-sans-thai), 'IBM Plex Sans Thai', sans-serif;
    font-size: 34px;
    font-style: normal;
    font-weight: 700;
    line-height: 1.2;
  }

  .cards-row {
    display: grid;
    grid-template-columns: 256px 256px 540px;
    column-gap: 50px;
    row-gap: 50px;
    align-items: start;
    justify-items: start;
    justify-content: flex-start;
  }
`;

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

        <Leaderboard />
        <Saleboard/>
      </div>
    </DashboardPage>
  );
}
