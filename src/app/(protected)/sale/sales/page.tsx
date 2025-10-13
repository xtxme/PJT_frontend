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
  const [invoiceNo, setInvoiceNo] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('th-TH'));
  const [productsInBill, setProductsInBill] = useState<any[]>([]);
  const [productQtys, setProductQtys] = useState<Record<string, number | ''>>({});
  const [search, setSearch] = useState('');

  // โหลดข้อมูลจาก backend
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [custRes, prodRes, invRes] = await Promise.all([
      fetch('http://localhost:5002/sale/sales/customers').then(r => r.json()),
      fetch('http://localhost:5002/sale/sales/products').then(r => r.json()),
      fetch('http://localhost:5002/sale/sales/new-invoice').then(r => r.json()),
    ]);
    setCustomers(custRes.data || []);
    setProducts(prodRes.data || []);
    if (invRes.success) setInvoiceNo(invRes.invoiceNo);
  }

  const resetForm = async () => {
    await loadData();
    setSelectedCustomer('');
    setProductsInBill([]);
    setProductQtys({});
    setSearch('');
    setDate(new Date().toLocaleDateString('th-TH'));
  };

  // ✅ เพิ่มสินค้าเข้าตะกร้า
  const addProductToBill = (product: any) => {
    const qty = productQtys[product.id] || 1;
    if (qty > product.quantity) return alert(`สินค้า "${product.name}" มีเพียง ${product.quantity} ชิ้น`);

    // อัปเดตตะกร้า
    const existing = productsInBill.find((p) => p.id === product.id);
    if (existing) {
      setProductsInBill(productsInBill.map((p) =>
        p.id === product.id ? { ...p, qty: p.qty + qty } : p
      ));
    } else {
      setProductsInBill([...productsInBill, { ...product, qty }]);
    }

    // ✅ อัปเดต stock และสถานะสินค้า
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === product.id) {
          const newQty = p.quantity - qty;
          let newStatus = p.status;
          if (newQty <= 0) newStatus = 'out_of_stock';
          else if (newQty < 10) newStatus = 'low_stock';
          else newStatus = 'active';
          return { ...p, quantity: newQty, status: newStatus };
        }
        return p;
      })
    );

    setProductQtys((prev) => ({ ...prev, [product.id]: '' }));
  };

  // ✅ ลบสินค้าออกจากตะกร้า
  const removeProductFromBill = (productId: number) => {
    const productToRemove = productsInBill.find((p) => p.id === productId);
    if (!productToRemove) return;

    // คืนจำนวนกลับเข้า stock
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productToRemove.id) {
          const newQty = p.quantity + productToRemove.qty;
          let newStatus = p.status;
          if (newQty === 0) newStatus = 'out_of_stock';
          else if (newQty < 10) newStatus = 'low_stock';
          else newStatus = 'active';
          return { ...p, quantity: newQty, status: newStatus };
        }
        return p;
      })
    );

    // เอาออกจากตะกร้า
    setProductsInBill(productsInBill.filter((p) => p.id !== productId));
  };

  const filteredProducts = products.filter((p) =>
    (p.name || '').toLowerCase().includes(search.toLowerCase())
  );

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
          resetForm={resetForm}
          removeProductFromBill={(id: number) =>
            setProductsInBill(productsInBill.filter((p) => p.id !== id))
          }
        />
      </GridLayout>
    </PageContainer>
  );
}
