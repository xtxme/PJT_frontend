'use client';
import styled from 'styled-components';
import { Button } from '@mui/material';

// 🎨 สีตามสถานะ
const statusColors: Record<string, string> = {
    active: '#2ecc71',           // เขียว
    low_stock: '#2ecc71',        // เหลือง
    restock_pending: '#2ecc71',  // ส้ม
    pricing_pending: '#2ecc71',  // น้ำเงิน
    out_of_stock: '#e74c3c',     // แดง
};

const Container = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);

  h3 {
    margin-bottom: 2;
    font-weight: 600;
  }
`;

const ProductRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 8px 12px;
  transition: background 0.2s;
  &:hover {
    background: #f9f9f9;
  }
`;

const StatusBadge = styled.span<{ color: string }>`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  color: white;
  background: ${(p) => p.color};
  font-size: 12px;
  font-weight: 600;
`;

export default function ProductSection({
    filteredProducts,
    productQtys,
    setProductQtys,
    addProductToBill,
    search,
    setSearch,
}: any) {
    return (
        <Container>
            <h3 >สินค้า</h3>

            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="🔍 ค้นหาสินค้า..."
                style={{
                    width: '100%',
                    padding: 8,
                    marginBottom: 10,
                    borderRadius: 8,
                    border: '1px solid #ccc',
                }}
            />

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    maxHeight: 420,
                    overflowY: 'auto',
                }}
            >
                {filteredProducts.map((p: any) => {
                    // ✅ ตรวจสถานะ: ถ้าคงเหลือ = 0 → ถือว่า out_of_stock
                    const status =
                        p.quantity === 0 ? 'out_of_stock' : p.status || 'active';
                    const color = statusColors[status] || '#bdc3c7';

                    return (
                        <ProductRow key={p.id}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <strong>{p.name}</strong>
                                <div style={{ marginTop: 2, fontSize: 12 }}>
                                    <StatusBadge color={color}>
                                        {status === 'active'
                                            ? 'พร้อมขาย'
                                            : status === 'low_stock'
                                                ? 'พร้อมขาย'
                                                : status === 'restock_pending'
                                                    ? 'พร้อมขาย'
                                                    : status === 'pricing_pending'
                                                        ? 'พร้อมขาย'
                                                        : 'หมด'}
                                    </StatusBadge>
                                </div>
                            </div>

                            <div style={{ width: 90, textAlign: 'center' }}>
                                {p.sell}฿
                            </div>

                            <div
                                style={{
                                    width: 100,
                                    textAlign: 'center',
                                    color,
                                    fontWeight: 600,
                                }}
                            >
                                คงเหลือ {p.quantity}
                            </div>

                            <input
                                type="number"
                                min={1}
                                max={p.quantity}
                                placeholder="0"
                                value={productQtys[p.id] ?? ''}
                                onChange={(e) =>
                                    setProductQtys((prev: any) => ({
                                        ...prev,
                                        [p.id]:
                                            e.target.value === '' ? '' : Number(e.target.value),
                                    }))
                                }
                                style={{
                                    width: 50,
                                    textAlign: 'center',
                                    borderRadius: 6,
                                    border: '1px solid #ccc',
                                }}
                                disabled={status === 'out_of_stock'}
                            />

                            <Button
                                variant="contained"
                                color={status === 'out_of_stock' ? 'error' : 'warning'}
                                sx={{ borderRadius: '8px' }}
                                onClick={() => addProductToBill(p)}
                                disabled={status === 'out_of_stock'}
                            >
                                {status === 'out_of_stock' ? 'หมด' : 'เพิ่ม'}
                            </Button>
                        </ProductRow>
                    );
                })}
            </div>
        </Container>
    );
}
