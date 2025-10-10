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

type EmployeeSalesLeaderboardRow = {
  rank: number;
  name: string;
  totalSales: number;
};

const currencyFormatter = new Intl.NumberFormat("th-TH", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const percentFormatter = new Intl.NumberFormat("th-TH", {
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
  const [monthlySalesPercentChange, setMonthlySalesPercentChange] = useState<number | null>(null);
  const [monthlyNetProfit, setMonthlyNetProfit] = useState<number | null>(null);
  const [isLoadingMonthlyProfit, setIsLoadingMonthlyProfit] = useState(true);
  const [monthlyProfitError, setMonthlyProfitError] = useState<string | null>(null);
  const [monthlyProfitPercentChange, setMonthlyProfitPercentChange] = useState<number | null>(null);
  const [leaderboardRows, setLeaderboardRows] = useState<EmployeeSalesLeaderboardRow[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);
  const [leaderboardMonth, setLeaderboardMonth] = useState<string | null>(null);

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

        const data: {
          currentMonthTotal?: unknown;
          previousMonthTotal?: unknown;
          percentChange?: unknown;
        } = await response.json();
        const rawTotal = data?.currentMonthTotal;
        const parsedTotal =
          typeof rawTotal === "number"
            ? rawTotal
            : rawTotal != null
              ? Number(rawTotal)
              : null;
        const rawPercentChange = data?.percentChange;
        const parsedPercentChange =
          typeof rawPercentChange === "number"
            ? rawPercentChange
            : rawPercentChange != null
              ? Number(rawPercentChange)
              : null;

        if (isMounted) {
          const sanitizedTotal =
            typeof parsedTotal === "number" && Number.isFinite(parsedTotal)
              ? parsedTotal
              : 0;

          setMonthlySalesTotal(sanitizedTotal);
          setMonthlySalesPercentChange(
            typeof parsedPercentChange === "number" && Number.isFinite(parsedPercentChange)
              ? parsedPercentChange
              : null
          );
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        if (isMounted) {
          setMonthlySalesError("ไม่สามารถโหลดข้อมูลได้");
          setMonthlySalesTotal(null);
          setMonthlySalesPercentChange(null);
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

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchMonthlyNetProfit() {
      if (!isMounted) {
        return;
      }

      setIsLoadingMonthlyProfit(true);
      setMonthlyProfitError(null);

      try {
        const response = await fetch(`${backendBaseUrl}/analytics/profit/monthly-total`, {
          signal: controller.signal,
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data: {
          currentMonthNetProfit?: unknown;
          percentChange?: unknown;
        } = await response.json();

        const rawNetProfit = data?.currentMonthNetProfit;
        const parsedNetProfit =
          typeof rawNetProfit === "number"
            ? rawNetProfit
            : rawNetProfit != null
              ? Number(rawNetProfit)
              : null;

        const rawPercentChange = data?.percentChange;
        const parsedPercentChange =
          typeof rawPercentChange === "number"
            ? rawPercentChange
            : rawPercentChange != null
              ? Number(rawPercentChange)
              : null;

        if (isMounted) {
          const sanitizedNetProfit =
            typeof parsedNetProfit === "number" && Number.isFinite(parsedNetProfit)
              ? parsedNetProfit
              : 0;

          setMonthlyNetProfit(sanitizedNetProfit);
          setMonthlyProfitPercentChange(
            typeof parsedPercentChange === "number" && Number.isFinite(parsedPercentChange)
              ? parsedPercentChange
              : null
          );
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        if (isMounted) {
          setMonthlyProfitError("ไม่สามารถโหลดข้อมูลได้");
          setMonthlyNetProfit(null);
          setMonthlyProfitPercentChange(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingMonthlyProfit(false);
        }
      }
    }

    fetchMonthlyNetProfit();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchLeaderboard() {
      if (!isMounted) {
        return;
      }

      setIsLoadingLeaderboard(true);
      setLeaderboardError(null);

      try {
        const response = await fetch(`${backendBaseUrl}/analytics/sales/by-employee`, {
          signal: controller.signal,
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data: {
          month?: unknown;
          rows?: unknown;
        } = await response.json();

        const monthValue =
          typeof data?.month === "string" && data.month.trim().length > 0
            ? data.month
            : null;

        const rawRows = Array.isArray(data?.rows) ? data.rows : [];
        const sanitizedRows = rawRows
          .map((item) => {
            if (!item || typeof item !== "object") {
              return null;
            }

            const record = item as Record<string, unknown>;
            const rankRaw = record.rank;
            const nameRaw = record.name;
            const totalSalesRaw = record.totalSales;

            const rankParsed =
              typeof rankRaw === "number"
                ? rankRaw
                : rankRaw != null
                  ? Number(rankRaw)
                  : NaN;

            if (!Number.isFinite(rankParsed)) {
              return null;
            }

            const nameValue =
              typeof nameRaw === "string" && nameRaw.trim().length > 0
                ? nameRaw.trim()
                : "ไม่ระบุชื่อ";

            const totalParsed =
              typeof totalSalesRaw === "number"
                ? totalSalesRaw
                : totalSalesRaw != null
                  ? Number(totalSalesRaw)
                  : 0;

            const totalSalesValue = Number.isFinite(totalParsed) ? Number(totalParsed) : 0;

            return {
              rank: Number(rankParsed),
              name: nameValue,
              totalSales: totalSalesValue,
            } satisfies EmployeeSalesLeaderboardRow;
          })
          .filter((row): row is EmployeeSalesLeaderboardRow => Boolean(row))
          .sort((a, b) => a.rank - b.rank);

        if (isMounted) {
          setLeaderboardRows(sanitizedRows);
          setLeaderboardMonth(monthValue);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        if (isMounted) {
          setLeaderboardError("ไม่สามารถโหลดข้อมูลได้");
          setLeaderboardRows([]);
          setLeaderboardMonth(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingLeaderboard(false);
        }
      }
    }

    fetchLeaderboard();

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

  const { monthlySalesTrendText, monthlySalesTrendDirection } = (() => {
    if (monthlySalesError) {
      return { monthlySalesTrendText: "--", monthlySalesTrendDirection: "down" as const };
    }

    if (isLoadingMonthlySales) {
      return { monthlySalesTrendText: "...", monthlySalesTrendDirection: "up" as const };
    }

    if (
      typeof monthlySalesPercentChange !== "number" ||
      Number.isNaN(monthlySalesPercentChange)
    ) {
      return { monthlySalesTrendText: "0.00", monthlySalesTrendDirection: "up" as const };
    }

    const direction: "up" | "down" =
      monthlySalesPercentChange >= 0 ? "up" : "down";
    const formattedPercent = percentFormatter.format(Math.abs(monthlySalesPercentChange));
    const sign =
      monthlySalesPercentChange > 0
        ? "+"
        : monthlySalesPercentChange < 0
          ? "-"
          : "";

    return {
      monthlySalesTrendText: `${sign}${formattedPercent}`,
      monthlySalesTrendDirection: direction,
    };
  })();

  const monthlyProfitValue = (() => {
    if (monthlyProfitError) {
      return "ไม่สามารถโหลดข้อมูลได้";
    }

    if (isLoadingMonthlyProfit) {
      return "กำลังโหลด...";
    }

    return currencyFormatter.format(monthlyNetProfit ?? 0);
  })();

  const { monthlyProfitTrendText, monthlyProfitTrendDirection } = (() => {
    if (monthlyProfitError) {
      return { monthlyProfitTrendText: "--", monthlyProfitTrendDirection: "down" as const };
    }

    if (isLoadingMonthlyProfit) {
      return { monthlyProfitTrendText: "...", monthlyProfitTrendDirection: "up" as const };
    }

    if (
      typeof monthlyProfitPercentChange !== "number" ||
      Number.isNaN(monthlyProfitPercentChange)
    ) {
      return { monthlyProfitTrendText: "0.00", monthlyProfitTrendDirection: "up" as const };
    }

    const direction: "up" | "down" =
      monthlyProfitPercentChange >= 0 ? "up" : "down";
    const formattedPercent = percentFormatter.format(Math.abs(monthlyProfitPercentChange));
    const sign =
      monthlyProfitPercentChange > 0
        ? "+"
        : monthlyProfitPercentChange < 0
          ? "-"
          : "";

    return {
      monthlyProfitTrendText: `${sign}${formattedPercent}`,
      monthlyProfitTrendDirection: direction,
    };
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
              trendText={monthlySalesTrendText}
              fixTrendText="% จากเดือนที่แล้ว"
              trendDirection={monthlySalesTrendDirection}
            />

            <SummaryCard
              title="กำไรสุทธิ"
              unit="฿"
              unitValue="฿"
              value={monthlyProfitValue}
              trendText={monthlyProfitTrendText}
              fixTrendText="% จากเดือนที่แล้ว"
              trendDirection={monthlyProfitTrendDirection}
            />
          </SummaryCardsRow>
          <SaleSummaryChart />
          <PurchaseSummaryChart />
          <HighestOrderCustomerChart />
          <HighestOrderCompanyChart/>
        </LeftColumn>
        <RightColumn>
          <Leaderboard
            rows={leaderboardRows}
            isLoading={isLoadingLeaderboard}
            error={leaderboardError}
            monthLabel={leaderboardMonth}
          />
          <Saleboard />
          <TopSellersChart />
          <DeadStockChart />
        </RightColumn>
      </ContentGrid>
    </DashboardPage>
  );
}
