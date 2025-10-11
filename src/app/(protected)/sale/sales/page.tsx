'use client';
import { useState } from 'react';
import styled from 'styled-components';
import { jsPDF } from 'jspdf';
import CustomerSection from '@/components/sale/sales/CustomerSection';
import ProductSection from '@/components/sale/sales/ProductSection';
import SummarySection from '@/components/sale/sales/SummarySection';
import InvoiceDetailSection from '@/components/sale/sales/InvoiceDetailSection';

// 🧍 Mock ข้อมูลลูกค้า
const mockCustomers = [
  { id: 'C001', name: 'Alice', address: '123 ถนนนิมมานเหมินท์ ต.สุเทพ อ.เมือง จ.เชียงใหม่' },
  { id: 'C002', name: 'Bob', address: '45 หมู่ 2 ต.แม่เหียะ อ.เมือง จ.เชียงใหม่' },
  { id: 'C003', name: 'Charlie', address: '99 ถนนท่าแพ ต.ช้างคลาน อ.เมือง จ.เชียงใหม่' },
  { id: 'C004', name: 'David', address: '88 หมู่บ้านปาล์มวิว ต.สันทราย อ.สันทราย จ.เชียงใหม่' },
  { id: 'C005', name: 'Ella', address: '12 ถนนวัวลาย ต.หายยา อ.เมือง จ.เชียงใหม่' },
];

// 💼 Mock ข้อมูลสินค้า
const mockProducts = [
  { id: 'p1', name: 'Laptop', price: 25000, stock: 500 },
  { id: 'p2', name: 'Mouse', price: 500, stock: 3 },
  { id: 'p3', name: 'Keyboard', price: 1500, stock: 10 },
  { id: 'p4', name: 'Monitor', price: 7000, stock: 4 },
];

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
  const employeeName = 'John Doe';
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [invoiceNo, setInvoiceNo] = useState(`INV-${Date.now().toString().slice(-6)}`);
  const [date, setDate] = useState(new Date().toLocaleDateString('th-TH'));
  const [products, setProducts] = useState(mockProducts);
  const [productsInBill, setProductsInBill] = useState<any[]>([]);
  const [productQtys, setProductQtys] = useState<Record<string, number | ''>>({});
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ เพิ่มสินค้าในบิล
  const addProductToBill = (product: any) => {
    const qty = productQtys[product.id] || 1;

    if (product.stock <= 0) {
      alert(`❗ สินค้า "${product.name}" หมดแล้ว`);
      return;
    }

    if (qty > product.stock) {
      alert(`❗ มีสินค้า "${product.name}" ในสต็อกเพียง ${product.stock} ชิ้น`);
      setProductQtys((prev) => ({ ...prev, [product.id]: product.stock }));
      return;
    }

    const exists = productsInBill.find((p) => p.id === product.id);

    if (exists) {
      const newQty = exists.qty + qty;
      const totalAvailable = product.stock + exists.qty;

      if (newQty > totalAvailable) {
        alert(`❗ ไม่สามารถเพิ่ม "${product.name}" ได้เกินจำนวนในสต็อก (${totalAvailable} ชิ้น)`);
        return;
      }

      setProductsInBill(
        productsInBill.map((p) =>
          p.id === product.id ? { ...p, qty: newQty } : p
        )
      );
    } else {
      setProductsInBill([...productsInBill, { ...product, qty }]);
    }

    // ลด stock ตามจริง
    setProducts(
      products.map((p) =>
        p.id === product.id ? { ...p, stock: p.stock - qty } : p
      )
    );

    // reset input
    setProductQtys((prev) => ({ ...prev, [product.id]: '' }));
  };

  // ✅ sync stock เมื่อเปลี่ยนใน Summary
  const updateProductStock = (updatedBill: any[]) => {
    const used: Record<string, number> = {};
    updatedBill.forEach((p) => (used[p.id] = p.qty));

    const newProducts = mockProducts.map((p) => {
      const usedQty = used[p.id] || 0;
      const originalStock = mockProducts.find((mp) => mp.id === p.id)?.stock || 0;
      const newStock = Math.max(originalStock - usedQty, 0);
      return { ...p, stock: newStock };
    });

    setProducts(newProducts);
  };

  const total = productsInBill.reduce((sum, p) => sum + p.price * p.qty, 0);
  const vattotal = total * 1.07;

  // ✅ Export PDF (ปิดปุ่มถ้าไม่มีข้อมูล)
  const exportPDF = () => {
    const customer = mockCustomers.find((c) => c.id === selectedCustomer);
    if (!customer || productsInBill.length === 0) {
      alert('⚠️ กรุณาเลือก “ลูกค้า” และ “เพิ่มสินค้า” ก่อนออกบิล');
      return;
    }

    const doc = new jsPDF();
    doc.text(`Invoice: ${invoiceNo}`, 20, 20);
    doc.text(`Date: ${date}`, 20, 28);
    doc.text(`Employee: ${employeeName}`, 20, 36);
    doc.text(`Customer: ${customer.name}`, 20, 44);
    doc.text(`Address: ${customer.address}`, 20, 52);

    let y = 64;
    productsInBill.forEach((p) => {
      doc.text(`${p.name} x${p.qty} = ${p.price * p.qty}฿`, 20, y);
      y += 10;
    });
    doc.text(`Total: ${vattotal.toFixed(2)}฿`, 20, y + 10);
    doc.save(`${invoiceNo}.pdf`);

    // ✅ รีเซ็ตข้อมูลหลังจากออกบิลเสร็จ
    setProducts(mockProducts);
    setProductsInBill([]);
    setProductQtys({});
    setSelectedCustomer('');
    setSearch('');
    setInvoiceNo(`INV-${Date.now().toString().slice(-6)}`);
    setDate(new Date().toLocaleDateString('th-TH'));
    alert('✅ ออกบิลสำเร็จ และรีเซ็ตข้อมูลเรียบร้อยแล้ว!');
  };

  const selectedCustomerData = mockCustomers.find(
    (c) => c.id === selectedCustomer
  );

  // ตรวจสอบว่าปุ่มควร disable ไหม
  const isExportDisabled = !selectedCustomer || productsInBill.length === 0;

  return (
    <PageContainer>
      <h2 className="text-xl font-semibold mb-4">🧾 ออกบิลขาย</h2>

      <GridLayout>
        {/* 🧍 ซ้ายบน: Customer dropdown */}
        <CustomerSection
          customers={mockCustomers}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
        />

        {/* 🧾 ขวาบน: Invoice detail */}
        <InvoiceDetailSection invoiceNo={invoiceNo} date={date} />

        {/* 💼 ซ้ายล่าง: สินค้า */}
        <ProductSection
          filteredProducts={filteredProducts}
          productQtys={productQtys}
          setProductQtys={setProductQtys}
          addProductToBill={addProductToBill}
          search={search}
          setSearch={setSearch}
        />

        {/* 📄 ขวาล่าง: สรุปใบสั่งซื้อ */}
        <SummarySection
          productsInBill={productsInBill}
          total={total}
          vattotal={vattotal}
          setProductsInBill={setProductsInBill}
          updateProductStock={updateProductStock}
          exportPDF={exportPDF}
          isExportDisabled={isExportDisabled} // 🔹 ส่งสถานะไปให้ปุ่ม disable
        />
      </GridLayout>
    </PageContainer>
  );
}
