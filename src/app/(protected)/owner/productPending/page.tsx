'use client';

import styled from 'styled-components';
import ActivityLog from '@/componentsProductPending/activityLog';

const ProductPendingPage = styled.div`
  width: 100%;
  display: flex;
  background: #f5f6fb;
  min-height: 100%;
  color: #0f0f0f;

  .page-inner {
    width: 100%;
    max-width: 1120px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin: 0;
  }

  .breadcrumb-row {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 20px;
    font-weight: 600;
    color: #1a1a1a;
  }

  .breadcrumb-icon {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .breadcrumb-label {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .breadcrumb-label strong {
    font-size: 20px;
    font-weight: 700;
    line-height: 1;
  }

  @media (max-width: 640px) {
    padding: 24px 16px 60px;

    .breadcrumb-row {
      font-size: 18px;
    }

    .breadcrumb-label strong {
      font-size: 18px;
    }
  }
`;

export default function OwnerProductPendingPage() {
  const pendingSummaryItems = [
    { productName: 'xxxx', productCode: 'xxxx', price: 'xxxx' },
    { productName: 'xxxx', productCode: 'xxxx', price: 'xxxx' },
    { productName: 'xxxx', productCode: 'xxxx', price: 'xxxx' },
    { productName: 'xxxx', productCode: 'xxxx', price: 'xxxx' },
  ];

  const activityLogItems = [
    {
      productName: 'เสื้อยืดคอกลม',
      productCode: 'PJT-0010',
      salePrice: '199.00',
      remaining: '120',
      status: 'รอตรวจสอบ',
      stockUpdate: '19/07/2024',
    },
    {
      productName: 'กางเกงยีนส์ทรงกระบอก',
      productCode: 'PJT-0009',
      salePrice: '790.00',
      remaining: '80',
      status: 'รอดำเนินการ',
      stockUpdate: '18/07/2024',
      highlighted: true,
    },
    {
      productName: 'เสื้อเชิ้ตแขนยาว',
      productCode: 'PJT-0006',
      salePrice: '490.00',
      remaining: '58',
      status: 'รอตรวจสอบ',
      stockUpdate: '15/07/2024',
    },
    {
      productName: 'กระโปรงพลีทยาว',
      productCode: 'PJT-0007',
      salePrice: '390.00',
      remaining: '96',
      status: 'รอดำเนินการ',
      stockUpdate: '14/07/2024',
    },
    {
      productName: 'เช็กเก็ตกันลม',
      productCode: 'PJT-0008',
      salePrice: '890.00',
      remaining: '42',
      status: 'รอตรวจสอบ',
      stockUpdate: '12/07/2024',
    },
    {
      productName: 'น้ำดื่ม 600 มล.',
      productCode: 'PJT-0001',
      salePrice: '12.00',
      remaining: '200',
      status: 'พร้อมขาย',
      stockUpdate: '11/07/2024',
    },
  ];

  return (
    <ProductPendingPage>
      <div className="page-inner">
        <div className="breadcrumb-row">
          <span className="breadcrumb-icon">
            <img src="/images/Pending-black-icon.svg" alt="Pending icon" width="24" height="24" />
            <img src="/images/arrow-left.svg" alt="Arrow left" />
          </span>
          <span className="breadcrumb-label">
            <strong>Product Pending</strong>
          </span>
        </div>
        <ActivityLog sectionTitle="รายการทั้งหมด" title="Activity Log" filterLabel="All" items={activityLogItems} />
      </div>
    </ProductPendingPage>
  );
}
