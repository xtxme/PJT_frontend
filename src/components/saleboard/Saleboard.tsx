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

const SaleboardCard = styled.section`
  width: 396px;
  height: 484px;
  flex-shrink: 0;
  border-radius: 17px;
  background: #ffffff;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 16px 28px rgba(15, 15, 15, 0.06);
  font-family: var(--font-ibm-plex-sans-thai), 'IBM Plex Sans Thai', sans-serif;

  .saleboard-title {
    font-size: 18px;
    font-weight: 600;
    color: #1f2024;
  }

  .saleboard-header {
    display: grid;
    grid-template-columns: 110px 1fr 96px;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    color: rgba(31, 32, 36, 0.6);
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(31, 32, 36, 0.2);
  }

  .saleboard-rows {
    display: flex;
    flex-direction: column;
    gap: 18px;
    flex: 1;
  }

  .saleboard-row {
    display: grid;
    grid-template-columns: 110px 1fr 96px;
    align-items: center;
    column-gap: 16px;
  }

  .rank-cell {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .rank-number {
    display: inline-flex;
    width: 24px;
    height: 24px;
    border-radius: 5px;
    background: #EFBE46;
    align-items: center;
    justify-content: center;
    color: #0f0f0f;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    font-family: var(--font-ibm-plex-sans-thai), 'IBM Plex Sans Thai', sans-serif;
  }

  .trend-icon {
    width: 22px;
    height: 22px;
    border-radius: 999px;
    background: #ffffff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: rgba(31, 32, 36, 0.24);
  }

  .trend-icon.up {
    color: #2abf75;
  }

  .trend-icon.down {
    color: #e35f5f;
  }

  .trend-icon.none {
    visibility: hidden;
  }

  .product-cell {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .product-avatar {
    width: 60px;
    height: 60px;
    border-radius: 18px;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .product-avatar .emoji {
    font-size: 32px;
    line-height: 1;
  }

  .product-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .product-name {
    font-size: 16px;
    font-weight: 600;
    color: #1f2024;
  }

  .product-code {
    font-size: 14px;
    font-weight: 400;
    color: rgba(31, 32, 36, 0.6);
  }

  .sales-cell {
    justify-self: end;
    font-size: 16px;
    font-weight: 600;
    color: #1f2024;
  }
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
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      {direction === "up" ? (
        <path d="M6 2l4 4H2l4-4z" />
      ) : (
        <path d="M6 10l4-4H2l4 4z" />
      )}
    </svg>
  );
}

export default function Saleboard() {
  return (
    <SaleboardCard>
      <h2 className="saleboard-title">ยอดขายตามอันดับสินค้า</h2>
      <div className="saleboard-header">
        <span>อันดับ</span>
        <span>รายการสินค้า</span>
        <span>ยอดการขาย</span>
      </div>
      <div className="saleboard-rows">
        {productSales.map((product) => (
          <div key={product.rank} className="saleboard-row">
            <div className="rank-cell">
              <span className="rank-number">{product.rank}</span>
              <span
                className={`trend-icon ${product.trend ? product.trend : "none"}`}
                aria-hidden={!product.trend}
              >
                {product.trend ? <TrendArrow direction={product.trend} /> : null}
              </span>
            </div>
            <div className="product-cell">
              <div className="product-avatar" aria-hidden={!product.emoji}>
                {product.emoji ? <span className="emoji">{product.emoji}</span> : null}
              </div>
              <div className="product-info">
                <span className="product-name">{product.name}</span>
                <span className="product-code">{product.code}</span>
              </div>
            </div>
            <span className="sales-cell">{product.sales}</span>
          </div>
        ))}
      </div>
    </SaleboardCard>
  );
}
