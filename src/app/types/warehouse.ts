// ใช้ตัวนี้ทุกไฟล์ที่เกี่ยวกับ Low-Stock
export type LowStockNoti = {
    id: string;              // ← บังคับเป็น string
    date: string;
    product: string;
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