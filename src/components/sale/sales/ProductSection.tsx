'use client';
import styled from 'styled-components';
import { Button } from '@mui/material';

const ProductContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ProductCardStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: white;
  border-radius: 10px;
  border: 1px solid #eee;
  padding: 10px 15px;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .product-name {
    font-weight: 500;
    color: #1c4bb9;
    flex: 1.2;
  }

  .product-price {
    flex: 1;
    text-align: center;
    font-weight: 500;
    color: #111;
  }

  .product-stock {
    flex: 1.2;
    text-align: center;
  }

  .product-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    justify-content: flex-end;
  }
`;

const QtyInput = styled.input`
  width: 40px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 4px;
  height: 34px;
`;

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 420px;
  overflow-y: auto;
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

            <ProductList>
                {filteredProducts.map((p: any) => (
                    <ProductCardStyled key={p.id}>
                        <p className="product-name">{p.name}</p>
                        <p className="product-price">{p.price.toLocaleString()} ฿</p>

                        <div className="product-stock">
                            <span
                                className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                                style={{
                                    backgroundColor:
                                        p.stock === 0
                                            ? '#dc2626' // แดง
                                            : p.stock <= 3
                                                ? '#eab308' // เหลือง
                                                : '#16a34a', // เขียว
                                }}
                            >
                                คงเหลือ: {p.stock === 0 ? 'หมด' : `${p.stock} ชิ้น`}
                            </span>
                        </div>

                        <div className="product-actions">
                            <QtyInput
                                type="number"
                                min={1}
                                max={p.stock}
                                placeholder="0"
                                value={productQtys[p.id] ?? ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setProductQtys((prev: any) => ({
                                        ...prev,
                                        [p.id]: val === '' ? '' : Number(val),
                                    }));
                                }}
                            />

                            <Button
                                variant="contained"
                                sx={{
                                    textTransform: 'none',
                                    borderRadius: '10px',
                                    padding: '6px 16px',
                                    backgroundColor: '#f97316',
                                    '&:hover': { backgroundColor: '#ea580c' },
                                }}
                                disabled={p.stock === 0}
                                onClick={() => addProductToBill(p)}
                            >
                                เพิ่ม
                            </Button>
                        </div>
                    </ProductCardStyled>
                ))}
            </ProductList>
        </ProductContainer>
    );
}
