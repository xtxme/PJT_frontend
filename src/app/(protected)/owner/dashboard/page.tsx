'use client';
import { useEffect, useState } from "react";
import DashButton from "@/components/dash-button/DashButton";
import Image from "next/image";
import styled from "styled-components";
import SummaryCard from "@/components/summary-card/SummaryCard";
import Leaderboard from "@/components/leaderboard/Leaderboard";
import Saleboard from "@/components/saleboard/Saleboard";
import SaleSummaryChart from "@/components/sale-summary-chart/SaleSummaryChart";
import PurchaseSummaryChart from "@/components/purchase-summary-chart/PurchaseSummaryChart";
import TopSellersChart from "@/components/top-sellers-chart/TopSellersChart";
import DeadStockChart from "@/components/dead-stock-chart/DeadStockChart";
import HighestOrderCustomerChart from "@/components/highestOrderCustomer-chart/HighestOrderCustomerChart";
import HighestOrderCompanyChart from "@/components/highestOrderCompany-chart/HighestOrderCompanyChart";

const backendDomain = (process.env.NEXT_PUBLIC_BACKEND_DOMAIN_URL ?? "http://localhost").replace(/\/$/, "");
const backendPort = process.env.NEXT_PUBLIC_BACKEND_PORT ?? "5002";
const backendBaseUrl = `${backendDomain}:${backendPort}`;

const currencyFormatter = new Intl.NumberFormat("th-TH", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const DashboardPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 100%;
  color: #0f0f0f;

  .dash-text {
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
    font-size: 34px;
    font-style: normal;
    font-weight: 700;
    line-height: 1.2;
  }
`;

const SummaryCardsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 54px;
  align-items: stretch;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 540px;
  gap: 40px;
  align-items: start;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export default function OwnerDashboardPage() {
  const [monthlySalesTotal, setMonthlySalesTotal] = useState<number | null>(null);
  const [isLoadingMonthlySales, setIsLoadingMonthlySales] = useState(true);
  const [monthlySalesError, setMonthlySalesError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchMonthlySalesTotal() {
      if (!isMounted) {
        return;
      }

      setIsLoadingMonthlySales(true);
      setMonthlySalesError(null);

      try {
        const response = await fetch(`${backendBaseUrl}/analytics/sales/monthly-total`, {
          signal: controller.signal,
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data: { currentMonthTotal?: unknown } = await response.json();
        const rawTotal = data?.currentMonthTotal;
        const parsedTotal =
          typeof rawTotal === "number"
            ? rawTotal
            : rawTotal != null
              ? Number(rawTotal)
              : null;

        if (isMounted) {
          const sanitizedTotal =
            typeof parsedTotal === "number" && Number.isFinite(parsedTotal)
              ? parsedTotal
              : 0;

          setMonthlySalesTotal(sanitizedTotal);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        if (isMounted) {
          setMonthlySalesError("ไม่สามารถโหลดข้อมูลได้");
          setMonthlySalesTotal(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingMonthlySales(false);
        }
      }
    }

    fetchMonthlySalesTotal();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const monthlySalesValue = (() => {
    if (monthlySalesError) {
      return "ไม่สามารถโหลดข้อมูลได้";
    }

    if (isLoadingMonthlySales) {
      return "กำลังโหลด...";
    }

    return currencyFormatter.format(monthlySalesTotal ?? 0);
  })();

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

      <ContentGrid>
        <LeftColumn>
          <SummaryCardsRow>
            <SummaryCard
              title="ยอดขายรวม"
              unit="฿"
              unitValue="฿"
              value={monthlySalesValue}
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
          </SummaryCardsRow>
          <SaleSummaryChart />
          <PurchaseSummaryChart />
          <HighestOrderCustomerChart />
          <HighestOrderCompanyChart/>
        </LeftColumn>
        <RightColumn>
          <Leaderboard />
          <Saleboard />
          <TopSellersChart />
          <DeadStockChart />
        </RightColumn>
      </ContentGrid>
    </DashboardPage>
  );
}
