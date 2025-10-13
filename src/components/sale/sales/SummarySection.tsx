'use client';
import styled from 'styled-components';
import { Button, Checkbox, FormControlLabel } from '@mui/material';
import { useState } from 'react';

const SummaryWrapper = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    padding: 8px;
    border-bottom: 1px solid #eee;
    text-align: center;
  }
  th { background: #f9fafb; }
`;

export default function SummarySection({
    productsInBill,
    total,
    setProductsInBill,
    exportPDF,
    selectedCustomer,
    invoiceNo,
    resetForm,
    removeProductFromBill,
}: any) {
    const [autoExport, setAutoExport] = useState(true);

    const saveToDB = async (exportAfter = false) => {
        if (!selectedCustomer || productsInBill.length === 0) {
            alert('⚠️ กรุณาเลือกลูกค้าและเพิ่มสินค้าอย่างน้อย 1 รายการ');
            return;
        }

        try {
            console.log('🧾 กำลังบันทึก:', {
                customerId: selectedCustomer,
                invoiceNo,
                totalAmount: Number(total ?? 0),
                productsInBill,
            });

            const res = await fetch('http://localhost:5002/sale/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: selectedCustomer,
                    invoiceNo,
                    totalAmount: Number(total ?? 0),
                    productsInBill,
                }),
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.message);

            alert('✅ บันทึกสำเร็จ');
            if (exportAfter) exportPDF();
            await resetForm();
        } catch (err) {
            console.error('❌ บันทึกไม่สำเร็จ', err);
            alert('❌ เกิดข้อผิดพลาดในการบันทึก');
        }
    };

    return (
        <SummaryWrapper>
            <h3 className="font-semibold mb-2">สรุปใบสั่งซื้อ</h3>

            <Table>
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
                            <td colSpan={5} style={{ color: '#888' }}>ยังไม่มีสินค้าในบิล</td>
                        </tr>
                    ) : (
                        productsInBill.map((p: any, i: number) => (
                            <tr key={i}>
                                <td>{p.name}</td>
                                <td>{p.qty}</td>
                                <td>{p.sell.toLocaleString()}</td>
                                <td>{(p.sell * p.qty).toLocaleString()}</td>
                                <td>
                                    <Button
                                        color="error"
                                        variant="contained"
                                        size="small"
                                        sx={{ textTransform: 'none', borderRadius: '8px' }}
                                        onClick={() => removeProductFromBill(p.id)}
                                    >
                                        ลบ
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                <p>ยอดรวมทั้งหมด: {total.toLocaleString()} บาท</p>
                <div>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={autoExport}
                                onChange={(e) => setAutoExport(e.target.checked)}
                            />
                        }
                        label="บันทึกแล้วออกบิล PDF อัตโนมัติ"
                    />
                </div>


                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1, borderRadius: '10px', textTransform: 'none' }}
                    onClick={() => saveToDB(autoExport)}
                >
                    💾 บันทึกลงฐานข้อมูล
                </Button>
            </div>
        </SummaryWrapper>
    );
}
