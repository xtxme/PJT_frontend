'use client';
import styled from 'styled-components';
import { Button, Checkbox, FormControlLabel, Paper } from '@mui/material';
import { useState } from 'react';
import { exportInvoicePDF } from '@/utils/pdfFontThai';

const Wrapper = styled(Paper)`
  background: white;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  padding: 24px 28px;
  transition: box-shadow 0.2s ease;
  &:hover {
    box-shadow: 0 6px 16px rgba(0,0,0,0.12);
  }

  h3 {
    margin-bottom: 2;
    text-align: center;
    font-weight: 600;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 18px;
  }

  th, td {
    padding: 10px 12px;
    text-align: center;
    border-bottom: 1px solid #e5e7eb;
  }

  thead th {
    background-color: #f3f4f6;
    color: #374151;
    font-weight: 600;
    font-size: 14px;
  }

  tbody tr:nth-child(even) {
    background-color: #fafafa;
  }

  tbody td {
    font-size: 14px;
    color: #374151;
  }

  .empty {
    text-align: center;
    color: #9ca3af;
    font-style: italic;
  }

  .bottom-section {
    text-align: center;
    margin-top: 12px;
    border-top: 1px dashed #d1d5db;
    padding-top: 12px;
  }

  .total-text {
    font-weight: 600;
    font-size: 15px;
    color: #111827;
    margin-bottom: 8px;
  }
`;

export default function SummarySection({
    saleId,
    saleName,
    productsInBill,
    total,
    selectedCustomer,
    invoiceNo,
    resetForm,
    removeProductFromBill,
}: any) {
    const [autoExport, setAutoExport] = useState(true);

    const saveToDB = async () => {
        if (!selectedCustomer || productsInBill.length === 0)
            return alert('⚠️ กรุณาเลือกลูกค้าและเพิ่มสินค้าอย่างน้อย 1 รายการ');

        const res = await fetch('http://localhost:5002/sale/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                saleId,
                saleName,
                customerId: selectedCustomer,
                invoiceNo,
                totalAmount: total,
                productsInBill,
            }),
        });

        const data = await res.json();
        if (data.success) {
            alert('✅ บันทึกสำเร็จ');
            if (autoExport) {
                const invoice = {
                    sale: saleName,
                    order_number: invoiceNo,
                    order_date: new Date(),
                    customer_name: `ลูกค้า ID ${selectedCustomer}`,                   
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
        } else {
            alert('❌ บันทึกไม่สำเร็จ');
        }
    };

    return (
        <Wrapper elevation={2}>
            <h3 className="font-semibold mb-2">สรุปคำสั่งซื้อ</h3>

            <table>
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
                        <tr>
                            <td colSpan={5} className="empty">ยังไม่มีสินค้าในบิล</td>
                        </tr>
                    ) : (
                        productsInBill.map((p: any) => (
                            <tr key={p.id}>
                                <td>{p.name}</td>
                                <td>{p.qty}</td>
                                <td>{p.sell.toLocaleString()}</td>
                                <td>{(p.sell * p.qty).toLocaleString()}</td>
                                <td>
                                    <Button
                                        color="error"
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            fontWeight: 500,
                                        }}
                                        onClick={() => {
                                            removeProductFromBill(p.id);
                                        }}
                                    >
                                        ลบ
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className="bottom-section">
                <p className="total-text">
                    💰 ยอดรวมทั้งหมด: <span style={{ color: '#15803d' }}>{total.toLocaleString()}</span> บาท
                </p>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={autoExport}
                            onChange={e => setAutoExport(e.target.checked)}
                        />
                    }
                    label="บันทึกแล้วออกบิล PDF อัตโนมัติ"
                    sx={{ marginTop: '4px', color: '#374151' }}
                />
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{
                        marginTop: 1.5,
                        borderRadius: '10px',
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '15px',
                    }}
                    onClick={saveToDB}
                >
                    💾 บันทึก
                </Button>
            </div>
        </Wrapper>
    );
}
