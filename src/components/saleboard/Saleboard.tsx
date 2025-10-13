"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";

type SaleboardProduct = {
  rank: number;
  productId: string;
  productName: string;
  totalSold: number;
  image: string | null;
};

type SaleboardApiResponse = {
  products?: unknown;
};

const quantityFormatter = new Intl.NumberFormat("th-TH");

const backendDomain = (process.env.NEXT_PUBLIC_BACKEND_DOMAIN_URL ?? "http://localhost").replace(
  /\/$/,
  ""
);
const backendPort = process.env.NEXT_PUBLIC_BACKEND_PORT ?? "5002";
const backendBaseUrl = `${backendDomain}:${backendPort}`;

const SaleboardCard = styled.article`
  background: #ffffff;
  border-radius: 32px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 20px 40px rgba(15, 15, 15, 0.06);
  border: 1px solid rgba(15, 15, 15, 0.08);
  width: 540px;
  font-family: var(--font-ibm-plex-sans-thai), "IBM Plex Sans Thai", sans-serif;

  @media (max-width: 1200px) {
    max-width: 100%;
  }
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1f2024;
`;

const SaleboardTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
  color: #1f2024;
`;

const HeaderCell = styled.th`
  text-align: left;
  font-weight: 500;
  color: rgba(31, 32, 36, 0.65);
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(31, 32, 36, 0.18);

  &:last-child {
    text-align: right;
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid rgba(31, 32, 36, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 18px 0;
  vertical-align: middle;

  &:first-child {
    width: 96px;
  }

  &:last-child {
    text-align: right;
    font-weight: 600;
  }
`;

const RankGroup = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const RankBadge = styled.span`
  display: inline-flex;
  width: 24px;
  height: 24px;
  border-radius: 5px;
  background: #efbe46;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  color: #1f2024;
  box-shadow: 0 6px 12px rgba(15, 15, 15, 0.08);
`;

const ProductCell = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ProductAvatar = styled.span`
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: #f4f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProductInitial = styled.span`
  font-size: 22px;
  font-weight: 600;
  color: #1f2024;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ProductName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #1f2024;
`;

const ProductCode = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: rgba(31, 32, 36, 0.6);
`;

const TableMessageRow = styled.tr``;

const TableMessageCell = styled.td`
  padding: 24px 0;
  text-align: center;
  color: rgba(31, 32, 36, 0.6);
  font-weight: 500;
`;

const formatProductCode = (productId: string) => {
  const trimmed = productId.trim();
  if (trimmed.length === 0) {
    return "รหัสสินค้า -";
  }

  const numeric = Number.parseInt(trimmed, 10);
  if (Number.isFinite(numeric)) {
    return `รหัสสินค้า ${String(Math.trunc(numeric)).padStart(5, "0")}`;
  }

  return `รหัสสินค้า ${trimmed}`;
};

const getProductInitial = (productName: string) => {
  const trimmed = productName.trim();
  return trimmed.length > 0 ? trimmed[0] : "#";
};

const sanitizeProducts = (rawProducts: unknown): SaleboardProduct[] => {
  if (!Array.isArray(rawProducts)) {
    return [];
  }

  return rawProducts
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;
      const idRaw = record.productId ?? record.id ?? record.productID;
      const rankRaw = record.rank;
      const nameRaw = record.productName ?? record.name;
      const totalSoldRaw =
        record.totalSold ?? record.total_quantity ?? record.totalQuantity ?? record.quantity;
      const imageRaw = record.image ?? record.productImage ?? null;

      const parsedId =
        typeof idRaw === "string" && idRaw.trim().length > 0
          ? idRaw.trim()
          : typeof idRaw === "number" && Number.isFinite(idRaw)
            ? String(idRaw)
            : null;

      if (!parsedId) {
        return null;
      }

      const parsedRank =
        typeof rankRaw === "number"
          ? rankRaw
          : typeof rankRaw === "string"
            ? Number.parseInt(rankRaw, 10)
            : index + 1;
      const rank = Number.isFinite(parsedRank) ? parsedRank : index + 1;

      const name =
        typeof nameRaw === "string" && nameRaw.trim().length > 0
          ? nameRaw.trim()
          : `สินค้า #${parsedId}`;

      const parsedTotalSold =
        typeof totalSoldRaw === "number"
          ? totalSoldRaw
          : typeof totalSoldRaw === "string"
            ? Number.parseFloat(totalSoldRaw)
            : 0;
      const totalSold = Number.isFinite(parsedTotalSold) ? parsedTotalSold : 0;

      const image =
        typeof imageRaw === "string" && imageRaw.trim().length > 0 ? imageRaw.trim() : null;

      return {
        rank,
        productId: parsedId,
        productName: name,
        totalSold,
        image,
      } satisfies SaleboardProduct;
    })
    .filter((product): product is SaleboardProduct => product !== null)
    .sort((a, b) => a.rank - b.rank);
};

export default function Saleboard() {
  const [products, setProducts] = useState<SaleboardProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchTopSellerRanking() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${backendBaseUrl}/analytics/products/top-sellers-month`, {
          signal: controller.signal,
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data: SaleboardApiResponse = await response.json();
        const sanitized = sanitizeProducts(data.products);

        if (isMounted) {
          setProducts(sanitized);
        }
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
          return;
        }

        if (isMounted) {
          setError("ไม่สามารถโหลดข้อมูลได้");
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchTopSellerRanking();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <TableMessageRow>
          <TableMessageCell colSpan={3}>กำลังโหลด...</TableMessageCell>
        </TableMessageRow>
      );
    }

    if (error) {
      return (
        <TableMessageRow>
          <TableMessageCell colSpan={3}>{error}</TableMessageCell>
        </TableMessageRow>
      );
    }

    if (products.length === 0) {
      return (
        <TableMessageRow>
          <TableMessageCell colSpan={3}>ยังไม่มีข้อมูลยอดขายสินค้า</TableMessageCell>
        </TableMessageRow>
      );
    }

    return products.map((product) => (
      <TableRow key={`${product.rank}-${product.productId}`}>
        <TableCell>
          <RankGroup>
            <RankBadge>{product.rank}</RankBadge>
          </RankGroup>
        </TableCell>
        <TableCell>
          <ProductCell>
            <ProductAvatar>
              {product.image ? (
                <ProductImage src={product.image} alt={product.productName} />
              ) : (
                <ProductInitial aria-hidden>{getProductInitial(product.productName)}</ProductInitial>
              )}
            </ProductAvatar>
            <ProductInfo>
              <ProductName>{product.productName}</ProductName>
              <ProductCode>{formatProductCode(product.productId)}</ProductCode>
            </ProductInfo>
          </ProductCell>
        </TableCell>
        <TableCell>{`${quantityFormatter.format(product.totalSold)} ชิ้น`}</TableCell>
      </TableRow>
    ));
  };

  return (
    <SaleboardCard>
      <Title>ยอดขายตามอันดับสินค้า</Title>
      <SaleboardTable>
        <thead>
          <tr>
            <HeaderCell>อันดับ</HeaderCell>
            <HeaderCell>รายการสินค้า</HeaderCell>
            <HeaderCell>ยอดการขาย</HeaderCell>
          </tr>
        </thead>
        <tbody>{renderTableBody()}</tbody>
      </SaleboardTable>
    </SaleboardCard>
  );
}
