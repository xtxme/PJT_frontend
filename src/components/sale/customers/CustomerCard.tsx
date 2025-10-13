'use client';
import styled from 'styled-components';
import { Card, CardContent, Typography, Divider, Box, Button } from '@mui/material';
import { useState } from 'react';

export interface Customer {
  id: number;
  name: string;
  address: string;
  totalPaid: number;
  email?: string | null;
  tel?: string | null;
}

interface Props {
  customer: Customer;
  onEdit?: (customer: Customer) => void;
}

const StyledCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease-in-out;
  margin-bottom: 10px;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
`;

const InfoRow = styled.div`
  font-size: 14px;
  color: #555;
`;

export default function CustomerCard({ customer, onEdit }: Props) {
  const [showAddress, setShowAddress] = useState(false);

  return (
    <StyledCard>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {customer.name}
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
        <InfoRow>✉️ {customer.email || '-'}</InfoRow>
        <InfoRow>📞 {customer.tel || '-'}</InfoRow>
        {showAddress && <InfoRow>📍 {customer.address || '-'}</InfoRow>}

        <Box display="flex" justifyContent="space-between" mt={2}>
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
          {onEdit && (
            <Button
              variant="outlined"
              size="small"
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                borderColor: '#ffffffff',
                color: '#2563eb',
              }}
              onClick={() => onEdit(customer)}
            >
              ✏️ แก้ไข
            </Button>
          )}
        </Box>
      </CardContent>
    </StyledCard>
  );
}
