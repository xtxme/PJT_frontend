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