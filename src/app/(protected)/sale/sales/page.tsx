'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { jsPDF } from 'jspdf';
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

export default function SalesPage() {
  // ✅ states หลัก
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [productsInBill, setProductsInBill] = useState<any[]>([]);
  const [productQtys, setProductQtys] = useState<Record<string, number | ''>>({});
  const [invoiceNo, setInvoiceNo] = useState(`INV-${Date.now().toString().slice(-6)}`);
  const [date, setDate] = useState(new Date().toLocaleDateString('th-TH'));
  const [search, setSearch] = useState('');

  // ✅ โหลดข้อมูลลูกค้า & สินค้าจาก backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resCus, resProd] = await Promise.all([
          fetch('http://localhost:5002/customers'),
          fetch('http://localhost:5002/products'),
        ]);
        const jsonCus = await resCus.json();
        const jsonProd = await resProd.json();
        setCustomers(Array.isArray(jsonCus.data) ? jsonCus.data : jsonCus);
        setProducts(Array.isArray(jsonProd.data) ? jsonProd.data : jsonProd);
      } catch (err) {
        console.error('❌ โหลดข้อมูลล้มเหลว:', err);
      }
    };
    fetchData();
  }, []);

  // ✅ filter สินค้า
  const filteredProducts = products.filter((p) =>
    (p.name || '').toLowerCase().includes(search.toLowerCase())
  );

  // ✅ เพิ่มสินค้าในบิล
  const addProductToBill = (product: any) => {
    const qty = productQtys[product.id] || 1;
    if (product.stock <= 0) {
      alert(`❗ สินค้า "${product.name}" หมดแล้ว`);
      return;
    }

    const exists = productsInBill.find((p) => p.id === product.id);
    if (exists) {
      const updated = productsInBill.map((p) =>
        p.id === product.id ? { ...p, qty: p.qty + qty } : p
      );
      setProductsInBill(updated);
    } else {
      setProductsInBill([...productsInBill, { ...product, qty }]);
    }

    setProductQtys((prev) => ({ ...prev, [product.id]: '' }));
  };

  // ✅ ลบสินค้าในบิล
  const removeProduct = (id: number) => {
    setProductsInBill(productsInBill.filter((p) => p.id !== id));
  };

  // ✅ อัปเดตจำนวนสินค้า
  const updateQty = (id: number, newQty: number) => {
    setProductsInBill(
      productsInBill.map((p) => (p.id === id ? { ...p, qty: newQty } : p))
    );
  };

  // ✅ คำนวณยอดรวม
  const total = productsInBill.reduce((sum, p) => sum + p.price * p.qty, 0);
  const vattotal = total * 1.07;

  // ✅ export PDF
  const exportPDF = () => {
    const customer = customers.find((c) => c.id === selectedCustomer);
    if (!customer || productsInBill.length === 0) {
      alert('⚠️ กรุณาเลือก “ลูกค้า” และ “เพิ่มสินค้า” ก่อนออกบิล');
      return;
    }

    const doc = new jsPDF();
    doc.text(`Invoice: ${invoiceNo}`, 20, 20);
    doc.text(`Date: ${date}`, 20, 28);
    doc.text(`Customer: ${customer.name}`, 20, 36);
    doc.text(`Address: ${customer.address}`, 20, 44);

    let y = 60;
    productsInBill.forEach((p) => {
      doc.text(`${p.name} x${p.qty} = ${p.price * p.qty}฿`, 20, y);
      y += 10;
    });
    doc.text(`Total: ${vattotal.toFixed(2)}฿`, 20, y + 10);
    doc.save(`${invoiceNo}.pdf`);

    alert('✅ ออกบิลสำเร็จ');
  };

  return (
    <PageContainer>
      <h2 className="text-xl font-semibold mb-4">🧾 ออกบิลขาย</h2>

      <GridLayout>
        {/* 🧍 ลูกค้า */}
        <CustomerSection
          customers={customers}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
        />

        {/* 📄 รายละเอียดบิล */}
        <InvoiceDetailSection invoiceNo={invoiceNo} date={date} />

        {/* 💼 สินค้า */}
        <ProductSection
          filteredProducts={filteredProducts}
          productQtys={productQtys}
          setProductQtys={setProductQtys}
          addProductToBill={addProductToBill}
          search={search}
          setSearch={setSearch}
        />

        {/* 📊 สรุป */}
        <SummarySection
          productsInBill={productsInBill}
          total={total}
          vattotal={vattotal}
          updateQty={updateQty}
          removeProduct={removeProduct}
          exportPDF={exportPDF}
        />
      </GridLayout>
    </PageContainer>
  );
}
