import InvoiceList from '@/components/sale/invoices/InvoiceList';
import * as process from "node:process";

export default function InvoiceListPage() {
  return <InvoiceList
      apiUrl={`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN_URL}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/sale/invoices`}
  />;
}
