'use client';

import styled from 'styled-components';

import PaginationControls from '@/componentsRole/paginationControls';

const ProductPendingPage = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-height: 100%;
    color: #0f0f0f;

    .data-text {
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

  .head-text {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: -6px;
  }

  .head-text h1 {
    font-size: 34px;
    font-style: normal;
    font-weight: 700;
    line-height: 1.2;
  }
`;

export default function OwnerProductPendingPage() {
    return (
        <ProductPendingPage>
            <div className="breadcrumb-row">
                <div className='breadcrumb'>
                    <img src="/images/RoleAccess-black-icon.svg" 
                      alt="RoleAccess-black-icon" 
                      width="24"
                      height="24" />
                    <img src="/images/arrow-left.svg" alt="arrow-left" />
                    <strong className='data-text'>Product Pending</strong>
                </div>
            </div>
            <div className="head-text">
                <h1>สินค้ารอดำเนินการ</h1>
            </div>
            <PaginationControls />
        </ProductPendingPage>
    );
}
