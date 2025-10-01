'use client';

import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import styled from 'styled-components';

const StyledAddUserButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 54px;
  min-width: 132px;
  padding: 0 26px;
  border-radius: 27px;
  border: 1px solid #d1d1d1;
  background: #ffffff;
  color: #0f0f0f;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;
  flex: 0 0 auto;
  transition: transform 0.12s ease, box-shadow 0.12s ease, background-color 0.12s ease;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 18px rgba(15, 15, 15, 0.08);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 6px 12px rgba(15, 15, 15, 0.06);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
  }

  .label {
    position: relative;
    top: 1px;
  }

  svg {
    width: 18px;
    height: 18px;
    stroke: currentColor;
    stroke-width: 1.8px;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

type AddUserButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
  icon?: ReactNode;
};

const DefaultIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const AddUserButton = forwardRef<HTMLButtonElement, AddUserButtonProps>(
  ({ label = 'Add User', icon, children, type = 'button', ...rest }, ref) => (
    <StyledAddUserButton ref={ref} type={type} {...rest}>
      {children ?? (
        <>
          <span className="label">{label}</span>
          {icon ?? DefaultIcon}
        </>
      )}
    </StyledAddUserButton>
  ),
);

AddUserButton.displayName = 'AddUserButton';

export default AddUserButton;
export { StyledAddUserButton };
