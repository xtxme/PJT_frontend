'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import PaginationControls from '@/componentsRole/paginationControls';
import EditPopup from '@/componentsProductPending/editPopup';
import FilterButton from '@/componentsRole/filter';
import FilterDropdownPend from '../filter-dropDownPend';
import SortDropdownPend, { SortOptionValue } from '../sort-dropdownPend';

type ActivityLogItem = {
  productName: string;
  productCode: string;
  salePrice: string;
  remaining: string;
  status: string;
  stockUpdate: string;
  highlighted?: boolean;
  costPerUnit?: string;
  currentPrice?: string;
  currentMargin?: string;
  minimumApproved?: string;
  forecastMargin?: string;
  raw?: {
    productId: string | null;
    productStatus: string | null;
    lastStockStatus: string | null;
    lastStockUpdate: string | null;
    supplierName: string | null;
    categoryName: string | null;
    sellPriceValue: number;
    quantityValue: number;
  };
};

type ActivityLogProps = {
  sectionTitle: string;
  title: string;
  filterLabel?: string;
};

type OwnerProductApiItem = {
  productId?: unknown;
  productCode?: unknown;
  productName?: unknown;
  sellPrice?: unknown;
  cost?: unknown;
  quantity?: unknown;
  productStatus?: unknown;
  categoryName?: unknown;
  lastStockStatus?: unknown;
  lastStockUpdate?: unknown;
  supplierName?: unknown;
};

type ActivityLogApiResponse = {
  data?: OwnerProductApiItem[];
};

type SortConfig = {
  key: 'salePrice' | 'remaining' | null;
  order: 'asc' | 'desc';
};

const backendDomain = (process.env.NEXT_PUBLIC_BACKEND_DOMAIN_URL ?? 'http://localhost').replace(
  /\/$/,
  '',
);
const backendPort = process.env.NEXT_PUBLIC_BACKEND_PORT ?? '5002';
const backendBaseUrl = `${backendDomain}:${backendPort}`;

const rowsPerPage = 6;

