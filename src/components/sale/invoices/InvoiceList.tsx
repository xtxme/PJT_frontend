'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import InvoiceCard from '@/components/sale/invoices/InvoiceCard';
import { CircularProgress } from '@mui/material';

const ListContainer = styled.div`
  padding: 20px;
  color: #000;
`;

export interface Invoice {
  id: number;
  order_number: string;
  customer_name: string;
  sale_name?: string;
  order_date: string;
  total_amount: number;
  bill?: string;
  status: string;
}

interface InvoiceListProps {
  apiUrl?: string; // default = http://localhost:5002/sale/invoices
}

export default function InvoiceList({ apiUrl }: InvoiceListProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [grandTotal, setGrandTotal] = useState<number>(0);

  /** ✅ โหลดข้อมูลบิลจาก backend */
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch(apiUrl ?? 'http://localhost:5002/sale/invoices');
        const json = await res.json();

        // ✅ ตรวจสอบว่าข้อมูลอยู่ใน json.data
        const invoicesData = Array.isArray(json.data) ? json.data : [];

        setInvoices(invoicesData);

        // ✅ คำนวณยอดรวม
        const total = invoicesData.reduce(
          (sum: number, inv: any) => sum + Number(inv.total_amount || 0),
          0
        );
        setGrandTotal(total);
      } catch (err) {
        console.error('โหลดบิลไม่สำเร็จ', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [apiUrl]);

  /** ✅ ยกเลิกบิล */
  const cancelInvoice = async (id: number) => {
    try {
      const res = await fetch(`${apiUrl ?? 'http://localhost:5002/sale/invoices'}/${id}/cancel`, {
        method: 'PUT',
      });
      if (res.ok) {
        setInvoices((prev) =>
          prev.map((inv) =>
            inv.id === id ? { ...inv, status: 'canceled' } : inv
          )
        );
      }
    } catch (err) {
      console.error('ยกเลิกบิลไม่สำเร็จ', err);
    }
  };

  if (loading)
    return (
      <ListContainer>
        <div className="flex justify-center items-center h-[50vh]">
          <CircularProgress />
        </div>
      </ListContainer>
    );

  return (
    <ListContainer>
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
        <span>🧾</span> บิลทั้งหมด
      </h2>
      <p className="text-gray-500 mb-3 text-sm">
        รายการบิลทั้งหมด พร้อมสถานะและยอดรวมสุทธิ
      </p>

      <div className="flex flex-col gap-3">
        {invoices.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">ไม่มีบิลในระบบ</p>
        ) : (
          invoices.map((invoice) => (
            <InvoiceCard
              key={invoice.id}
              invoice={{
                id: invoice.id,
                date: new Date(invoice.order_date).toLocaleDateString('th-TH'),
                customer: invoice.customer_name,
                total: Number(invoice.total_amount),
                fileUrl: invoice.bill ?? '#',
                status: invoice.status === 'completed' ? 'สำเร็จ' : 'ยกเลิก',
              }}
              onCancel={cancelInvoice}
            />
          ))
        )}
      </div>

      <div style={{ marginTop: 20, fontWeight: 'bold' }}>
        💰 ยอดรวมบิลทั้งหมด: {grandTotal.toLocaleString()} THB
      </div>
    </ListContainer>
  );
}
