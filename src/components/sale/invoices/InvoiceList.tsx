'use client';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import InvoiceCard from '@/components/sale/invoices/InvoiceCard';
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

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
  note?: string;
  items?: {
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }[];
}

interface InvoiceListProps {
  apiUrl?: string;
}

export default function InvoiceList({ apiUrl }: InvoiceListProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'canceled'>('all');

  const baseUrl = apiUrl ?? 'http://localhost:5002/sale/invoices';

  // โหลดข้อมูลบิลทั้งหมด
  const fetchInvoices = async (keyword = '', statusFilter = filter, showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const endpoint = keyword
        ? `${baseUrl}/search?keyword=${encodeURIComponent(keyword)}`
        : baseUrl;

      const res = await fetch(endpoint);
      const json = await res.json();
      let invoicesData: Invoice[] = Array.isArray(json.data) ? json.data : [];

      // ✅ filter ตามสถานะ
      if (statusFilter === 'completed') {
        invoicesData = invoicesData.filter((inv) => inv.status === 'completed');
      } else if (statusFilter === 'canceled') {
        invoicesData = invoicesData.filter((inv) => inv.status === 'canceled');
      }

      setInvoices(invoicesData);

      const total = invoicesData
        .filter((i: Invoice) => i.status === 'completed')
        .reduce((sum: number, inv: Invoice) => sum + Number(inv.total_amount || 0), 0);

      setGrandTotal(total);
    } catch (err) {
      console.error('❌ โหลดบิลล้มเหลว:', err);
    } finally {
      setLoading(false);
    }
  };

  // โหลดครั้งแรก
  useEffect(() => {
    fetchInvoices();
  }, [apiUrl]);

  // 🔍 พิมพ์แล้วค้นหาแบบเรียลไทม์ (ไม่มี debounce)
  useEffect(() => {
    // เรียก fetch แบบไม่ขึ้นโหลด (ไม่ setLoading)
    fetchInvoices(search, filter, false);
  }, [search, filter]);

  /** ✅ ยกเลิกบิล */
  const cancelInvoice = async (id: number, amount: number) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะยกเลิกบิลนี้?')) return;
    try {
      const res = await fetch(`${baseUrl}/${id}/cancel`, { method: 'PUT' });
      if (res.ok) {
        setInvoices((prev) =>
          prev.map((inv) => (inv.id === id ? { ...inv, status: 'canceled' } : inv))
        );
        setGrandTotal((prev) => prev - amount);
      }
    } catch (err) {
      console.error('❌ ยกเลิกบิลไม่สำเร็จ:', err);
    }
  };

  const handleViewInvoice = async (invoiceId: number) => {
    try {
      const res = await fetch(`${baseUrl}/${invoiceId}`);
      const json = await res.json();
      if (json.success) {
        setSelectedInvoice(json.data);
      } else {
        alert('❌ ไม่สามารถโหลดรายละเอียดบิลได้');
      }
    } catch (err) {
      console.error('❌ โหลดรายละเอียดบิลไม่สำเร็จ:', err);
    }
  };

  if (loading && invoices.length === 0)
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
        <span>🧾</span> รายการบิลทั้งหมด
      </h2>
      <p className="text-gray-500 mb-3 text-sm">
        สามารถค้นหา ดูรายละเอียด หรือยกเลิกบิลได้จากหน้านี้
      </p>

      {/* 🔍 Search + Filter */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="ค้นหาหมายเลขบิล / ลูกค้า / พนักงานขาย..."
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1 }}
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="filter-label">สถานะบิล</InputLabel>
          <Select
            labelId="filter-label"
            label="สถานะบิล"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <MenuItem value="all">ทั้งหมด</MenuItem>
            <MenuItem value="completed">สำเร็จ</MenuItem>
            <MenuItem value="canceled">ยกเลิก</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* 🔹 รายการบิล */}
      <div className="flex flex-col gap-3">
        {invoices.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">❗ ไม่พบบิลในระบบ</p>
        ) : (
          invoices.map((invoice) => (
            <InvoiceCard
              key={invoice.id}
              invoice={{
                id: invoice.id,
                orderNumber: invoice.order_number,
                date: new Date(invoice.order_date).toLocaleDateString('th-TH'),
                customer: invoice.customer_name,
                sale: invoice.sale_name,
                total: Number(invoice.total_amount),
                note: invoice.note,
                fileUrl: invoice.bill ?? '#',
                status: invoice.status === 'completed' ? 'สำเร็จ' : 'ยกเลิก',
              }}
              onCancel={cancelInvoice}
              onView={() => handleViewInvoice(invoice.id)}
            />
          ))
        )}
      </div>

      {/* 💰 รวมยอด */}
      <div style={{ marginTop: 20, fontWeight: 'bold' }}>
        💰 ยอดรวมทั้งหมด (เฉพาะบิลสำเร็จ): {grandTotal.toLocaleString()} THB
      </div>

      {/* Popup รายละเอียดบิล */}
      <Dialog open={!!selectedInvoice} onClose={() => setSelectedInvoice(null)} fullWidth maxWidth="sm">
        <DialogTitle>รายละเอียดบิล</DialogTitle>
        {selectedInvoice && (
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <p>🧾 <b>เลขที่บิล:</b> {selectedInvoice.order_number}</p>
            <p>📅 <b>วันที่:</b> {new Date(selectedInvoice.order_date).toLocaleString('th-TH')}</p>
            <p>👤 <b>ลูกค้า:</b> {selectedInvoice.customer_name}</p>
            <p>🧑‍💼 <b>พนักงานขาย:</b> {selectedInvoice.sale_name ?? '-'}</p>
            <p>💰 <b>ยอดรวม:</b> {Number(selectedInvoice.total_amount).toLocaleString()} บาท</p>
            <p>📦 <b>สถานะ:</b> {selectedInvoice.status === 'completed' ? 'สำเร็จ' : 'ยกเลิก'}</p>
            <p>📝 <b>หมายเหตุ:</b> {selectedInvoice.note || '-'}</p>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setSelectedInvoice(null)} sx={{ textTransform: 'none' }}>
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
    </ListContainer>
  );
}
