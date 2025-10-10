'use client';

import { useState } from "react";
import styled from "styled-components";

const mockData = [
    {
        id: 1,
        name: "เสื้อยืดสีขาว #0000000000",
        company: "บริษัท ABC จำกัด",
        lastUpdate: "2027-00-40",
        systemQty: 50,
        latestQty: 48,
        newQty: 50,
        match: false,
    },
    {
        id: 2,
        name: "เสื้อยืดสีขาว #0000000000",
        company: "บริษัท ABC จำกัด",
        lastUpdate: "2027-00-40",
        systemQty: 50,
        latestQty: 50,
        newQty: 0,
        match: true,
    },
];

export default function UpdateStock() {
    const [search, setSearch] = useState("");
    const [data, setData] = useState(mockData);

    const filtered = data.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <span>📦</span> การนับสต็อก
            </h1>
            <p className="text-gray-500 mb-6">
                ตรวจสอบและนับสินค้าคงคลัง เปรียบเทียบกับระบบ
            </p>

            {/* Search */}
            <div className="flex items-center gap-2 mb-6">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="ค้นหาสินค้า..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
                <button className="bg-black text-white rounded-lg px-6 py-2">
                    ค้นหา
                </button>
            </div>

            {/* Stock list */}
            <div className="flex flex-col gap-5">
                {filtered.map((item) => (
                    <Card
                        key={item.id}
                        match={item.match}
                        className={`p-4 rounded-lg transition ${
                            item.match
                                ? "border border-dashed border-purple-400"
                                : "border border-gray-200"
                        }`}
                    >
                        <div className="flex gap-4 items-start">
                            <div className="w-28 h-20 bg-gray-100 flex items-center justify-center text-5xl text-gray-400">
                                🖼️
                            </div>

                            <div className="flex-1 flex flex-col">
                                <h2 className="font-semibold text-lg">{item.name}</h2>
                                <p className="text-gray-500">
                                    {item.company} | บันทึกล่าสุด: {item.lastUpdate}
                                </p>

                                <div className="grid grid-cols-3 gap-3 mt-2 text-sm">
                                    <div>
                                        <p className="text-gray-500">ในระบบ</p>
                                        <p className="font-medium">{item.systemQty}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">บันทึกล่าสุด</p>
                                        <p className="font-medium">{item.latestQty}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">บันทึกใหม่</p>
                                        <input
                                            type="number"
                                            defaultValue={item.newQty}
                                            className="border-b border-gray-300 focus:outline-none focus:border-gray-600 w-16 text-center"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Status + Buttons */}
                            <div className="flex flex-col items-end justify-between h-full">
                                {item.match ? (
                                    <span className="text-sm bg-green-500 text-white px-3 py-1 rounded-full">
                    ตรงกับระบบ
                  </span>
                                ) : (
                                    <span className="text-sm bg-red-500 text-white px-3 py-1 rounded-full">
                    ไม่ตรงกับระบบ
                  </span>
                                )}

                                <div className="flex gap-2 mt-3">
                                    {item.match ? (
                                        <button className="bg-black text-white rounded-lg px-4 py-1">
                                            แก้ไข
                                        </button>
                                    ) : (
                                        <>
                                            <button className="bg-white border px-4 py-1 rounded-lg">
                                                บันทึก
                                            </button>
                                            <button className="bg-black text-white px-4 py-1 rounded-lg">
                                                ยกเลิก
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

const Card = styled.div<{ match: boolean }>`
  background-color: ${(props) => (props.match ? "white" : "white")};
`;
