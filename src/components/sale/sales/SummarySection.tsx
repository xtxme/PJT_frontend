export default function SummarySection({
    productsInBill,
    total,
    vattotal,
    updateQty,
    removeProduct,
    exportPDF,
}: any) {
    return (
        <div style={{ background: 'white', borderRadius: 12, padding: 20 }}>
            <h3>สรุปบิล</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                    {productsInBill.map((p: any) => (
                        <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>
                                <input
                                    type="number"
                                    value={p.qty}
                                    min={1}
                                    onChange={(e) => updateQty(p.id, Number(e.target.value))}
                                    style={{ width: 60, textAlign: 'center' }}
                                />
                            </td>
                            <td>{p.price}</td>
                            <td>{p.qty * p.price}</td>
                            <td>
                                <button onClick={() => removeProduct(p.id)}>❌</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: 10 }}>
                <p>ยอดรวม: {total.toLocaleString()} บาท</p>
                <p>VAT 7%: {(total * 0.07).toLocaleString()} บาท</p>
                <p>รวมสุทธิ: {vattotal.toLocaleString()} บาท</p>
                <button
                    style={{
                        background: '#2563eb',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: 8,
                        marginTop: 8,
                    }}
                    onClick={exportPDF}
                >
                    ออกรายงาน PDF
                </button>
            </div>
        </div>
    );
}
