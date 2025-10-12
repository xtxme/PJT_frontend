/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

export type EditPopupItem = {
  productName: string;
  productCode: string;
  salePrice: string;
  costPerUnit?: string;
  currentPrice?: string;
  currentMargin?: string;
  minimumApproved?: string;
  forecastMargin?: string;
};

type EditPopupProps = {
  item: EditPopupItem;
  onClose: () => void;
  onSave?: (price: string) => void;
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 15, 15, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 1090;
`;

const Modal = styled.div`
  width: min(560px, 100%);
  background: #ffffff;
  border-radius: 28px;
  box-shadow: 0 32px 72px rgba(15, 15, 15, 0.14);
  padding: 36px 40px;
  display: flex;
  flex-direction: column;
  gap: 28px;

  h2 {
    margin: 0;
    font-size: 26px;
    font-weight: 700;
    color: #111111;
  }

  .subhead {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #6b6b76;
  }

  @media (max-width: 640px) {
    padding: 28px 24px;
    border-radius: 22px;

    h2 {
      font-size: 22px;
    }

    .subhead {
      font-size: 15px;
    }
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-radius: 18px;
  border: 1px solid #e5e6f0;
  background: #ffffff;
  padding: 14px 16px;

  span:first-child {
    font-size: 13px;
    font-weight: 600;
    color: #7a7a88;
  }

  span:last-child {
    font-size: 18px;
    font-weight: 700;
    color: #101017;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  font-size: 15px;
  font-weight: 600;
  color: #12121b;
`;

const Input = styled.input`
  border-radius: 18px;
  border: 1px solid #dae0f3;
  background: #f7f8fb;
  padding: 16px 18px;
  font-size: 18px;
  font-weight: 700;
  color: #111111;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: #3e63f4;
    box-shadow: 0 0 0 3px rgba(62, 99, 244, 0.12);
  }
`;

const ForecastText = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #6c6c78;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const CancelButton = styled.button`
  border: none;
  background: transparent;
  font-size: 16px;
  font-weight: 600;
  color: #51515c;
  padding: 12px 18px;
  border-radius: 14px;
  cursor: pointer;

  &:hover {
    color: #282832;
  }
`;

const SaveButton = styled.button`
  border: none;
  background: #0f1624;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  padding: 12px 26px;
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: #080d16;
    transform: translateY(-1px);
  }
`;

function extractNumericValue(value: string) {
  const numeric = value.replace(/[^\d.,]/g, '').replace(',', '');
  return numeric || '';
}

export default function EditPopup({ item, onClose, onSave }: EditPopupProps) {
  const initialPrice = useMemo(() => extractNumericValue(item.currentPrice ?? item.salePrice), [item]);
  const [price, setPrice] = useState(initialPrice);
  const titleId = useMemo(() => `edit-popup-title-${item.productCode}`, [item.productCode]);

  useEffect(() => {
    setPrice(initialPrice);
  }, [initialPrice]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (onSave) {
      onSave(price);
    }

    onClose();
  };

  return (
    <Overlay onClick={onClose} role="presentation">
      <Modal
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div>
          <h2 id={titleId}>แก้ไขราคาขาย</h2>
          <p className="subhead">
            {item.productName} ({item.productCode})
          </p>
        </div>

        <InfoGrid>
          <InfoCard>
            <span>ต้นทุน/หน่วย</span>
            <span>{item.costPerUnit ?? '—'}</span>
          </InfoCard>
          <InfoCard>
            <span>ราคาปัจจุบัน</span>
            <span>{item.currentPrice ?? item.salePrice}</span>
          </InfoCard>
          <InfoCard>
            <span>กำไรขั้นต้นปัจจุบัน</span>
            <span>{item.currentMargin ?? '—'}</span>
          </InfoCard>
          <InfoCard>
            <span>ขั้นต่ำที่อนุญาต</span>
            <span>{item.minimumApproved ?? '—'}</span>
          </InfoCard>
        </InfoGrid>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="new-price">ราคาใหม่ (THB)</Label>
            <Input
              id="new-price"
              inputMode="decimal"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="ใส่ราคาที่ต้องการ"
            />
            <ForecastText>
              กำไรขั้นต้นหลังแก้: {item.forecastMargin ?? item.currentMargin ?? '—'}
            </ForecastText>
          </FormGroup>

          <Actions>
            <CancelButton type="button" onClick={onClose}>
              ยกเลิก
            </CancelButton>
            <SaveButton type="submit">บันทึกราคา</SaveButton>
          </Actions>
        </form>
      </Modal>
    </Overlay>
  );
}
