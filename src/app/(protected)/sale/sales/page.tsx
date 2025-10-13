'use client';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
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

  useEffect(() => { loadData(); }, []);

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

  // ✅ เพิ่มสินค้าเข้าบิล
  const addProductToBill = (product: any) => {
    const qty = productQtys[product.id] || 1;
    if (qty > product.quantity) return alert(`สินค้า "${product.name}" มีเพียง ${product.quantity} ชิ้น`);

    const exist = productsInBill.find((p) => p.id === product.id);
    if (exist) {
      setProductsInBill(productsInBill.map(p => p.id === product.id ? { ...p, qty: p.qty + qty } : p));
    } else {
      setProductsInBill([...productsInBill, { ...product, qty }]);
    }

    setProducts(prev => prev.map(p => {
      if (p.id === product.id) {
        const newQty = p.quantity - qty;
        let status = p.status;
        if (newQty <= 0) status = 'out_of_stock';
        else if (newQty < 10) status = 'low_stock';
        else status = 'active';
        return { ...p, quantity: newQty, status };
      }
      return p;
    }));
    setProductQtys(prev => ({ ...prev, [product.id]: '' }));
  };

  // ✅ ลบสินค้า
  const removeProductFromBill = (id: number) =>
    setProductsInBill(productsInBill.filter((p) => p.id !== id));

  const filteredProducts = products.filter(p => (p.name || '').toLowerCase().includes(search.toLowerCase()));
  const total = productsInBill.reduce((sum, p) => sum + p.sell * p.qty, 0);
  const vattotal = total * 1.07;

  return (
    <PageContainer>
      <h2 className="text-xl font-semibold mb-4">🧾 ออกบิลขาย</h2>
      <GridLayout>
        <CustomerSection customers={customers} selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer} />
        <InvoiceDetailSection invoiceNo={invoiceNo} date={date} sale_name={"ยังไม่มี อย่าลืมเติมน้า"} />
        <ProductSection filteredProducts={filteredProducts} productQtys={productQtys} setProductQtys={setProductQtys} addProductToBill={addProductToBill} search={search} setSearch={setSearch} />
        <SummarySection productsInBill={productsInBill} total={total} vattotal={vattotal} selectedCustomer={selectedCustomer} invoiceNo={invoiceNo} resetForm={resetForm} removeProductFromBill={removeProductFromBill} />
      </GridLayout>
    </PageContainer>
  );
}
