'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { jsPDF } from 'jspdf';

// Mock data
const mockProducts = [
  { id: 'p1', name: 'Laptop', price: 25000, stock: 5, image: '/images/laptop.png' },
  { id: 'p2', name: 'Mouse', price: 500, stock: 0, image: '/images/mouse.png' },
  { id: 'p3', name: 'Keyboard', price: 1500, stock: 12, image: '/images/keyboard.png' },
  { id: 'p4', name: 'Monitor1', price: 7000, stock: 2, image: '/images/monitor.png' },
  { id: 'p5', name: 'Monitor2', price: 7000, stock: 2, image: '/images/monitor.png' },
  { id: 'p6', name: 'Monitor3', price: 7000, stock: 2, image: '/images/monitor.png' },
  { id: 'p7', name: 'Monitor4', price: 7000, stock: 2, image: '/images/monitor.png' },
  { id: 'p8', name: 'Laptop2', price: 25000, stock: 5, image: '/images/laptop.png' },
  { id: 'p9', name: 'Mouse2', price: 500, stock: 0, image: '/images/mouse.png' },
  { id: 'p10', name: 'Keyboard2', price: 1500, stock: 12, image: '/images/keyboard.png' },
  { id: 'p11', name: 'Monitor5', price: 7000, stock: 2, image: '/images/monitor.png' },


];

const mockCustomers = [
  { id: 'c1', name: 'Alice' },
  { id: 'c2', name: 'Bob' },
];

// Styled components
const PageContainer = styled.div`
  color: #030202ff;
`;

const Section = styled.div`
  margin-bottom: 24px;
  
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px; /* scroll container สูงสุด */
  overflow-y: auto;
`;

const ProductRow = styled.div`
  display: grid;
  grid-template-columns: 80px 150px 100px 40px 80px; 
  /* 60px = รูป, 60px = ชื่อ, 100px = stock, 60px = input, 60px = button */
  align-items: center;
  gap: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px;
`;

const ProductImage = styled.img`
  width: 60px;
  height: 50px;
  object-fit: contain;
`;

const QtyInput = styled.input`
  width: 50px;
  text-align: center;
  padding: 4px;
  font-size: 14px;

  /* เอา default style ของลูกศรออกก่อน */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* ใส่ลูกศร custom เอง */
  &[type=number] {
    appearance: textfield;
  }

  /* ทำ hover border สีพิเศษ */
  &:hover {
    border: 1px solid #111a44;
  }

  &:focus {
    outline: none;
    border: 1px solid #4a63e7;
    box-shadow: 0 0 4px rgba(74, 99, 231, 0.6);
  }
`;

const Stock = styled.div<{ stock: number }>`
  font-weight: bold;
  color: ${props =>
    props.stock === 0 ? 'red' :
      props.stock <= 3 ? 'orange' :
        'green'};
`;

const InvoiceContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 500px; /* ความสูง fix */
  border: 1px solid #ccc;
  // border-radius: 8px;
  overflow: hidden;
`;

const InvoiceTableWrapper = styled.div`
  flex: 1; /* ให้กินพื้นที่ด้านบน */
  overflow-y: auto; /* เลื่อนแนวตั้ง */
`;

const InvoiceFooter = styled.div`
  padding: 12px;
  text-align: center; /* จัดกลางแนวนอน */
  border-top: 1px solid #ccc;
  background: #fafafa;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; /* fix ขนาด column */
  
  th, td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
    height: 48px;       /* กำหนดความสูงของแต่ละแถวคงที่ */
    vertical-align: middle; /* ให้เนื้อหากลางแนวตั้ง */
    text-align: center;
  }

  th {
    background-color: #f9f9f9;
    font-weight: bold;
    position: sticky;
    top: 0;
    z-index: 2;
  }

  td button {
    min-width: 80px;   /* fix ขนาดปุ่ม remove */
  }
`;


const Select = styled.select`
  padding: 8px;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 8px;
  font-size: 14px;
  margin-right: 8px;
  width: 100px;
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #111a44;
  color: #ffffff;
  border: none;
  border-radius: 8px; 
  cursor: pointer;
  margin-right: 5px;
  font-size: 18px; /* ตัวหนังสือปุ่มใหญ่ขึ้น */
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  transition: background-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background-color: #333a6e;
    box-shadow: 0 6px 12px rgba(0,0,0,0.2);
  }
`;

const ColumnsContainer = styled.div`
  display: flex;
  gap: 32px; /* ช่องว่างระหว่างคอลัมน์ */
  flex-wrap: wrap; /* รองรับหน้าจอเล็ก */
  font-size: 16px;
`;

const Column = styled.div`
  flex: 1; /* ให้คอลัมน์แต่ละอันเท่ากัน */
  min-width: 300px; /* ขนาดต่ำสุดสำหรับ responsive */
  background-color: #ffffffff;
  border-radius: 8px;
  padding: 20px;
  // box-shadow:  1px 3px 6px rgba(101, 101, 101, 0.8);
  // margin-bottom: 16px;
`;

const Frame = styled.div`
  min-width: 300px; /* ขนาดต่ำสุดสำหรับ responsive */
  background-color: #ffffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow:  1px 3px 6px rgba(101, 101, 101, 0.8);
  margin-bottom: 16px;
