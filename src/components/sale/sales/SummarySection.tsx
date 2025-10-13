'use client';
import styled from 'styled-components';
import { Button, Checkbox, FormControlLabel } from '@mui/material';
import { useState } from 'react';
import { exportInvoicePDF } from '@/utils/pdfFontThai';

const Wrapper = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  padding: 20px 24px;
`;

export default function SummarySection({ productsInBill, total, selectedCustomer, invoiceNo, resetForm, removeProductFromBill }: any) {
    const [autoExport, setAutoExport] = useState(true);

    const saveToDB = async () => {
        if (!selectedCustomer || productsInBill.length === 0)
            return alert('⚠️ กรุณาเลือกลูกค้าและเพิ่มสินค้าอย่างน้อย 1 รายการ');

        const res = await fetch('http://localhost:5002/sale/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customerId: selectedCustomer, invoiceNo, totalAmount: total, productsInBill }),
        });

        const data = await res.json();
        if (data.success) {
            alert('✅ บันทึกสำเร็จ');
            if (autoExport) {
                const invoice = {
                    order_number: invoiceNo,
                    order_date: new Date(),
                    customer_name: `ลูกค้า ID ${selectedCustomer}`,
                    sale_name: "ยังไม่มี อย่าลืมเติมน้า",
                    total_amount: total,
                    items: productsInBill.map((p: any) => ({
                        product_name: p.name,
                        quantity: p.qty,
                        unit_price: p.sell,
                        total_price: p.qty * p.sell,
                    })),
                };
                await exportInvoicePDF(invoice);
            }
            await resetForm();
        } else alert('❌ บันทึกไม่สำเร็จ');
    };

    return (
        <Wrapper>
            <h3 className="font-semibold mb-2">สรุปใบสั่งซื้อ</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
                <thead>
                    <tr>
                        <th>สินค้า</th>
                        <th>จำนวน</th>
                        <th>ราคา</th>
                        <th>รวม</th>
                        <th>ลบ</th>
                    </tr>
                </thead>
                <tbody>
                    {productsInBill.length === 0 ? (
                        <tr><td colSpan={5} style={{ color: '#888' }}>ยังไม่มีสินค้าในบิล</td></tr>
                    ) : (
                        productsInBill.map((p: any) => (
                            <tr key={p.id}>
                                <td>{p.name}</td>
                                <td>{p.qty}</td>
                                <td>{p.sell.toLocaleString()}</td>
                                <td>{(p.sell * p.qty).toLocaleString()}</td>
                                <td>
                                    <Button color="error" size="small" onClick={() => removeProductFromBill(p.id)}>
                                        ลบ
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <p style={{ textAlign: 'center' }}>ยอดรวมทั้งหมด: {total.toLocaleString()} บาท</p>
            <FormControlLabel
                control={<Checkbox checked={autoExport} onChange={e => setAutoExport(e.target.checked)} />}
                label="บันทึกแล้วออกบิล PDF อัตโนมัติ"
            />
            <Button fullWidth variant="contained" color="primary" onClick={saveToDB}>
                💾 บันทึกลงฐานข้อมูล
            </Button>
        </Wrapper>
    );
}
