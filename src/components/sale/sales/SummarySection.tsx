'use client';
import styled from 'styled-components';
import { Button } from '@mui/material';

const Wrapper = styled.div`
  background: white; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  padding: 20px; display: flex; flex-direction: column;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td { padding: 8px; text-align: center; border-bottom: 1px solid #eee; }
  th { background: #f9fafb; }
`;

export default function SummarySection({
    productsInBill, total, vattotal, setProductsInBill, exportPDF, selectedCustomer, invoiceNo,
}: any) {
    const saveToDB = async (exportAfter = false) => {
        if (!selectedCustomer || productsInBill.length === 0) return alert('⚠️ กรุณาเลือกลูกค้าและสินค้า');

        try {
            const res = await fetch('http://localhost:5002/sale/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: selectedCustomer,
                    invoiceNo,
                    totalAmount: total,
                    vatAmount: total * 0.07,
                    grandTotal: vattotal,
                    productsInBill,
                }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            alert('✅ บันทึกสำเร็จ');
            if (exportAfter) exportPDF();
        } catch (err) {
            console.error(err);
            alert('❌ บันทึกไม่สำเร็จ');
        }
    };

    return (
        <Wrapper>
            <h3 className="font-semibold mb-2">สรุปใบสั่งซื้อ</h3>
            <Table>
                <thead>
                    <tr><th>สินค้า</th><th>จำนวน</th><th>ราคา</th><th>รวม</th></tr>
                </thead>
                <tbody>
                    {productsInBill.map((p: any, i: number) => (
                        <tr key={i}>
                            <td>{p.name}</td>
                            <td>{p.qty}</td>
                            <td>{p.sell}</td>
                            <td>{(p.qty * p.sell).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                <p>ยอดรวม: {total.toFixed(2)} บาท</p>
                <p>VAT 7%: {(total * 0.07).toFixed(2)} บาท</p>
                <p>รวมสุทธิ: {vattotal.toFixed(2)} บาท</p>
                <Button variant="contained" color="success" sx={{ mt: 1, mr: 1 }} onClick={() => saveToDB(false)}>
                    💾 บันทึกลงฐานข้อมูล
                </Button>
                <Button variant="contained" color="primary" sx={{ mt: 1 }} onClick={() => saveToDB(true)}>
                    📄 บันทึกและออก PDF
                </Button>
            </div>
        </Wrapper>
    );
}
