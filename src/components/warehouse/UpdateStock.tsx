'use client';

import { useState } from "react";
import {Box, Button, Chip, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import ProductCard from "@/components/warehouse/ProductCard";
import SearchIcon from '@mui/icons-material/Search';

const mockData = [
    {
        id: 1,
        image: "/login-page.webp",
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
        image: "/login-page.webp",
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
    const [filter, setFilter] = useState("");

    const filtered = data.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="mb-5">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
                <span>📦</span> การนับสต็อก
            </h2>
            <p className="text-gray-500 mb-3 text-sm pl-7">
                ตรวจสอบและนับสินค้าคงคลัง เปรียบเทียบกับระบบ
            </p>
            <div className="flex flex-col border-for-card">
                {/* Search */}
                <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                    mb={2}
                    px="12px"
                    py={2}
                    sx={{
                        backgroundColor: 'background.paper',
                        borderRadius: '16px',
                        flexWrap: { xs: 'wrap', md: 'nowrap' },
                    }}
                >
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="ค้นหาสินค้า..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: 'grey.50',
                                '&:hover': {
                                    backgroundColor: 'grey.100',
                                },
                                '&.Mui-focused': {
                                    backgroundColor: 'white',
                                },
                            },
                        }}
                    />

                    <FormControl
                        variant="outlined"
                        sx={{
                            minWidth: 160,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: 'grey.50',
                            }
                        }}
                    >
                        <InputLabel>สถานะ</InputLabel>
                        <Select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            label="สถานะ"
                        >
                            <MenuItem value="">
                                <em>ทั้งหมด</em>
                            </MenuItem>
                            <MenuItem value="match">ตรงกับระบบ</MenuItem>
                            <MenuItem value="notMatch">ไม่ตรงกับระบบ</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        startIcon={<SearchIcon />}
                        sx={{
                            textWrap: 'nowrap',
                            px: 4,
                            py: 1.5,
                            borderRadius: '12px',
                            boxShadow: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            minWidth: { xs: '100%', md: 'auto' },
                            '&:hover': {
                                boxShadow: 4,
                                transform: 'translateY(-1px)',
                            },
                            transition: 'all 0.2s ease',
                        }}
                    >
                        ค้นหา
                    </Button>
                </Box>

                {/* Stock list */}
                <div className="flex flex-col divide-y divide-gray-300">
                    {filtered.map((item) => (
                        <div key={item.id}>
                            <ProductCard item={item} />
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
