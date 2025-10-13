'use client';

import styled from 'styled-components';

export type PaginationControlsProps = {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
};

const StyledPagination = styled.nav`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 32px;

  .pagination {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #ffffff;
    padding: 8px 14px;
    border-radius: 999px;
    box-shadow: 0 12px 28px rgba(15, 15, 15, 0.08);
  }

  .pagination-button {
    min-width: 36px;
    height: 36px;
    border-radius: 10px;
    border: none;
    background: transparent;
    color: #2f2f2f;
    font-size: 15px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
  }

  .pagination-button:hover:not(.pagination-button--active):not(.pagination-button--disabled) {
    background: rgba(232, 232, 232, 0.9);
  }

  .pagination-button:active:not(.pagination-button--disabled) {
    transform: scale(0.96);
  }

  .pagination-button--active {
    background: #df7544;
    color: #ffffff;
    box-shadow: 0 10px 20px rgba(223, 117, 68, 0.35);
  }

  .pagination-button--arrow {
    width: 36px;
    background: #f5f5f5;
    border-radius: 12px;
    color: #2f2f2f;
  }

  .pagination-button--disabled {
    opacity: 0.4;
    cursor: default;
  }

  .pagination-separator {
    padding: 0 4px;
    color: #777777;
    font-weight: 600;
  }

  .pagination-icon {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    stroke-width: 2px;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;

function buildPages(currentPage: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  let left = Math.max(2, currentPage - 1);
  let right = Math.min(totalPages - 1, currentPage + 1);

  if (currentPage <= 3) {
    left = 2;
    right = Math.min(4, totalPages - 1);
  }

  if (currentPage >= totalPages - 2) {
    left = Math.max(totalPages - 3, 2);
    right = totalPages - 1;
  }

  const pages: (number | '...')[] = [1];

  if (left > 2) {
    pages.push('...');
  } else {
    for (let page = 2; page < left; page += 1) {
      pages.push(page);
    }
  }

  for (let page = left; page <= right; page += 1) {
    pages.push(page);
  }

  if (right < totalPages - 1) {
    pages.push('...');
  } else {
    for (let page = right + 1; page <= totalPages - 1; page += 1) {
      pages.push(page);
    }
  }

  pages.push(totalPages);

  return pages;
}

export default function PaginationControls({
  currentPage = 1,
  totalPages = 10,
  onPageChange,
}: PaginationControlsProps) {
  const pages = buildPages(currentPage, totalPages);
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePageClick = (page: number) => {
    if (page === currentPage) {
      return;
    }
    onPageChange?.(page);
  };

  const handlePrev = () => {
    if (!canGoPrev) {
      return;
    }
    onPageChange?.(currentPage - 1);
  };

  const handleNext = () => {
    if (!canGoNext) {
      return;
    }
    onPageChange?.(currentPage + 1);
  };

  return (
    <StyledPagination aria-label="pagination">
      <div className="pagination">
        <button
          type="button"
          className={`pagination-button pagination-button--arrow${canGoPrev ? '' : ' pagination-button--disabled'}`}
          onClick={handlePrev}
          disabled={!canGoPrev}
          aria-label="หน้า ก่อนหน้า"
        >
          <svg className="pagination-icon" viewBox="0 0 24 24">
            <path d="M14 6l-6 6 6 6" />
          </svg>
        </button>
        {pages.map((page, index) =>
          page === '...'
            ? (
              <span key={`ellipsis-${index}`} className="pagination-separator">
                ...
              </span>
            )
            : (
              <button
                key={page}
                type="button"
                className={`pagination-button${page === currentPage ? ' pagination-button--active' : ''}`}
                onClick={() => handlePageClick(page)}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            ),
        )}
        <button
          type="button"
          className={`pagination-button pagination-button--arrow${canGoNext ? '' : ' pagination-button--disabled'}`}
          onClick={handleNext}
          disabled={!canGoNext}
          aria-label="หน้าถัดไป"
        >
          <svg className="pagination-icon" viewBox="0 0 24 24">
            <path d="M10 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </StyledPagination>
  );
}
