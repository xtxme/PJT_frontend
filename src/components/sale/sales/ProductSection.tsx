'use client';
import styled from 'styled-components';
import { Button } from '@mui/material';

const Container = styled.div`
  background: white; border-radius: 12px; padding: 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
`;

export default function ProductSection({
    filteredProducts, productQtys, setProductQtys, addProductToBill, search, setSearch,
}: any) {
    return (
        <Container>
            <h3 className="font-semibold mb-2">สินค้า</h3>
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="🔍 ค้นหาสินค้า..."
                style={{ width: '100%', padding: 8, marginBottom: 10, borderRadius: 8, border: '1px solid #ccc' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 420, overflowY: 'auto' }}>
                {filteredProducts.map((p: any) => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #eee', borderRadius: 8, padding: '8px 12px' }}>
                        <div style={{ flex: 1 }}>{p.name}</div>
                        <div style={{ width: 80, textAlign: 'center' }}>{p.sell}฿</div>
                        <div style={{ width: 100, textAlign: 'center' }}>เหลือ {p.quantity}</div>
                        <input
                            type="number"
                            min={1}
                            max={p.quantity}
                            placeholder="0"
                            value={productQtys[p.id] ?? ''}
                            onChange={(e) => setProductQtys((prev: any) => ({
                                ...prev, [p.id]: e.target.value === '' ? '' : Number(e.target.value),
                            }))}
                            style={{ width: 50, textAlign: 'center', borderRadius: 6, border: '1px solid #ccc' }}
                        />
                        <Button variant="contained" color="warning" sx={{ borderRadius: '8px' }} onClick={() => addProductToBill(p)}>
                            เพิ่ม
                        </Button>
                    </div>
                ))}
            </div>
        </Container>
    );
}
