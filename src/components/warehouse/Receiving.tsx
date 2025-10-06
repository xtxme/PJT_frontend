'use client';

import {Button} from "@mui/material";

export default function Receiving({
                                      selectedPO,
                                      receivedItems,
                                      onCancel,
                                  }: {
    selectedPO: any;
    receivedItems: any[];
    onCancel: () => void;
}) {
    if (!selectedPO) {
        return (
            <div className="col-span-2 bg-white rounded-xl shadow p-4 flex items-center justify-center text-gray-500">
                <p>กรุณาเลือกใบสั่งซื้อเพื่อเริ่มรับสินค้า</p>
            </div>
        );
    }

    return (
        <div className="col-span-2 bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-3">รับสินค้า - {selectedPO.id}</h3>

            {receivedItems.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">
                    ไม่มีสินค้าที่ต้องรับสำหรับใบสั่งซื้อนี้
                </p>
            ) : (
                <div className="divide-y divide-gray-300 p-2">
                    {receivedItems.map((item) => (
                        <div
                            key={item.id}
                            className="py-3 flex justify-between items-center"
                        >
                            <div>
                                <p className="font-medium text-gray-700">{item.name}</p>
                                <p className="text-sm text-gray-500">สั่งซื้อ {item.ordered}</p>
                            </div>
                            <input
                                type="number"
                                className="w-20 border rounded-md p-1 text-right text-sm"
                                defaultValue={item.received}
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-end gap-3 mt-5">
                <Button
                    variant="outlined"
                    onClick={onCancel}
                    color="primary"
                    sx={{
                        px: 3,
                        py: 1.2,
                        borderRadius: "8px",
                        textTransform: "none",
                    }}
                >
                    ยกเลิก
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        px: 3,
                        py: 1.2,
                        borderRadius: "8px",
                        textTransform: "none",
                    }}
                >
                    บันทึกการรับสินค้า
                </Button>
            </div>
        </div>
    );
}
