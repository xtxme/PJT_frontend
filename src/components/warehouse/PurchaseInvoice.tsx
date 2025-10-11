'use client';

import {Button} from "@mui/material";
import color from "@/app/styles/color";

export default function PurchaseInvoice({
                                            purchaseOrders,
                                            selectedPO,
                                            setSelectedPO,
                                        }: {
    purchaseOrders: any[];
    selectedPO: any;
    setSelectedPO: (po: any) => void;
}) {
    return (
        <div className="col-span-1 bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-3">ใบสั่งซื้อที่รอรับ</h3>

            {purchaseOrders.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">
                    ไม่มีใบสั่งซื้อที่รอรับสินค้า
                </p>
            ) : (
                <div className="space-y-3">
                    {purchaseOrders.map((po) => (
                        <div
                            key={po.id}
                            onClick={() => setSelectedPO(po)}
                            className="border rounded-lg p-3 cursor-pointer transition hover:shadow-md"
                            style={{
                                borderColor: selectedPO?.id === po.id ? color.colors.orange : "#E5E7EB", // Tailwind gray-200
                            }}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{po.id}</p>
                                    <p className="text-sm text-gray-600">{po.company}</p>
                                    <p className="text-xs text-gray-400">
                                        รายการ: {po.items} | วันที่: {po.date}
                                    </p>
                                </div>
                                <span
                                    className={`px-3 py-1 text-xs rounded-full ${
                                        po.status === "รอรับ"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-blue-100 text-blue-700"
                                    }`}
                                >
                                  {po.status}
                                </span>
                            </div>

                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPO(po);
                                }}
                                color="primary"
                                sx={{
                                    mt: 1,
                                    py: 1.2,
                                    borderRadius: "8px",
                                    textTransform: "none",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                }}
                            >
                                เริ่มรับสินค้า
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
