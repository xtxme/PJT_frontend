'use client';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { jsPDF } from 'jspdf';
import CustomerSection from '@/components/sale/sales/CustomerSection';
import ProductSection from '@/components/sale/sales/ProductSection';
import SummarySection from '@/components/sale/sales/SummarySection';
import InvoiceDetailSection from '@/components/sale/sales/InvoiceDetailSection';

const PageContainer = styled.div`padding: 20px;`;
const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 24px;
`;

export default function SalesPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [invoiceNo, setInvoiceNo] = useState(``);
  const [date, setDate] = useState(new Date().toLocaleDateString('th-TH'));
  const [productsInBill, setProductsInBill] = useState<any[]>([]);
  const [productQtys, setProductQtys] = useState<Record<string, number | ''>>({});
  const [search, setSearch] = useState('');

  // ✅ โหลดข้อมูลจริงจาก backend
  useEffect(() => {
    fetch('http://localhost:5002/sale/sales/customers')
      .then((res) => res.json())
      .then((data) => setCustomers(data.data || []));
    fetch('http://localhost:5002/sale/sales/products')
      .then((res) => res.json())
      .then((data) => setProducts(data.data || []));
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    async function fetchInvoice() {
      try {
        const res = await fetch('http://localhost:5002/sale/sales/new-invoice');
        const data = await res.json();
        if (data.success) setInvoiceNo(data.invoiceNo);
      } catch (err) {
        console.error('❌ สร้างเลขบิลไม่สำเร็จ', err);
      }
    }

    fetchInvoice();
    setDate(new Date().toLocaleDateString('th-TH'));
  }, []);

  const addProductToBill = (product: any) => {
    const qty = productQtys[product.id] || 1;
    if (qty > product.quantity) return alert(`สินค้า "${product.name}" มีเพียง ${product.quantity} ชิ้น`);

    const existing = productsInBill.find((p) => p.id === product.id);
    if (existing)
      setProductsInBill(productsInBill.map((p) => p.id === product.id ? { ...p, qty: p.qty + qty } : p));
    else setProductsInBill([...productsInBill, { ...product, qty }]);

    setProducts(products.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity - qty } : p)));
    setProductQtys((prev) => ({ ...prev, [product.id]: '' }));
  };

  const total = productsInBill.reduce((sum, p) => sum + p.sell * p.qty, 0);
  const vattotal = total * 1.07;

  const exportPDF = () => {
    const customer = customers.find((c) => c.id === Number(selectedCustomer));
    const doc = new jsPDF();
    doc.text(`Invoice: ${invoiceNo}`, 20, 20);
    doc.text(`Date: ${date}`, 20, 28);
    doc.text(`Customer: ${customer?.name || '-'}`, 20, 36);
    doc.text(`Address: ${customer?.address || '-'}`, 20, 44);
    let y = 58;
    productsInBill.forEach((p) => {
      doc.text(`${p.name} x${p.qty} = ${(p.sell * p.qty).toFixed(2)}฿`, 20, y);
      y += 10;
    });
    doc.text(`Total: ${vattotal.toFixed(2)}฿`, 20, y + 10);
    doc.save(`${invoiceNo}.pdf`);
  };

  return (
    <PageContainer>
      <h2 className="text-xl font-semibold mb-4">🧾 ออกบิลขาย</h2>
      <GridLayout>
        <CustomerSection
          customers={customers}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
        />
        <InvoiceDetailSection invoiceNo={invoiceNo} date={date} />
        <ProductSection
          filteredProducts={filteredProducts}
          productQtys={productQtys}
          setProductQtys={setProductQtys}
          addProductToBill={addProductToBill}
          search={search}
          setSearch={setSearch}
        />
        <SummarySection
          productsInBill={productsInBill}
          total={total}
          vattotal={vattotal}
          setProductsInBill={setProductsInBill}
          exportPDF={exportPDF}
          selectedCustomer={selectedCustomer}
          invoiceNo={invoiceNo}
        />
      </GridLayout>
    </PageContainer>
  );
}
