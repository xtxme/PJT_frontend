'use client';

import styled from 'styled-components';
import { DataLogStatus } from '@/componentsDataLog/types';

type StatusBadgeProps = {
  label: string;
  status: DataLogStatus;
};

const StyledStatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 108px;
  height: 34px;
  padding: 0 18px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.01em;
  white-space: nowrap;

  &.updateStock {
    background: #efe6ff;
    color: #6a3dc1;
  }

  &.stockIn {
    background: #e7f5ec;
    color: #1e8843;
  }

  &.addUser {
    background: #e6efff;
    color: #3562ff;
  }

  &.editUser {
    background: #fff4d6;
    color: #be8500;
  }

  &.orderCompleted {
    background: #ececef;
    color: #6c6c6c;
  }

  &.cancelOrder {
    background: #ffe4e1;
    color: #f03a3a;
  }
`;

export default function StatusBadge({ label, status }: StatusBadgeProps) {
  return <StyledStatusBadge className={status}>{label}</StyledStatusBadge>;
}
