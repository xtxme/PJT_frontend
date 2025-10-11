'use client';

import { useState } from "react";
import { Button, Chip, TextField } from "@mui/material";
import Image from "next/image";
import styled from "styled-components";

const ImageFrameStyled = styled.div`
    position: relative;
    width: 200px;
    aspect-ratio: 4/3;
    background-color: #f3f4f6;
    border-radius: 8px;
    overflow: hidden;
    img {
        object-fit: contain;
    }
`;

export default function ProductCard({ item }: { item: any }) {
    const [isEditing, setIsEditing] = useState(false);
    const [newQty, setNewQty] = useState(item.newQty || "");

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        console.log("Saved new quantity:", newQty);
        // TODO: future database update logic here
        setIsEditing(false);
    };

    const handleCancel = () => {
        setNewQty(item.newQty || "");
        setIsEditing(false);
    };

    return (
        <div className="flex gap-6 items-center p-3 border-b border-gray-200">
            <ImageFrameStyled>
                <Image src={item.image} alt="product image" fill />
            </ImageFrameStyled>

            <div className="flex-1 flex flex-col">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-500">
                    {item.company} | บันทึกล่าสุด: {item.lastUpdate}
                </p>

                <div className="grid grid-cols-3 gap-6 mt-2 text-sm w-full max-w-[600px]">
                    <div className="min-w-[100px] py-2">
                        <p className="text-gray-500">ในระบบ</p>
                        <p className="font-medium">{item.systemQty}</p>
                    </div>
                    <div className="min-w-[100px] py-2">
                        <p className="text-gray-500">บันทึกล่าสุด</p>
                        <p className="font-medium">{item.latestQty}</p>
                    </div>

                    {/* แสดงช่องบันทึกใหม่เฉพาะตอนแก้ไข */}
                    {isEditing && (
                        <div className="min-w-[100px] mt-2">
                            <p className="text-gray-500">บันทึกใหม่</p>
                            <TextField
                                type="number"
                                value={newQty}
                                onChange={(e) => setNewQty(e.target.value)}
                                size="small"
                                variant="standard"
                                inputProps={{
                                    min: 0,
                                    max: 999,
                                    style: { width: "40px" },
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-end justify-between h-full">
                <Chip
                    label={item.match ? "ตรงกับระบบ" : "ไม่ตรงกับระบบ"}
                    color={item.match ? "success" : "error"}
                    size="small"
                    sx={{ borderRadius: "9999px" }}
                />

                <div className="flex gap-2 mt-3">
                    {!isEditing ? (
                        <Button
                            variant="contained"
                            sx={{ borderRadius: "8px" }}
                            onClick={handleEdit}
                        >
                            แก้ไข
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ borderRadius: "8px" }}
                                onClick={handleSave}
                            >
                                บันทึก
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{ borderRadius: "8px" }}
                                onClick={handleCancel}
                            >
                                ยกเลิก
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
