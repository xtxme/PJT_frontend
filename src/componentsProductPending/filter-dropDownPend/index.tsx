'use client';

import { MutableRefObject, RefObject, useEffect, useRef } from 'react';
import styled from 'styled-components';

type AnchorElementRef = RefObject<HTMLElement> | MutableRefObject<HTMLElement | null>;

type FilterDropdownProps = {
  open: boolean;
  onClose?: () => void;
  onSelect?: (filterGroup: 'status' | 'role', value: string) => void;
  anchorRef?: AnchorElementRef;
};

const StyledFilterDropdown = styled.div`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  z-index: 1150;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-6px);
  transition: opacity 0.18s ease, transform 0.18s ease;

  &.is-open {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }

  .dropdown-panel {
    min-width: 220px;
    border-radius: 18px;
    border: 1px solid rgba(15, 15, 15, 0.16);
    background: #ffffff;
    box-shadow: 0 18px 42px rgba(15, 15, 15, 0.18);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .dropdown-section {
    display: flex;
    flex-direction: column;
  }

  .dropdown-section + .dropdown-section {
    border-top: 1px solid rgba(15, 15, 15, 0.08);
  }

  .dropdown-label {
    background: #df7544;
    color: #ffffff;
    font-size: 15px;
    font-weight: 700;
    padding: 12px 18px;
  }

  .dropdown-list {
    list-style: none;
    margin: 0;
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .dropdown-item {
    padding: 10px 18px;
    font-size: 15px;
    font-weight: 600;
    color: #0f0f0f;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
  }

  .dropdown-item:hover {
    background: rgba(223, 117, 68, 0.12);
    color: #df7544;
  }

  @media (max-width: 640px) {
    right: unset;
    left: 0;
  }
`;

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'low_stock', label: 'Low stock' },
  { value: 'restock_pending', label: 'Restock pending' },
  { value: 'pricing_pending', label: 'Pricing pending' },
];

export default function FilterDropdownPend({ open, onClose, onSelect, anchorRef }: FilterDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const targetNode = event.target as Node;
      if (
        dropdownRef.current?.contains(targetNode) ||
        (anchorRef && anchorRef.current?.contains(targetNode))
      ) {
        return;
      }

      onClose?.();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose, anchorRef]);

  const handleSelect = (group: 'status' | 'role', value: string) => {
    onSelect?.(group, value);
    onClose?.();
  };

  return (
    <StyledFilterDropdown
      ref={dropdownRef}
      className={open ? 'is-open' : ''}
      role="menu"
      aria-hidden={!open}
    >
      <div className="dropdown-panel">
        <section className="dropdown-section" aria-label="Filter By Status">
          <header className="dropdown-label">Filter By Status</header>
          <ul className="dropdown-list">
            {statusOptions.map((option) => (
              <li
                key={option.value}
                className="dropdown-item"
                role="menuitemradio"
                aria-checked="false"
                tabIndex={open ? 0 : -1}
                onClick={() => handleSelect('status', option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </StyledFilterDropdown>
  );
}
