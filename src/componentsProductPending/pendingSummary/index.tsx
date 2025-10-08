'use client';

import styled from 'styled-components';

type PendingSummaryItem = {
  productName: string;
  productCode: string;
  price: string;
};

type PendingSummaryProps = {
  heading: string;
  items: PendingSummaryItem[];
};

const StyledPendingSummary = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;

  .summary-heading {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .summary-heading h2 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: #0f0f0f;
  }

  .summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 18px;
  }

  .card {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    gap: 16px;
    padding: 20px 22px;
    border-radius: 18px;
    background: #dcdce0;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
  }

  .card-details {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .card-title {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 16px;
    font-weight: 600;
    color: #101010;
  }

  .card-meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #262626;
  }

  .card-action {
    width: 46px;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #efeff4;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6),
      0 8px 14px rgba(15, 15, 15, 0.08);
  }

  .card-action img {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 640px) {
    .summary-heading h2 {
      font-size: 22px;
    }

    .card {
      padding: 18px;
    }
  }
`;

export default function PendingSummary({ heading, items }: PendingSummaryProps) {
  return (
    <StyledPendingSummary>
      <div className="summary-heading">
        <h2>{heading}</h2>
      </div>
      <div className="summary-cards">
        {items.map((item, index) => (
          <div key={`${item.productCode}-${index}`} className="card">
            <div className="card-details">
              <div className="card-title">
                <span>ชื่อสินค้า: {item.productName}</span>
              </div>
              <div className="card-meta">
                <span>รหัสสินค้า: {item.productCode}</span>
                <span>ราคาขาย: {item.price}</span>
              </div>
            </div>
            <div className="card-action">
              <img src="/images/edit.svg" alt="edit" />
            </div>
          </div>
        ))}
      </div>
    </StyledPendingSummary>
  );
}