const priceFormatter = new Intl.NumberFormat('th-TH', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const quantityFormatter = new Intl.NumberFormat('th-TH');
const dateFormatter = new Intl.DateTimeFormat('th-TH', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const STOCK_STATUS_LABELS = {
  completed: 'รับครบแล้ว',
  some_received: 'รับบางส่วน',
  pending: 'รอดำเนินการ',
  canceled: 'ยกเลิก',
} as const;

const PRODUCT_STATUS_LABELS = {
  active: 'พร้อมขาย',
  low_stock: 'สต็อกต่ำ',
  restock_pending: 'รอรับสินค้า',
  pricing_pending: 'รออนุมัติราคา',
} as const;

const FILTER_LABELS: Record<string, string> = {
  ...PRODUCT_STATUS_LABELS,
};

const StyledActivityLog = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;

  .section-title {
    font-size: 26px;
    font-weight: 700;
    color: #0f0f0f;
    margin: 0;
  }

  .panel {
    background: linear-gradient(180deg, #ffffff 0%, #f8f8fb 100%);
    border-radius: 28px;
    padding: 28px 32px;
    box-shadow: 0 24px 48px rgba(15, 15, 15, 0.08);
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .panel-title {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .panel-title h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #111111;
  }

  .panel-title span {
    font-size: 14px;
    color: #7a7a7a;
    font-weight: 500;
  }

  .filter-control {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  .panel-actions {
    display: inline-flex;
    align-items: center;
    gap: 12px;
  }

  .panel-actions .filter-control {
    display: inline-flex;
  }

  .table {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .table-head {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    padding: 0 16px;
    font-size: 14px;
    font-weight: 700;
    color: #81818f;
  }

  .table-head span {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    line-height: 1.2;
    white-space: nowrap;
  }

  .table-row {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    align-items: center;
    padding: 18px 20px;
    border-radius: 20px;
    background: #f6f6f9;
    color: #2f2f3a;
    font-size: 15px;
    font-weight: 600;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .table-row span {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .table-row:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 36px rgba(15, 15, 15, 0.08);
  }

  .table-row--message {
    grid-template-columns: 1fr;
    color: #6b6b76;
    font-weight: 600;
  }

  .table-row--message span {
    width: 100%;
  }

  .table-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #ebebf2;
    justify-self: center;
  }

  .table-action img {
    width: 14px;
    height: 14px;
  }

  @media (max-width: 960px) {
    .panel {
      padding: 24px;
    }

    .table-head {
      display: none;
    }

    .table-row {
      grid-template-columns: 1fr;
      row-gap: 10px;
      align-items: flex-start;
      padding: 16px 18px;
    }

    .table-row span {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-size: 14px;
      text-align: right;
    }

    .table-row span::before {
      content: attr(data-label);
      font-weight: 600;
      color: #6a6a76;
    }

    .table-action {
      align-self: flex-end;
    }
  }

  @media (max-width: 640px) {
    .section-title {
      font-size: 22px;
    }

    .panel {
      border-radius: 24px;
      padding: 20px;
    }

    .panel-header {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }

    .panel-actions {
      width: 100%;
      flex-direction: column;
      align-items: stretch;
    }

    .panel-actions .filter-control {
      width: 100%;
    }
  }
`;

const SortIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 4v12" />
    <path d="M5.5 7.5L8 4L10.5 7.5" />
    <path d="M16 20V8" />
    <path d="M13.5 16.5L16 20l2.5-3.5" />
  </svg>
);

function parseNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function formatPrice(value: unknown): string {
  const parsed = parseNumber(value);
  return priceFormatter.format(parsed ?? 0);
}

function formatQuantity(value: unknown): string {
  const parsed = parseNumber(value);
  return quantityFormatter.format(parsed ?? 0);
}

function formatDate(value: unknown): string {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return '—';
    }
    return dateFormatter.format(value);
  }

  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return '—';
    }
    return dateFormatter.format(parsed);
  }

  return '—';
}

function toStatusLabel(
  stockStatusRaw: unknown,
  productStatusRaw: unknown,
): string {
  if (typeof stockStatusRaw === 'string' && stockStatusRaw.trim().length > 0) {
    const trimmed = stockStatusRaw.trim() as keyof typeof STOCK_STATUS_LABELS;
    if (trimmed in STOCK_STATUS_LABELS) {
      return STOCK_STATUS_LABELS[trimmed];
    }
  }

  if (typeof productStatusRaw === 'string' && productStatusRaw.trim().length > 0) {
    const trimmed = productStatusRaw.trim() as keyof typeof PRODUCT_STATUS_LABELS;
    if (trimmed in PRODUCT_STATUS_LABELS) {
      return PRODUCT_STATUS_LABELS[trimmed];
    }
  }

  return '—';
}

function sanitizeActivityLogItems(raw: unknown): ActivityLogItem[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map<ActivityLogItem | null>((entry) => {
      if (!entry || typeof entry !== 'object') {
        return null;
      }

      const record = entry as Record<string, unknown>;

      const productId =
        typeof record.productId === 'string' && record.productId.trim().length > 0
          ? record.productId.trim()
          : null;
      const productCode =
        typeof record.productCode === 'string' && record.productCode.trim().length > 0
          ? record.productCode.trim()
          : productId;

      const name =
        typeof record.productName === 'string' && record.productName.trim().length > 0
          ? record.productName.trim()
          : productCode ?? 'ไม่ระบุสินค้า';

      const sellPriceNumber = parseNumber(record.sellPrice) ?? 0;
      const sellPrice = priceFormatter.format(sellPriceNumber);
      const quantityNumber = parseNumber(record.quantity) ?? 0;
      const quantity = quantityFormatter.format(quantityNumber);
      const stockUpdate = formatDate(record.lastStockUpdate);
      const statusLabel = toStatusLabel(record.lastStockStatus, record.productStatus);

      const costNumber = parseNumber(record.cost) ?? 0;
      const margin = sellPriceNumber - costNumber;
      const costLabel = priceFormatter.format(costNumber);
      const marginLabel = priceFormatter.format(margin);

      const productStatus =
        typeof record.productStatus === 'string' ? record.productStatus.trim() : null;
      const lastStockStatus =
        typeof record.lastStockStatus === 'string' ? record.lastStockStatus.trim() : null;
      const supplierName =
        typeof record.supplierName === 'string' && record.supplierName.trim().length > 0
          ? record.supplierName.trim()
          : null;
      const categoryName =
        typeof record.categoryName === 'string' && record.categoryName.trim().length > 0
          ? record.categoryName.trim()
          : null;

      const highlighted =
        productStatus === 'low_stock' ||
        productStatus === 'restock_pending' ||
        lastStockStatus === 'pending' ||
        lastStockStatus === 'some_received';

      return {
        productName: name,
        productCode: productCode ?? '—',
        salePrice: sellPrice,
        currentPrice: sellPrice,
        remaining: quantity,
        status: statusLabel,
        stockUpdate,
        highlighted,
        costPerUnit: costLabel,
        currentMargin: marginLabel,
        raw: {
          productId,
          productStatus,
          lastStockStatus,
          lastStockUpdate: typeof record.lastStockUpdate === 'string' ? record.lastStockUpdate : null,
          supplierName,
          categoryName,
          sellPriceValue: sellPriceNumber,
          quantityValue: quantityNumber,
        },
      };
    })
    .filter((item): item is ActivityLogItem => item !== null);
}

export default function ActivityLog({
  sectionTitle,
  title,
  filterLabel = 'Filter',
}: ActivityLogProps) {
  const [items, setItems] = useState<ActivityLogItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<ActivityLogItem | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, order: 'desc' });

  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const sortButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchOwnerProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${backendBaseUrl}/inventory/owner-products`, {
          signal: controller.signal,
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload: ActivityLogApiResponse = await response.json();
        if (!isMounted) {
          return;
        }

        const sanitized = sanitizeActivityLogItems(payload.data ?? []);
        setItems(sanitized);
        setCurrentPage(1);
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
          return;
        }

        if (isMounted) {
          setError('ไม่สามารถโหลดข้อมูลได้');
          setItems([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchOwnerProducts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const processedItems = useMemo(() => {
    const filteredByStatus = statusFilter
      ? items.filter((item) => item.raw?.productStatus === statusFilter)
      : items;

    if (!sortConfig.key) {
      return filteredByStatus;
    }

    const sorted = [...filteredByStatus];
    sorted.sort((a, b) => {
      const direction = sortConfig.order === 'asc' ? 1 : -1;

      if (sortConfig.key === 'salePrice') {
        const aValue = a.raw?.sellPriceValue ?? 0;
        const bValue = b.raw?.sellPriceValue ?? 0;
        return (aValue - bValue) * direction;
      }

      const aQty = a.raw?.quantityValue ?? 0;
      const bQty = b.raw?.quantityValue ?? 0;
      return (aQty - bQty) * direction;
    });

    return sorted;
  }, [items, sortConfig, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(processedItems.length / rowsPerPage));

  useEffect(() => {
    setCurrentPage((prev) => {
      if (prev > totalPages) {
        return totalPages;
      }
      if (prev < 1) {
        return 1;
      }
      return prev;
    });
  }, [totalPages]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return processedItems.slice(start, start + rowsPerPage);
  }, [processedItems, currentPage]);

  const handleEditClick = (item: ActivityLogItem) => {
    setSelectedItem(item);
  };

  const handleClosePopup = () => {
    setSelectedItem(null);
  };

  const handleSavePrice = (price: string) => {
    if (!selectedItem) {
      return;
    }

    const productId = selectedItem.raw?.productId ?? selectedItem.productCode;
    if (!productId) {
      console.warn('Missing product identifier for price update', selectedItem);
      return;
    }

    const payload = {
      price,
    };

    void (async () => {
      try {
        const response = await fetch(
          `${backendBaseUrl}/inventory/owner-products/${productId}/price`,
          {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          },
        );

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const body: { data?: OwnerProductApiItem } = await response.json();
        const [updatedItem] = sanitizeActivityLogItems(body.data ? [body.data] : []);

        if (!updatedItem) {
          throw new Error('Invalid response payload');
        }

        setItems((prevItems) => {
          let matched = false;
          const nextItems = prevItems.map((item) => {
            const currentId = item.raw?.productId ?? item.productCode;
            const updatedId = updatedItem.raw?.productId ?? updatedItem.productCode;
            if (currentId && updatedId && currentId === updatedId) {
              matched = true;
              return updatedItem;
            }
            return item;
          });

          if (matched) {
            return nextItems;
          }

          return [...nextItems, updatedItem];
        });
      } catch (updateError) {
        console.error('Failed to update price', updateError);
      }
    })();
  };

  const handleFilterClick = () => {
    setIsFilterOpen((prev) => !prev);
    setIsSortOpen(false);
  };

  const handleSortClick = () => {
    setIsSortOpen((prev) => !prev);
    setIsFilterOpen(false);
  };

  const handleFilterSelect = (group: 'status' | 'role', value: string) => {
    if (group !== 'status') {
      return;
    }

    setStatusFilter((prev) => (prev === value ? null : value));
    setCurrentPage(1);
  };

  const handleSortSelect = (value: SortOptionValue) => {
    const [key, order] = value.split(':') as ['salePrice' | 'remaining', 'asc' | 'desc'];
    setSortConfig({ key, order });
    setIsSortOpen(false);
    setCurrentPage(1);
  };

  const filterButtonLabel = useMemo(() => {
    if (statusFilter) {
      return FILTER_LABELS[statusFilter] ?? 'Filter';
    }
    return filterLabel ?? 'Filter';
  }, [statusFilter, filterLabel]);

  const sortButtonLabel = useMemo(() => {
    if (!sortConfig.key) {
      return 'Sort';
    }
    const directionLabel = sortConfig.order === 'asc' ? 'น้อยไปมาก' : 'มากไปน้อย';
    return `${sortConfig.key === 'salePrice' ? 'ราคา' : 'คงเหลือ'} ${directionLabel}`;
  }, [sortConfig]);

  const renderRows = () => {
    if (isLoading) {
      return (
        <div className="table-row table-row--message">
          <span>กำลังโหลด...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="table-row table-row--message">
          <span>{error}</span>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="table-row table-row--message">
          <span>ยังไม่มีรายการสินค้า</span>
        </div>
      );
    }

    if (processedItems.length === 0) {
      return (
        <div className="table-row table-row--message">
          <span>ไม่พบสินค้าที่ตรงกับตัวกรอง</span>
        </div>
      );
    }

    if (paginatedItems.length === 0) {
      return (
        <div className="table-row table-row--message">
          <span>ไม่พบข้อมูลในหน้าปัจจุบัน</span>
        </div>
      );
    }

    return paginatedItems.map((item) => (
      <div
        key={`${item.productCode}-${item.stockUpdate}`}
        className={`table-row${item.highlighted ? ' highlighted' : ''}`}
      >
        <span data-label="ชื่อสินค้า">{item.productName}</span>
        <span data-label="รหัสสินค้า">{item.productCode}</span>
        <span data-label="ราคาขาย">{item.salePrice}</span>
        <span data-label="คงเหลือ">{item.remaining}</span>
        <span data-label="สถานะ">{item.status}</span>
        <span data-label="อัพเดทสต็อก">{item.stockUpdate}</span>
        <span
          data-label="แก้ไข"
          className="table-action"
          role="button"
          tabIndex={0}
          onClick={() => handleEditClick(item)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              handleEditClick(item);
            }
          }}
        >
          <img src="/images/edit.svg" alt="edit" />
        </span>
      </div>
    ));
  };

  return (
    <StyledActivityLog>
      <h2 className="section-title">{sectionTitle}</h2>
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <h3>{title}</h3>
          </div>
          <div className="panel-actions">
            {/* <div className="filter-control">
              <FilterButton
                aria-label="กรองข้อมูลสินค้า"
                label={filterButtonLabel}
                ref={filterButtonRef}
                onClick={handleFilterClick}
              />
              <FilterDropdownPend
                open={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onSelect={handleFilterSelect}
                anchorRef={filterButtonRef}
              />
            </div> */}
            <div className="filter-control">
              <FilterButton
                aria-label="เรียงลำดับประวัติกิจกรรม"
                label={sortButtonLabel}
                icon={SortIcon}
                ref={sortButtonRef}
                onClick={handleSortClick}
              />
              <SortDropdownPend
                open={isSortOpen}
                onClose={() => setIsSortOpen(false)}
                onSelect={handleSortSelect}
                anchorRef={sortButtonRef}
                activeValue={
                  sortConfig.key ? (`${sortConfig.key}:${sortConfig.order}` as SortOptionValue) : null
                }
              />
            </div>
          </div>
        </div>
        <div className="table">
          <div className="table-head">
            <span>ชื่อสินค้า</span>
            <span>รหัสสินค้า</span>
            <span>ราคาขาย</span>
            <span>คงเหลือ</span>
            <span>สถานะ</span>
            <span>อัพเดทสต็อก</span>
            <span>แก้ไข</span>
          </div>
          {renderRows()}
        </div>
        <PaginationControls
          currentPage={currentPage}
          totalPages={Math.max(1, totalPages)}
          onPageChange={setCurrentPage}
        />
      </div>
      {selectedItem && (
        <EditPopup item={selectedItem} onClose={handleClosePopup} onSave={handleSavePrice} />
      )}
    </StyledActivityLog>
  );
}
