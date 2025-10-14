'use client';

import styled from "styled-components";
import { Button, IconButton, Tooltip } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
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
                                      selectedIds,              // ✅ new
                                      onToggleSelect,           // ✅ new
                                      onRefresh,
                                  }: {
    notis: LowStockNoti[];
    selectedIds?: Set<string>;
    onToggleSelect?: (item: {
        product_id: string;
        name: string;
        pending?: number;
        quantity?: number;
    }) => void;
    onRefresh?: () => void;
}) {
    const handleToggle = (noti: LowStockNoti) => {
        if (!onToggleSelect) return;
        onToggleSelect({
            product_id: String(noti.id),
            name: noti.product,
            pending: noti.pending,
            quantity: noti.quantity,
        });
    };

    return (
        <div className="mb-5">
            <div className="flex items-center mb-3">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <span>🔔</span> การแจ้งเตือน
                </h2>
                {onRefresh && (
                    <Tooltip title="รีเฟรชการแจ้งเตือน">
                        <IconButton color="primary" onClick={onRefresh} sx={{ mr: 1 }}>
                            <CachedIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </div>

            <p className="text-gray-500 mb-3 text-sm pl-7">
                แจ้งเตือนสินค้าสำคัญที่ต้องดำเนินการ
            </p>

            {notis.length === 0 ? (
                <div className="pl-7 text-gray-400 text-sm italic">— ไม่มีรายการแจ้งเตือน —</div>
            ) : (
                <div className="flex flex-col gap-3">
                    {notis.map((noti) => {
                        const id = String(noti.id);
                        const isSelected = selectedIds?.has(id);

                        return (
                            <NotisCardStyled
                                key={id}
                                className={`border-for-card ${isSelected ? "ring-2 ring-blue-500/60" : ""}`}
                            >
                                <div className="flex flex-col pl-4 w-full">
                                    <div className="text-sm text-gray-600 flex items-center gap-2">
                                        📦 <span>{noti.date}</span>
                                        {isSelected && (
                                            <span className="ml-2 rounded-full px-2 py-0.5 text-xs bg-blue-600 text-white">
                                                เลือกแล้ว
                                            </span>
                                        )}
                                    </div>
                                    <div className="in-card">
                                        <p className="product-name font-medium text-gray-800 truncate">
                                            {noti.product}
                                        </p>
                                        <p className="in-card-detail text-sm text-gray-700">
                                            คงคลัง : {noti.quantity ?? "-"}
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
                                    variant={isSelected ? "outlined" : "contained"}
                                    color={isSelected ? "inherit" : "primary"}
                                    sx={{
                                        textWrap: "nowrap",
                                        padding: "12px 20px",
                                        mr: 2,
                                        borderRadius: "12px",
                                        boxShadow: isSelected ? 0 : 1,
                                        textTransform: "none",
                                        fontWeight: 500,
                                        width: "120px",
                                    }}
                                    onClick={() => handleToggle(noti)}
                                >
                                    {isSelected ? "ยกเลิกเลือก" : "เลือก"}
                                </Button>
                            </NotisCardStyled>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

