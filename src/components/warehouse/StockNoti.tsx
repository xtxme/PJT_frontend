'use client';

import styled from "styled-components";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography } from "@mui/material";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import type { LowStockNoti } from "@/app/types/warehouse"; // ✅ ใช้ type กลาง

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
            .product-name { flex-basis: 100%; width: 100%; }
            .in-card-detail { flex: 1 1 45%; }
        }
    }
`;

export default function StockNoti({
                                      notis,
                                      onAction, // ✅ ใหม่: ใช้งานกับ RestockCart
                                  }: {
    notis: LowStockNoti[];
    onAction?: (row: LowStockNoti) => void;
}) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<LowStockNoti | null>(null);
    const [form, setForm] = useState({
        name: "",
        sku: "",
        qty: "",
        buyPrice: "",
    });

    const handleOpen = (noti: LowStockNoti) => {
        setSelected(noti);
        setForm({
            name: noti.product ?? "",
            sku: (noti.sku as string) ?? "",
            qty: String(noti.pending ?? ""),
            buyPrice: String(noti.price ?? ""),
        });
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((p) => ({ ...p, [key]: e.target.value }));

    const handleSubmit = () => {
        // ตรงนี้คือโหมดไม่มี onAction (ใช้ dialog เก่า)
        // TODO: ส่งข้อมูลไป backend ตามดีไซน์เดิมของคุณ (ถ้ายังอยากใช้ dialog)
        setOpen(false);
    };

    const handleActionClick = (noti: LowStockNoti) => {
        if (onAction) {
            // โยนให้ตะกร้า: normalize ค่าที่จำเป็น
            onAction({
                ...noti,
                id: String(noti.id),
                pending: typeof noti.pending === "string" ? Number(noti.pending) || 0 : (noti.pending ?? 0),
                price: typeof noti.price === "string" ? Number(noti.price) || 0 : noti.price,
            });
            return;
        }
        // ถ้าไม่ได้ส่ง onAction มา ให้ใช้ dialog เดิม
        handleOpen(noti);
    };

    return (
        <div className="mb-5">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
                <span>🔔</span> การแจ้งเตือน
            </h2>
            <p className="text-gray-500 mb-3 text-sm pl-7">แจ้งเตือนสินค้าสำคัญที่ต้องดำเนินการ</p>

            {notis.length === 0 ? (
                <div className="pl-7 text-gray-400 text-sm italic">— ไม่มีรายการแจ้งเตือน —</div>
            ) : (
                <div className="flex flex-col gap-3">
                    {notis.map((noti) => (
                        <NotisCardStyled key={String(noti.id)} className="border-for-card">
                            <div className="flex flex-col pl-4 w-full">
                                <div className="text-sm text-gray-600 flex items-center gap-2">
                                    📦 <span>{noti.date}</span>
                                </div>
                                <div className="in-card">
                                    <p className="product-name font-medium text-gray-800 truncate">{noti.product}</p>
                                    <p className="in-card-detail text-sm text-gray-700">
                                        สั่งแล้วรอส่ง : {noti.pending ?? "-"}
                                    </p>
                                    <div className="in-card-detail flex items-center gap-1 text-sm ">
                                        <span className="text-gray-700">สถานะ :</span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                noti.status === "เหลือน้อย" ? "bg-red-600 text-white" : "bg-yellow-500 text-white"
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

            {/* Popup Dialog (fallback mode เมื่อไม่มี onAction) */}
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: { borderRadius: 4, p: { xs: 1, sm: 2 }, overflow: "hidden" },
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, fontSize: 24, pb: 1 }}>
                    ดำเนินการสั่งซื้อ
                </DialogTitle>

                <DialogContent dividers sx={{ pt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography sx={{ mb: 1, fontWeight: 600 }}>ชื่อสินค้า</Typography>
                            <TextField
                                fullWidth
                                placeholder="กรอกชื่อสินค้า..."
                                variant="standard"
                                value={form.name}
                                onChange={handleChange("name")}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography sx={{ mb: 1, fontWeight: 600 }}>รหัสสินค้า</Typography>
                            <TextField
                                fullWidth
                                placeholder="กรอกรหัสสินค้า..."
                                variant="standard"
                                value={form.sku}
                                onChange={handleChange("sku")}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography sx={{ mb: 1, fontWeight: 600 }}>จำนวน</Typography>
                            <TextField
                                fullWidth
                                placeholder="กรอกจำนวนสินค้า..."
                                type="number"
                                variant="standard"
                                value={form.qty}
                                onChange={handleChange("qty")}
                                inputProps={{ min: 0 }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography sx={{ mb: 1, fontWeight: 600 }}>ราคาซื้อ</Typography>
                            <TextField
                                fullWidth
                                placeholder="กรอกราคาซื้อ..."
                                type="number"
                                variant="standard"
                                value={form.buyPrice}
                                onChange={handleChange("buyPrice")}
                                inputProps={{ min: 0, step: "0.01" }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2, gap: 2, justifyContent: "center" }}>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{
                            borderRadius: 3,
                            px: 4,
                            py: 1.2,
                            boxShadow: 2,
                            textTransform: "none",
                            fontWeight: 600,
                        }}
                    >
                        ดำเนินการ
                    </Button>
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        sx={{
                            borderRadius: 3,
                            px: 4,
                            py: 1.2,
                            textTransform: "none",
                            fontWeight: 600,
                        }}
                    >
                        ยกเลิก
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
