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

type SaleSummaryPoint = {
  month: string;
  totalSales: number;
};

type PurchaseSummaryPoint = {
  month_key: string;
  total_value: number;
};

type HighestOrderCustomerPoint = {
  customerId: number;
  name: string;
  value: number;
};

type HighestOrderCustomerRange = {
  start: string;
  end: string;
};

type HighestOrderCompanyPoint = {
  company: string;
  name: string;
  value: number;
};

type HighestOrderCompanyRange = {
  start: string;
  end: string;
};

type TopSellerPoint = {
  productId: number;
  name: string;
  orders: number;
  company?: string | null;
};

type TopSellerRange = {
  start: string;
  end: string;
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
  const [saleSummaryPoints, setSaleSummaryPoints] = useState<SaleSummaryPoint[]>([]);
  const [isLoadingSaleSummary, setIsLoadingSaleSummary] = useState(true);
  const [saleSummaryError, setSaleSummaryError] = useState<string | null>(null);
  //purchaseSummary
  const [purchaseSummaryPoints, setPurchaseSummaryPoints] = useState<PurchaseSummaryPoint[]>([]);
  const [isLoadingPurchaseSummary, setIsLoadingPurchaseSummary] = useState(true);
  const [purchaseSummaryError, setPurchaseSummaryError] = useState<string | null>(null);
  const [highestOrderCustomers, setHighestOrderCustomers] = useState<HighestOrderCustomerPoint[]>([]);
  const [highestOrderCustomersRange, setHighestOrderCustomersRange] = useState<HighestOrderCustomerRange | null>(null);
  const [isLoadingHighestOrderCustomers, setIsLoadingHighestOrderCustomers] = useState(true);
  const [highestOrderCustomersError, setHighestOrderCustomersError] = useState<string | null>(null);
  const [highestOrderCompanies, setHighestOrderCompanies] = useState<HighestOrderCompanyPoint[]>([]);
  const [highestOrderCompaniesRange, setHighestOrderCompaniesRange] = useState<HighestOrderCompanyRange | null>(null);
  const [isLoadingHighestOrderCompanies, setIsLoadingHighestOrderCompanies] = useState(true);
  const [highestOrderCompaniesError, setHighestOrderCompaniesError] = useState<string | null>(null);
  const [topSellers, setTopSellers] = useState<TopSellerPoint[]>([]);
  const [topSellersRange, setTopSellersRange] = useState<TopSellerRange | null>(null);
  const [isLoadingTopSellers, setIsLoadingTopSellers] = useState(true);
  const [topSellersError, setTopSellersError] = useState<string | null>(null);

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

    async function fetchSaleSummary() {
      if (!isMounted) {
        return;
      }

      setIsLoadingSaleSummary(true);
      setSaleSummaryError(null);

      try {
        const response = await fetch(`${backendBaseUrl}/analytics/sales/monthly-summary`, {
          signal: controller.signal,
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data: { months?: unknown } = await response.json();

        const rawMonths = Array.isArray(data?.months) ? data.months : [];
        const sanitizedPoints = rawMonths
          .map((item) => {
            if (!item || typeof item !== "object") {
              return null;
            }

            const record = item as Record<string, unknown>;
            const monthRaw = record.month;
            const totalSalesRaw = record.totalSales;

            if (typeof monthRaw !== "string" || monthRaw.trim().length === 0) {
              return null;
            }

            const totalParsed =
              typeof totalSalesRaw === "number"
                ? totalSalesRaw
                : totalSalesRaw != null
                  ? Number(totalSalesRaw)
                  : 0;

            const totalSalesValue =
              typeof totalParsed === "number" && Number.isFinite(totalParsed)
                ? totalParsed
                : 0;

            return {
              month: monthRaw.trim(),
              totalSales: totalSalesValue,
            } satisfies SaleSummaryPoint;
          })
          .filter((point): point is SaleSummaryPoint => Boolean(point));

        if (isMounted) {
          setSaleSummaryPoints(sanitizedPoints);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        if (isMounted) {
          setSaleSummaryError("ไม่สามารถโหลดข้อมูลได้");
          setSaleSummaryPoints([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingSaleSummary(false);
        }
      }
    }

    fetchSaleSummary();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchHighestOrderCompanies() {
      if (!isMounted) {
        return;
      }

      setIsLoadingHighestOrderCompanies(true);
      setHighestOrderCompaniesError(null);

      try {
        const response = await fetch(`${backendBaseUrl}/analytics/company/top-order-value`, {
          signal: controller.signal,
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data: {
          companies?: unknown;
          range?: { start?: unknown; end?: unknown } | null;
        } = await response.json();

        const rawCompanies = Array.isArray(data?.companies) ? data.companies : [];
        const sanitizedCompanies = rawCompanies
          .map((item) => {
            if (!item || typeof item !== "object") {
              return null;
            }

            const record = item as Record<string, unknown>;
            const nameRaw = record.name ?? record.company;
            const companyRaw = record.company ?? record.name;
            const valueRaw =
              record.value ?? record.totalOrderValue ?? record.totalAmount ?? record.total_amount;

            const nameValue =
              typeof nameRaw === "string" && nameRaw.trim().length > 0
                ? nameRaw.trim()
                : typeof companyRaw === "string" && companyRaw.trim().length > 0
                  ? companyRaw.trim()
                  : "ไม่ระบุบริษัท";

            const companyValue =
              typeof companyRaw === "string" && companyRaw.trim().length > 0
                ? companyRaw.trim()
                : nameValue;

            const numericValue =
              typeof valueRaw === "number"
                ? valueRaw
                : valueRaw != null
                  ? Number(valueRaw)
                  : 0;

            const sanitizedValue =
              typeof numericValue === "number" && Number.isFinite(numericValue)
                ? numericValue
                : 0;

            return {
              company: companyValue,
              name: nameValue,
              value: sanitizedValue,
            } satisfies HighestOrderCompanyPoint;
          })
          .filter(
            (company): company is HighestOrderCompanyPoint =>
              company !== null && Number.isFinite(company.value)
          );

        const rangeRaw = data?.range;
        const sanitizedRange =
          rangeRaw && typeof rangeRaw === "object" && rangeRaw !== null
            ? (() => {
                const record = rangeRaw as Record<string, unknown>;
                const startRaw = record.start;
                const endRaw = record.end;
                const startValue = typeof startRaw === "string" ? startRaw : null;
                const endValue = typeof endRaw === "string" ? endRaw : null;

                if (!startValue || !endValue) {
                  return null;
                }

                return {
                  start: startValue,
                  end: endValue,
                } satisfies HighestOrderCompanyRange;
              })()
            : null;

        if (isMounted) {
          setHighestOrderCompanies(sanitizedCompanies);
          setHighestOrderCompaniesRange(sanitizedRange);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        if (isMounted) {
          setHighestOrderCompaniesError("ไม่สามารถโหลดข้อมูลได้");
          setHighestOrderCompanies([]);
          setHighestOrderCompaniesRange(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingHighestOrderCompanies(false);
        }
      }
    }

    fetchHighestOrderCompanies();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchTopSellers() {
      if (!isMounted) {
        return;
      }

      setIsLoadingTopSellers(true);
      setTopSellersError(null);

      try {
        const response = await fetch(`${backendBaseUrl}/analytics/products/top-sellers`, {
          signal: controller.signal,
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data: {
          products?: unknown;
          range?: { start?: unknown; end?: unknown } | null;
        } = await response.json();

        const rawProducts = Array.isArray(data?.products) ? data.products : [];
        const sanitizedProducts = rawProducts
          .map((item) => {
            if (!item || typeof item !== "object") {
              return null;
            }

            const record = item as Record<string, unknown>;
            const idRaw = record.productId ?? record.id;
            const nameRaw = record.name ?? record.productName ?? record.company;
            const companyRaw = record.company;
            const ordersRaw =
              record.orders ??
              record.quantitySold ??
              record.totalQuantity ??
              record.total_quantity;

            const idNumeric =
              typeof idRaw === "number"
                ? idRaw
                : typeof idRaw === "string"
                  ? Number(idRaw)
                  : null;

            const productId =
              typeof idNumeric === "number" && Number.isFinite(idNumeric) ? idNumeric : null;

            if (productId === null) {
              return null;
            }

            const nameValue =
              typeof nameRaw === "string" && nameRaw.trim().length > 0
                ? nameRaw.trim()
                : `สินค้า #${productId}`;

            const ordersNumeric =
              typeof ordersRaw === "number"
                ? ordersRaw
                : ordersRaw != null
                  ? Number(ordersRaw)
                  : 0;

            const sanitizedOrders =
              typeof ordersNumeric === "number" && Number.isFinite(ordersNumeric)
                ? ordersNumeric
                : 0;

            const companyValue =
              typeof companyRaw === "string" && companyRaw.trim().length > 0
                ? companyRaw.trim()
                : null;

            return {
              productId,
              name: nameValue,
              orders: sanitizedOrders,
              company: companyValue,
            } satisfies TopSellerPoint;
          })
          .filter(
            (product): product is TopSellerPoint =>
              product !== null && Number.isFinite(product.orders),
          );

        const rangeRaw = data?.range;
        const sanitizedRange =
          rangeRaw && typeof rangeRaw === "object" && rangeRaw !== null
            ? (() => {
                const record = rangeRaw as Record<string, unknown>;
                const startRaw = record.start;
                const endRaw = record.end;
                const startValue = typeof startRaw === "string" ? startRaw : null;
                const endValue = typeof endRaw === "string" ? endRaw : null;

                if (!startValue || !endValue) {
                  return null;
                }

                return {
                  start: startValue,
                  end: endValue,
                } satisfies TopSellerRange;
              })()
            : null;

        if (isMounted) {
          setTopSellers(sanitizedProducts);
          setTopSellersRange(sanitizedRange);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        if (isMounted) {
          setTopSellersError("ไม่สามารถโหลดข้อมูลได้");
          setTopSellers([]);
          setTopSellersRange(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingTopSellers(false);
        }
      }
    }

    fetchTopSellers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

//purchaseSummary
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchPurchaseSummary() {
      if (!isMounted) {
        return;
      }

      setIsLoadingPurchaseSummary(true);
      setPurchaseSummaryError(null);

      try {
        const response = await fetch(`${backendBaseUrl}/analytics/stock-in/summary`, {
          signal: controller.signal,
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data: { data?: unknown } = await response.json();
        const rawPoints = Array.isArray(data?.data) ? data.data : [];
        const sanitizedPoints = rawPoints
          .map((item) => {
            if (!item || typeof item !== "object") {
              return null;
            }

            const record = item as Record<string, unknown>;
            const monthRaw = record.month_key; //month_key and total_value ส่งมาจาก backend
            const totalValueRaw = record.total_value;

            if (typeof monthRaw !== "string" || monthRaw.trim().length === 0) {
              return null;
            }

            const totalParsed =
              typeof totalValueRaw === "number"
                ? totalValueRaw
                : totalValueRaw != null
                  ? Number(totalValueRaw)
                  : 0;

            const totalValue =
              typeof totalParsed === "number" && Number.isFinite(totalParsed)
                ? totalParsed
                : 0;

            return {
              month_key: monthRaw.trim(),
              total_value: totalValue,
            } satisfies PurchaseSummaryPoint;
          })
          .filter((point): point is PurchaseSummaryPoint => Boolean(point));

        if (isMounted) {
          setPurchaseSummaryPoints(sanitizedPoints);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        if (isMounted) {
          setPurchaseSummaryError("ไม่สามารถโหลดข้อมูลได้");
          setPurchaseSummaryPoints([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingPurchaseSummary(false);
        }
      }
    }

    fetchPurchaseSummary();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchHighestOrderCustomers() {
      if (!isMounted) {
        return;
      }

      setIsLoadingHighestOrderCustomers(true);
      setHighestOrderCustomersError(null);

      try {
        const response = await fetch(`${backendBaseUrl}/analytics/customers/top-order-value`, {
          signal: controller.signal,
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data: {
          customers?: unknown;
          range?: { start?: unknown; end?: unknown } | null;
        } = await response.json();

        const rawCustomers = Array.isArray(data?.customers) ? data.customers : [];
        const sanitizedCustomers = rawCustomers
          .map((item) => {
            if (!item || typeof item !== "object") {
              return null;
            }

            const record = item as Record<string, unknown>;
            const idRaw = record.customerId ?? record.customer_id;
            const nameRaw = record.name;
            const valueRaw = record.value ?? record.totalAmount ?? record.total_amount;

            const idValue =
              typeof idRaw === "number"
                ? idRaw
                : idRaw != null
                  ? Number(idRaw)
                  : NaN;

            if (!Number.isFinite(idValue)) {
              return null;
            }

            const nameValue =
              typeof nameRaw === "string" && nameRaw.trim().length > 0
                ? nameRaw.trim()
                : `ลูกค้า ${idValue}`;

            const numericValue =
              typeof valueRaw === "number"
                ? valueRaw
                : valueRaw != null
                  ? Number(valueRaw)
                  : 0;

            const sanitizedValue =
              typeof numericValue === "number" && Number.isFinite(numericValue)
                ? numericValue
                : 0;

            return {
              customerId: idValue,
              name: nameValue,
              value: sanitizedValue,
            } satisfies HighestOrderCustomerPoint;
          })
        .filter(
          (customer): customer is HighestOrderCustomerPoint =>
            customer !== null && Number.isFinite(customer.value)
        );

        const rangeRaw = data?.range;
        const sanitizedRange =
          rangeRaw && typeof rangeRaw === "object" && rangeRaw !== null
            ? (() => {
                const record = rangeRaw as Record<string, unknown>;
                const startRaw = record.start;
                const endRaw = record.end;
                const startValue = typeof startRaw === "string" ? startRaw : null;
                const endValue = typeof endRaw === "string" ? endRaw : null;

                if (!startValue || !endValue) {
                  return null;
                }

                return {
                  start: startValue,
                  end: endValue,
                } satisfies HighestOrderCustomerRange;
              })()
            : null;

        if (isMounted) {
          setHighestOrderCustomers(sanitizedCustomers);
          setHighestOrderCustomersRange(sanitizedRange);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        if (isMounted) {
          setHighestOrderCustomersError("ไม่สามารถโหลดข้อมูลได้");
          setHighestOrderCustomers([]);
          setHighestOrderCustomersRange(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingHighestOrderCustomers(false);
        }
      }
    }

    fetchHighestOrderCustomers();

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
          <SaleSummaryChart
            points={saleSummaryPoints}
            isLoading={isLoadingSaleSummary}
            error={saleSummaryError}
          />
          <PurchaseSummaryChart
            points={purchaseSummaryPoints}
            isLoading={isLoadingPurchaseSummary}
            error={purchaseSummaryError}
          />
          <HighestOrderCustomerChart
            customers={highestOrderCustomers}
            isLoading={isLoadingHighestOrderCustomers}
            error={highestOrderCustomersError}
            range={highestOrderCustomersRange}
          />
          <HighestOrderCompanyChart
            companies={highestOrderCompanies}
            isLoading={isLoadingHighestOrderCompanies}
            error={highestOrderCompaniesError}
            range={highestOrderCompaniesRange}
          />
        </LeftColumn>
        <RightColumn>
          <Leaderboard
            rows={leaderboardRows}
            isLoading={isLoadingLeaderboard}
            error={leaderboardError}
            monthLabel={leaderboardMonth}
          />
          <Saleboard />
          <TopSellersChart
            products={topSellers}
            isLoading={isLoadingTopSellers}
            error={topSellersError}
            range={topSellersRange}
          />
          <DeadStockChart />
        </RightColumn>
      </ContentGrid>
    </DashboardPage>
  );
}
