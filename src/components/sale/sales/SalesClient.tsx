'use client';

import styled from 'styled-components';
import CustomerSection from '@/components/sale/sales/CustomerSection';
import ProductSection from '@/components/sale/sales/ProductSection';
import SummarySection from '@/components/sale/sales/SummarySection';
import InvoiceDetailSection from '@/components/sale/sales/InvoiceDetailSection';

const PageContainer = styled.div`
  padding: 20px;
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 24px;
`;

export default function SalesClient() {
    return (
        <PageContainer>
            <h2 className="text-xl font-semibold mb-4">🧾 ออกบิลขาย</h2>
            <GridLayout>
                <CustomerSection />
                <InvoiceDetailSection />
                <ProductSection />
                <SummarySection />
            </GridLayout>
        </PageContainer>
    );
}
