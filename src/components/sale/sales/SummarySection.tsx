'use client';
import styled from 'styled-components';
import { Button } from '@mui/material';

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
  th,
  td {
    padding: 8px;
    border-bottom: 1px solid #eee;
    text-align: center;
  }
  th {
    background: #f9fafb;
  }
`;

export default function SummarySection({
    productsInBill,
    total,
    vattotal,
    setProductsInBill,
    updateProductStock,
    exportPDF,
}: any) {
    const updateQty = (index: number, newQty: number) => {
        const updated = [...productsInBill];
        updated[index].qty = newQty;
        setProductsInBill(updated);
        updateProductStock(updated);
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
                    {productsInBill.map((p: any, i: number) => (
                        <tr key={i}>
                            <td>{p.name}</td>
                            <td>
                                <input
                                    type="number"
                                    value={p.qty}
                                    min={1}
                                    onChange={(e) => updateQty(i, Number(e.target.value))}
                                    style={{ width: 60, textAlign: 'center' }}
                                />
                            </td>
                            <td>{p.price}</td>
                            <td>{p.qty * p.price}</td>
                            <td>
                                <Button
                                    color="error"
                                    variant="contained"
                                    size="small"
                                    sx={{ textTransform: 'none', borderRadius: '8px' }}
                                    onClick={() => {
                                        const newList = productsInBill.filter((_: any, idx: number) => idx !== i);
                                        setProductsInBill(newList);
                                        updateProductStock(newList);
                                    }}
                                >
                                    ลบ
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                <p>ยอดรวม: {total.toLocaleString()} บาท</p>
                <p>VAT 7%: {(total * 0.07).toLocaleString()} บาท</p>
                <p>รวมสุทธิ: {vattotal.toLocaleString()} บาท</p>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1, borderRadius: '10px', textTransform: 'none' }}
                    onClick={exportPDF}
                >
                    ออกรายงาน PDF
                </Button>
            </div>
        </SummaryWrapper>
    );
}
