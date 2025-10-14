// ใช้ตัวนี้ทุกไฟล์ที่เกี่ยวกับ Low-Stock
export type LowStockNoti = {
    id: string;              // ← บังคับเป็น string
    date: string;
    product: string;
    quantity: number;
    pending: number;        // ตัวเลขล้วน
    status: string;          // 'เหลือน้อย' | 'รอรับ' | ...
    sku?: string;
    price?: number;
};

export type ProductForm = {
    name: string;
    company?: string | null;
    image?: string | null;
    description?: string | null;
    category_id?: number | null;
    unit?: string | null;
    cost?: number | null;
    sell?: number | null;
};

export type Category = { id: number; name: string };

export type OpenReceiveItem = {
    batch_id: number;
    item_id: number;
    product_id: string;
    name: string;
    ordered_qty: number;
    received_qty: number;
    remain: number;
    unit_cost: string;
    supplier_id: number | null;
    expected_date: string | null;
    status: string;
};