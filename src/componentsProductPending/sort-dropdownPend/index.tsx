'use client';

import { MutableRefObject, RefObject, useEffect, useRef } from 'react';
import styled from 'styled-components';

type AnchorElementRef = RefObject<HTMLElement> | MutableRefObject<HTMLElement | null>;

type SortGroup = 'salePrice' | 'remaining';
type SortDirection = 'asc' | 'desc';

export type SortOptionValue = `${SortGroup}:${SortDirection}`;

type SortDropdownProps = {
  open: boolean;
  anchorRef?: AnchorElementRef;
  onClose?: () => void;
  onSelect?: (value: SortOptionValue) => void;
  activeValue?: SortOptionValue | null;
};

const StyledSortDropdown = styled.div`
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
    min-width: 240px;
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
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .dropdown-item:hover {
    background: rgba(223, 117, 68, 0.12);
    color: #df7544;
  }

  .dropdown-item[aria-checked='true'] {
    color: #df7544;
  }

  .item-direction {
    font-size: 13px;
    font-weight: 600;
    color: inherit;
    opacity: 0.85;
  }

  @media (max-width: 640px) {
    right: unset;
    left: 0;
  }
`;

const sortGroups: Array<{
  group: SortGroup;
  label: string;
  options: Array<{
    direction: SortDirection;
    value: SortOptionValue;
    label: string;
  }>;
}> = [
  {
    group: 'salePrice',
    label: 'Sale Price',
    options: [
      { direction: 'desc', value: 'salePrice:desc', label: 'High to Low' },
      { direction: 'asc', value: 'salePrice:asc', label: 'Low to High' },
    ],
  },
  {
    group: 'remaining',
    label: 'Remaining',
    options: [
      { direction: 'desc', value: 'remaining:desc', label: 'High to Low' },
      { direction: 'asc', value: 'remaining:asc', label: 'Low to High' },
    ],
  },
];

export default function SortDropdownPend({
  open,
  anchorRef,
  onClose,
  onSelect,
  activeValue = null,
}: SortDropdownProps) {
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

  const handleSelect = (value: SortOptionValue) => {
    onSelect?.(value);
  };

  return (
    <StyledSortDropdown
      ref={dropdownRef}
      className={open ? 'is-open' : ''}
      role="menu"
      aria-hidden={!open}
    >
      <div className="dropdown-panel">
        {sortGroups.map((group) => (
          <section className="dropdown-section" key={group.group} aria-label={`Sort by ${group.label}`}>
            <header className="dropdown-label">{group.label}</header>
            <ul className="dropdown-list">
              {group.options.map((option) => (
                <li
                  key={option.value}
                  className="dropdown-item"
                  role="menuitemradio"
                  aria-checked={activeValue === option.value}
                  tabIndex={open ? 0 : -1}
                  onClick={() => handleSelect(option.value)}
                >
                  <span>{option.label}</span>
                  <span className="item-direction">{option.direction === 'asc' ? 'ASC' : 'DESC'}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </StyledSortDropdown>
  );
}
