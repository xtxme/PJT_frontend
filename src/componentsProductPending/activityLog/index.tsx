'use client';

import styled from 'styled-components';

type ActivityLogItem = {
  productName: string;
  productCode: string;
  price: string;
  highlighted?: boolean;
};

type ActivityLogProps = {
  sectionTitle: string;
  title: string;
  filterLabel: string;
  items: ActivityLogItem[];
};

const StyledActivityLog = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;

  .section-title {
    font-size: 26px;
    font-weight: 700;
    color: #0f0f0f;
    margin: 0;
  }

  .panel {
    background: linear-gradient(180deg, #ffffff 0%, #f8f8fb 100%);
    border-radius: 28px;
    padding: 28px 32px;
    box-shadow: 0 24px 48px rgba(15, 15, 15, 0.08);
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .panel-title {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .panel-title h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #111111;
  }

  .panel-title span {
    font-size: 14px;
    color: #7a7a7a;
    font-weight: 500;
  }

  .panel-filter {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    border-radius: 14px;
    background: #f0f0f4;
    font-size: 14px;
    font-weight: 600;
    color: #4c4c55;
  }

  .panel-filter img {
    width: 12px;
    height: 12px;
  }

  .table {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .table-head {
    display: grid;
    grid-template-columns: 2.5fr 1.3fr 1fr 0.4fr;
    padding: 0 16px;
    font-size: 14px;
    font-weight: 700;
    color: #81818f;
  }

  .table-row {
    display: grid;
    grid-template-columns: 2.5fr 1.3fr 1fr 0.4fr;
    align-items: center;
    padding: 18px 20px;
    border-radius: 20px;
    background: #f6f6f9;
    color: #2f2f3a;
    font-size: 15px;
    font-weight: 600;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .table-row.highlighted {
    background: #e9f0ff;
  }

  .table-row:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 36px rgba(15, 15, 15, 0.08);
  }

  .table-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #ebebf2;
  }

  .table-action img {
    width: 14px;
    height: 14px;
  }

  @media (max-width: 960px) {
    .panel {
      padding: 24px;
    }

    .table-head {
      display: none;
    }

    .table-row {
      grid-template-columns: 1fr;
      row-gap: 10px;
      align-items: flex-start;
      padding: 16px 18px;
    }

    .table-row span {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-size: 14px;
    }

    .table-row span::before {
      content: attr(data-label);
      font-weight: 600;
      color: #6a6a76;
    }

    .table-action {
      align-self: flex-end;
    }
  }

  @media (max-width: 640px) {
    .section-title {
      font-size: 22px;
    }

    .panel {
      border-radius: 24px;
      padding: 20px;
    }
  }
`;

export default function ActivityLog({ sectionTitle, title, filterLabel, items }: ActivityLogProps) {
  return (
    <StyledActivityLog>
      <h2 className="section-title">{sectionTitle}</h2>
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <h3>{title}</h3>
          </div>
          <div className="panel-filter">
            <span>{filterLabel}</span>
            <img src="/images/dropdown-icon.svg" alt="filter" />
          </div>
        </div>
        <div className="table">
          <div className="table-head">
            <span>ชื่อสินค้า</span>
            <span>รหัสสินค้า</span>
            <span>ราคาขาย</span>
            <span />
          </div>
          {items.map((item, index) => (
            <div
              key={`${item.productCode}-${index}`}
              className={`table-row${item.highlighted ? ' highlighted' : ''}`}
            >
              <span data-label="ชื่อสินค้า">{item.productName}</span>
              <span data-label="รหัสสินค้า">{item.productCode}</span>
              <span data-label="ราคาขาย">{item.price}</span>
              <span data-label="จัดการ" className="table-action">
                <img src="/images/edit.svg" alt="edit" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </StyledActivityLog>
  );
}
