'use client';

import styled from "styled-components";
import { Button } from "@mui/material";
import type { LowStockNoti } from "@/app/types/warehouse";

const NotisCardStyled = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background: white;

    .in-card {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        padding-left: 20px;
        width: 100%;
        margin-top: 4px;

        .product-name {
            flex: 1 1 250px;
            min-width: 200px;
            white-space: nowrap;
        }

        .in-card-detail {
            flex: 1 1 200px;
            min-width: 100px;
            white-space: nowrap;
        }

        @media screen and (max-width: 1200px) {
            .product-name {
                flex-basis: 100%;
                width: 100%;
            }
            .in-card-detail {
                flex: 1 1 45%;
            }
        }
    }
`;

export default function StockNoti({
                                      notis,
                                      onActionAction,
                                  }: {
    notis: LowStockNoti[];
    onActionAction?: (item: {
        product_id: string;
        name: string;
        pending?: number;
    }) => void;
}) {
    const handleActionClick = (noti: LowStockNoti) => {
        if (!onActionAction) return;
        onActionAction({
            product_id: String(noti.id),
            name: noti.product,
            pending: noti.pending,
        });
    };

    return (
        <div className="mb-5">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
                <span>🔔</span> การแจ้งเตือน
            </h2>
            <p className="text-gray-500 mb-3 text-sm pl-7">
                แจ้งเตือนสินค้าสำคัญที่ต้องดำเนินการ
            </p>

            {notis.length === 0 ? (
                <div className="pl-7 text-gray-400 text-sm italic">
                    — ไม่มีรายการแจ้งเตือน —
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {notis.map((noti) => (
                        <NotisCardStyled key={String(noti.id)} className="border-for-card">
                            <div className="flex flex-col pl-4 w-full">
                                <div className="text-sm text-gray-600 flex items-center gap-2">
                                    📦 <span>{noti.date}</span>
                                </div>
                                <div className="in-card">
                                    <p className="product-name font-medium text-gray-800 truncate">
                                        {noti.product}
                                    </p>
                                    <p className="in-card-detail text-sm text-gray-700">
                                        สั่งแล้วรอส่ง : {noti.pending ?? "-"}
                                    </p>
                                    <div className="in-card-detail flex items-center gap-1 text-sm">
                                        <span className="text-gray-700">สถานะ :</span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                noti.status === "เหลือน้อย"
                                                    ? "bg-red-600 text-white"
                                                    : "bg-yellow-500 text-white"
                                            }`}
                                        >
                      {noti.status}
                    </span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                    textWrap: "nowrap",
                                    padding: "12px 20px",
                                    mr: 2,
                                    borderRadius: "12px",
                                    boxShadow: 1,
                                    textTransform: "none",
                                    fontWeight: 500,
                                }}
                                onClick={() => handleActionClick(noti)}
                            >
                                ดำเนินการ
                            </Button>
                        </NotisCardStyled>
                    ))}
                </div>
            )}
        </div>
    );
}