`;

export default function SalesPage() {
  const employeeName = "John Doe";

  const [customers, setCustomers] = useState(mockCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [newCustomer, setNewCustomer] = useState('');
  const [productsInBill, setProductsInBill] = useState<{ id: string; name: string; price: number; qty: number }[]>([]);
  const [productQtys, setProductQtys] = useState<Record<string, number | "">>({});
  const [search, setSearch] = useState('');

  const filteredProducts = mockProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const addProductToBill = (product: typeof mockProducts[0]) => {
    const qty = productQtys[product.id] || 1;
    if (product.stock === 0) return;
    const exists = productsInBill.find(p => p.id === product.id);
    if (exists) {
      setProductsInBill(productsInBill.map(p =>
        p.id === product.id ? { ...p, qty: Math.min(p.qty + qty, product.stock) } : p
      ));
    } else {
      setProductsInBill([...productsInBill, { id: product.id, name: product.name, price: product.price, qty }]);
    }
    setProductQtys(prev => ({ ...prev, [product.id]: 1 }));
  };

  const total = productsInBill.reduce((sum, p) => sum + p.price * p.qty, 0);
  const vattotal = total * 1.07;
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Sales Invoice', 20, 20);
    doc.setFontSize(12);
    doc.text(`Employee: ${employeeName}`, 20, 30);
    doc.text(`Customer: ${customers.find(c => c.id === selectedCustomer)?.name || '-'}`, 20, 40);

    let y = 50;
    productsInBill.forEach(p => {
      doc.text(`${p.name} x ${p.qty} = ${p.price * p.qty} THB`, 20, y);
      y += 10;
    });

    doc.text(`Total: ${total} THB`, 20, y + 10);
    doc.save('invoice.pdf');
  };

  return (
    <PageContainer>
      <Section>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}> ออกบิล</div>
      </Section>
      <ColumnsContainer>
        <Column>
          <Section>
            <Label>Customer</Label>
            <Select value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)}>
              <option value="">Select customer</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
            <Input
              placeholder="New customer"
              value={newCustomer}
              onChange={e => setNewCustomer(e.target.value)}
            />
            <Button
              style={{
                backgroundColor: "#1c4bb9ff",
                fontSize: "14px",
                padding: "6px  18px",
              }}
              onClick={() => {
                if (!newCustomer) return;
                const newC = { id: `c${Date.now()}`, name: newCustomer };
                setCustomers([...customers, newC]);
                setSelectedCustomer(newC.id);
                setNewCustomer('');
              }}>Add Customer</Button>
          </Section>

        </Column>
        <Column>
          <p>Inv : 2025</p>
          <p>Date : Today</p>
        </Column>
      </ColumnsContainer>

      <ColumnsContainer>
        {/* คอลัมน์ซ้าย */}
        <Column>

          <Section>
            <Label>Search Product</Label>
            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
            <ProductList>
              {filteredProducts.map(p => (
                <ProductRow key={p.id}>
                  <ProductImage src={p.image} alt={p.name} />
                  <div>{p.name}</div>
                  <Stock stock={p.stock}>{p.stock === 0 ? 'Out of stock' : `${p.stock} left`}</Stock>
                  <QtyInput
                    type="number"
                    min={1}
                    max={p.stock}
                    placeholder="0"
                    value={productQtys[p.id] ?? ""}
                    onChange={e => {
                      const val = e.target.value;
                      setProductQtys(prev => ({
                        ...prev, [p.id]: val === "" ? "" : Number(val) // ถ้าลบหมด = ช่องว่าง
                      }));
                    }}
                  />
                  <Button
                    style={{
                      backgroundColor: "#1c4bb9ff",
                      fontSize: "14px",
                      padding: "6px 5px",
                    }}
                    onClick={() => addProductToBill(p)}>Add</Button>
                </ProductRow>
              ))}
            </ProductList>
          </Section>
        </Column>

        {/* คอลัมน์ขวา */}
        <Column>
          <Section>
            <InvoiceContainer>
              <InvoiceTableWrapper>
                <Table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsInBill.map((p, i) => (
                      <tr key={i}>
                        <td>{p.name}</td>
                        <td>{p.qty}</td>
                        <td>{p.price}</td>
                        <td>{p.qty * p.price}</td>
                        <td>
                          <Button
                            style={{
                              backgroundColor: "#b91c1c", // สีแดง
                              fontSize: "14px",
                              padding: "6px 12px",
                            }}
                            onClick={() =>
                              setProductsInBill(productsInBill.filter((_, index) => index !== i))
                            }
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </InvoiceTableWrapper>

              <InvoiceFooter>
                <h3>Total: {total} THB</h3>
                <h3>vat: 7 %</h3>
                <h3>sum: {vattotal} THB</h3>
                <Button
                  style={{
                    backgroundColor: "#1c4bb9ff",
                    fontSize: "14px",
                    padding: "6px 15px",
                  }}
                  onClick={exportPDF}>Export Invoice</Button>
              </InvoiceFooter>
            </InvoiceContainer>
          </Section>
        </Column>
      </ColumnsContainer>
    </PageContainer >
  );
}