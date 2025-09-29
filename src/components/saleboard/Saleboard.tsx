"use client";

import styled from "styled-components";

type TrendDirection = "up" | "down";

type ProductRanking = {
  rank: number;
  name: string;
  code: string;
  sales: string;
  trend?: TrendDirection;
  emoji?: string;
};

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
  background: #EFBE46;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  color: #1f2024;
  box-shadow: 0 6px 12px rgba(15, 15, 15, 0.08);
`;

const TrendBadge = styled.span<{ $trend?: TrendDirection }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: ${({ $trend }) =>
    $trend === "up" ? "#2abf75" : $trend === "down" ? "#e25c5c" : "transparent"};
  ${({ $trend }) => !$trend && "visibility: hidden;"}
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

const ProductEmoji = styled.span`
  font-size: 32px;
  line-height: 1;
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

const productSales: ProductRanking[] = [
  {
    rank: 1,
    name: "เสื้อแขนยาว",
    code: "รหัสสินค้า xxxxx",
    sales: "xxx ชิ้น",
    trend: "up",
    emoji: "🐈\u200d⬛",
  },
  {
    rank: 2,
    name: "เสื้อแขนยาว",
    code: "รหัสสินค้า xxxxx",
    sales: "xxx ชิ้น",
    trend: "down",
    emoji: "🐱",
  },
  {
    rank: 3,
    name: "เสื้อแขนยาว",
    code: "รหัสสินค้า xxxxx",
    sales: "xxx ชิ้น",
    trend: "up",
    emoji: "🐈\u200d⬛",
  },
  {
    rank: 4,
    name: "เสื้อแขนยาว",
    code: "รหัสสินค้า xxxxx",
    sales: "xxx ชิ้น",
    trend: "down",
  },
  {
    rank: 5,
    name: "เสื้อแขนยาว",
    code: "รหัสสินค้า xxxxx",
    sales: "xxx ชิ้น",
    trend: "down",
  },
];

function TrendArrow({ direction }: { direction: TrendDirection }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      {direction === "up" ? (
        <path d="M6 2l4 4H2L6 2z" fill="currentColor" />
      ) : (
        <path d="M6 10l4-4H2l4 4z" fill="currentColor" />
      )}
    </svg>
  );
}

export default function Saleboard() {
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
        <tbody>
          {productSales.map((product) => (
            <TableRow key={product.rank}>
              <TableCell>
                <RankGroup>
                  <RankBadge>{product.rank}</RankBadge>
                  <TrendBadge $trend={product.trend}>
                    {product.trend ? <TrendArrow direction={product.trend} /> : null}
                  </TrendBadge>
                </RankGroup>
              </TableCell>
              <TableCell>
                <ProductCell>
                  <ProductAvatar aria-hidden={!product.emoji}>
                    {product.emoji ? <ProductEmoji>{product.emoji}</ProductEmoji> : null}
                  </ProductAvatar>
                  <ProductInfo>
                    <ProductName>{product.name}</ProductName>
                    <ProductCode>{product.code}</ProductCode>
                  </ProductInfo>
                </ProductCell>
              </TableCell>
              <TableCell>{product.sales}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </SaleboardTable>
    </SaleboardCard>
  );
}
