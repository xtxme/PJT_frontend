import InvoiceList from '@/components/sale/invoices/InvoiceList';

export default function InvoiceListPage() {
  return <InvoiceList apiUrl="http://localhost:5002/sale/invoices" />;
}
