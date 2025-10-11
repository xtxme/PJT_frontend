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
  height: 100%; /* ให้สูงเท่ากับ SummarySection ด้านขวา */
`;

const ProductCardStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 10px;
  border: 1px solid #eee;
  padding: 10px 15px;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .in-card {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    padding-left: 8px;

    .product-name {
      font-weight: 600;
      flex: 1 1 200px;
      color: #1c4bb9;
    }

    .product-stock {
      flex: 1 1 100px;
      font-size: 14px;
      color: #444;
    }
  }
`;

const QtyInput = styled.input`
  width: 60px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 4px;
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
            <div className="in-card">
              <p className="product-name">{p.name}</p>
              <p className="product-stock">
                <span
                className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{
                  backgroundColor:
                    p.stock === 0
                      ? '#dc2626' // bg-red-600
                      : p.stock <= 3
                      ? '#eab308' // bg-yellow-500
                      : '#16a34a', // bg-green-600
                }}
              >
                คงเหลือ: {p.stock === 0 ? 'หมด' : `${p.stock} ชิ้น`} 
              </span>
              </p>
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
            </div>

            <Button
              variant="contained"
              color="primary"
              sx={{
                textTransform: 'none',
                borderRadius: '10px',
                padding: '6px 16px',
              }}
              disabled={p.stock === 0}
              onClick={() => addProductToBill(p)}
            >
              เพิ่ม
            </Button>
          </ProductCardStyled>
        ))}
      </ProductList>
    </ProductContainer>
  );
}
