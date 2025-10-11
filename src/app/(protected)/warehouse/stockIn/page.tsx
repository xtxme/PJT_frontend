'use client';

import { useState } from 'react';
import StockNoti from "@/components/warehouse/StockNoti";
import PurchaseInvoice from "@/components/warehouse/PurchaseInvoice";
import Receiving from "@/components/warehouse/Receiving";

export default function StockInPage() {
    // --- Mockup data ---
    const notifications = [
        { id: 1, date: '2025-05-15', product: 'สินค้า #000000 flpckmvw', pending: 0, status: 'เหลือน้อย' },
        { id: 2, date: '2025-05-15', product: 'สินค้า #000000 dcs;vk', pending: 15, status: 'รอรับ' },
        { id: 3, date: '2025-05-15', product: 'สินค้า #000000 sr', pending: 0, status: 'เหลือน้อย' },
        { id: 4, date: '2025-05-15', product: 'สินค้า #000000 scvwrm,kjhgcjmhbluhknlhur;', pending: 0, status: 'เหลือน้อย' },
    ];

    const purchaseOrders = [
        { id: 'P001', company: 'บริษัท ABC จำกัด', items: 2, date: '2025-06-17', status: 'รอรับ' },
        { id: 'P002', company: 'บริษัท DEF จำกัด', items: 2, date: '2025-06-17', status: 'รับบางส่วน' },
        { id: 'P003', company: 'บริษัท GHI จำกัด', items: 2, date: '2025-06-17', status: 'รอรับ' },
    ];

    // --- Simulated data for receiving items by PO ID ---
    const allReceivedItems: Record<string, any[]> = {
        P001: [
            { id: 1, name: 'เสื้อยืดสีขาว #DBNX9102032', ordered: 50, received: 0 },
            { id: 2, name: 'กางเกงผ้าใบสีดำ #XCBN1829', ordered: 25, received: 0 },
        ],
        P002: [
            { id: 3, name: 'เสื้อเชิ้ตลายสก็อต #QWE1234', ordered: 15, received: 5 },
        ],
        P003: [],
    };

    // --- State for selected PO ---
    const [selectedPO, setSelectedPO] = useState<any>(null);

    // --- Dynamic received items based on selected PO ---
    const receivedItems = selectedPO ? allReceivedItems[selectedPO.id] || [] : [];

    return (
        <div className="p-2">
            {/* --- Notifications Section --- */}
            <StockNoti notis={notifications} />

            {/* --- StockIn Section --- */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {/* --- Left: Purchase Orders --- */}
                <PurchaseInvoice
                    purchaseOrders={purchaseOrders}
                    selectedPO={selectedPO}
                    setSelectedPO={setSelectedPO}
                />

                {/* --- Right: Receiving Panel --- */}
                <Receiving
                    selectedPO={selectedPO}
                    receivedItems={receivedItems}
                    onCancel={() => setSelectedPO(null)}
                />
            </div>
        </div>
    );
}
