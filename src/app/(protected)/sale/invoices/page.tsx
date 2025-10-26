import InvoiceList from '@/components/sale/invoices/InvoiceList';
import * as process from "node:process";

export default function InvoiceListPage() {
  const backendDomain = (process.env.NEXT_PUBLIC_BACKEND_DOMAIN_URL ?? "http://localhost").replace(/\/$/, "");
  const backendPort = process.env.NEXT_PUBLIC_BACKEND_PORT ?? "5002";
  const backendBaseUrl = `${backendDomain}:${backendPort}`;

  return <InvoiceList
      apiUrl={`${backendBaseUrl}/sale/invoices`}
  />;
}
