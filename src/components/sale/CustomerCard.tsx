'use client';

import styled from 'styled-components';
import { Card, CardContent, Typography, Divider, Box, Button } from '@mui/material';
import { useState } from 'react';

// 💡 type safety — รับ props จาก backend
interface Customer {
  id: number;
  name: string;
  address: string;
  totalPaid: number;
  email?: string | null;
  tel?: string | null;
}

interface Props {
  customer: Customer;
}

// 💅 styled-components
const StyledCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
`;

const CustomerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoRow = styled.div`
  font-size: 14px;
  color: #555;
`;

export default function CustomerCard({ customer }: Props) {
  const [showAddress, setShowAddress] = useState(false);

  return (
    <StyledCard>
      <CardContent>
        {/* 🧾 Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {customer.name || 'ไม่ระบุชื่อ'}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              backgroundColor: '#e5f3ff',
              color: '#2563eb',
              px: 1.5,
              py: 0.5,
              borderRadius: '8px',
              fontWeight: 500,
            }}
          >
            💰 {customer.totalPaid?.toLocaleString()} THB
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* 📍 ข้อมูลเพิ่มเติม */}
        <CustomerInfo>
          {customer.email && (
            <InfoRow>
              <strong>อีเมล:</strong> {customer.email}
            </InfoRow>
          )}
          {customer.tel && (
            <InfoRow>
              <strong>เบอร์โทร:</strong> {customer.tel}
            </InfoRow>
          )}

          {showAddress && (
            <InfoRow>
              <strong>ที่อยู่:</strong> {customer.address || 'ไม่ระบุ'}
            </InfoRow>
          )}
        </CustomerInfo>

        {/* 🔘 ปุ่ม toggle ที่อยู่ */}
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            size="small"
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#2563eb',
            }}
            onClick={() => setShowAddress((v) => !v)}
          >
            {showAddress ? 'ซ่อนที่อยู่' : 'แสดงที่อยู่'}
          </Button>
        </Box>
      </CardContent>
    </StyledCard>
  );
}
