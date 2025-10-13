'use client';

import styled from 'styled-components';

export type PendingItem = {
  id: string;
  productName: string;
  sku: string;
  quantity: string;
  requestedBy: string;
  requestedDate: string;
  status: 'waiting' | 'inProgress' | 'completed' | 'rejected';
  statusLabel: string;
};

type PendingBoardProps = {
  items: PendingItem[];
};

const StyledPendingBoard = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;

  .panel {
    width: 100%;
    max-width: 1120px;
    padding: 32px 36px;
    border-radius: 24px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.96) 8%, rgba(241, 246, 255, 0.96) 100%);
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
    gap: 8px;
  }

  .panel-title h2 {
    margin: 0;
    font-size: 26px;
    font-weight: 700;
    color: #101010;
  }

  .panel-title p {
    margin: 0;
    font-size: 16px;
    color: #5e5e5e;
    font-weight: 500;
  }

  .table {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .table-header,
  .table-row {
    display: grid;
    grid-template-columns: 2fr 1.2fr 1.1fr 1.5fr 1fr;
    align-items: center;
    column-gap: 28px;
  }

  .table-header {
    padding: 0 12px;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    color: #7a7a7a;
  }

  .table-row {
    padding: 16px 20px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.72);
    box-shadow: 0 14px 24px rgba(32, 32, 32, 0.06);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .table-row:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 40px rgba(32, 32, 32, 0.08);
  }

  .cell {
    font-size: 15px;
    font-weight: 500;
    color: #2c2c2c;
  }

  .cell--product {
    font-weight: 600;
    color: #141414;
  }

  .cell--status {
    justify-self: flex-start;
  }

  .status-pill {
    min-width: 120px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    padding: 8px 18px;
    font-size: 14px;
    font-weight: 600;
  }

  .status-pill.waiting {
    background: #fff4d6;
    color: #b78106;
  }

  .status-pill.inProgress {
    background: #e7f5ff;
    color: #1667c3;
  }

  .status-pill.completed {
    background: #e6f7ec;
    color: #209a4f;
  }

  .status-pill.rejected {
    background: #ffe3e3;
    color: #df3b3b;
  }

  .empty-state {
    padding: 40px 0;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #7a7a7a;
  }

  @media (max-width: 960px) {
    .panel {
      padding: 28px;
    }

    .table-header {
      display: none;
    }

    .table-row {
      grid-template-columns: 1fr;
      row-gap: 10px;
      align-items: start;
    }

    .cell {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      font-size: 14px;
    }

    .cell::before {
      content: attr(data-label);
      font-weight: 600;
      color: #686868;
    }

    .cell--status {
      justify-content: flex-start;
    }

    .status-pill {
      margin-top: 4px;
    }
  }

  @media (max-width: 640px) {
    .panel {
      border-radius: 20px;
      padding: 24px 18px;
    }
  }
`;

export default function ProductPendingBoard({ items }: PendingBoardProps) {
  return (
    <StyledPendingBoard>
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <h2>Pending Orders</h2>
            <p>ติดตามคำสั่งซื้อที่รอดำเนินการทั้งหมด</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="empty-state">ยังไม่มีรายการสินค้ารอดำเนินการ</div>
        ) : (
          <div className="table">
            <div className="table-header">
              <span>สินค้า</span>
              <span>รหัสคำสั่งซื้อ</span>
              <span>จำนวน</span>
              <span>ผู้ร้องขอ</span>
              <span>สถานะ</span>
            </div>
            {items.map((item) => (
              <div key={item.id} className="table-row">
                <span className="cell cell--product" data-label="สินค้า">
                  {item.productName}
                </span>
                <span className="cell" data-label="รหัสคำสั่งซื้อ">
                  {item.sku}
                </span>
                <span className="cell" data-label="จำนวน">
                  {item.quantity}
                </span>
                <span className="cell" data-label="ผู้ร้องขอ">
                  {item.requestedBy}
                </span>
                <span className="cell cell--status" data-label="สถานะ">
                  <span className={`status-pill ${item.status}`}>{item.statusLabel}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </StyledPendingBoard>
  );
}
