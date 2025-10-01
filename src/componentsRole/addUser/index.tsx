'use client';

import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import styled from 'styled-components';

const StyledAddUserButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 131px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid #e87641;
  background: #df7544;
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;
  flex: 0 0 auto;
  transition: transform 0.12s ease, box-shadow 0.12s ease, background-color 0.12s ease;
  box-shadow: 0 1px 2px rgba(223, 117, 68, 0.35);

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
    width: 78px;
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
  <img src="/images/add-wh.svg" alt="Add-wh" />
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
