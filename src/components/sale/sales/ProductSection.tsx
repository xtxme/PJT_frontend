'use client';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';

const ProductContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
`;

export default function ProductSection() {
    const [products, setProducts] = useState<any[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('http://localhost:5002/sale/sales/products');
                const json = await res.json();

                // ✅ ป้องกันกรณีที่ API ส่ง object
                const data = Array.isArray(json) ? json : json.data || [];

                setProducts(data);
            } catch (err) {
                console.error('โหลดสินค้าไม่สำเร็จ:', err);
                setProducts([]); // fallback ป้องกัน error .filter()
            }
        })();
    }, []);

    const filtered = products.filter((p) =>
        (p.name || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <ProductContainer>
            <h3 className="font-semibold mb-2">สินค้า</h3>
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="🔍 ค้นหาสินค้า..."
                style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    marginBottom: '10px',
                }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filtered.map((p) => (
                    <div
                        key={p.id}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 12px',
                            border: '1px solid #eee',
                            borderRadius: '8px',
                        }}
                    >
                        <span>{p.name}</span>
                        <span>{p.price}฿</span>
                        <span>คงเหลือ: {p.stock}</span>
                        <Button variant="contained">เพิ่ม</Button>
                    </div>
                ))}
            </div>
        </ProductContainer>
    );
}
