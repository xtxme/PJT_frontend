'use client';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import InvoiceCard from '@/components/sale/invoices/InvoiceCard';
import { CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

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

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch(apiUrl ?? 'http://localhost:5002/sale/invoices');
        const json = await res.json();
        const invoicesData = Array.isArray(json.data) ? json.data : [];
        setInvoices(invoicesData);

        const total = invoicesData
          .filter((i: Invoice) => i.status === 'completed')
          .reduce((sum: number, inv: Invoice) => sum + Number(inv.total_amount || 0), 0);


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
  const cancelInvoice = async (id: number, amount: number) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะยกเลิกบิลนี้?')) return;
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
        setGrandTotal((prev) => prev - amount);
      }
    } catch (err) {
      console.error('ยกเลิกบิลไม่สำเร็จ', err);
    }
  };

  const handleViewInvoice = async (invoiceId: number) => {
    try {
      const res = await fetch(`http://localhost:5002/sale/invoices/${invoiceId}`);
      const json = await res.json();

      if (json.success) {
        setSelectedInvoice(json.data); // ✅ ข้อมูลมีทั้งหัวบิล + items
      } else {
        alert('❌ ไม่สามารถโหลดรายละเอียดบิลได้');
      }
    } catch (err) {
      console.error('โหลดรายละเอียดบิลไม่สำเร็จ', err);
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
        <span>🧾</span> รายการบิลทั้งหมด
      </h2>
      <p className="text-gray-500 mb-3 text-sm">
        สามารถดูรายละเอียดบิล, พิมพ์, และยกเลิกบิลได้จากหน้านี้
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

      <div style={{ marginTop: 20, fontWeight: 'bold' }}>
        💰 ยอดรวมทั้งหมด (เฉพาะบิลสำเร็จ): {grandTotal.toLocaleString()} THB
      </div>

      {/* Popup แสดงรายละเอียดบิล */}
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

            {selectedInvoice.items && selectedInvoice.items.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <b>📦 รายการสินค้า:</b>
                <table style={{ width: '100%', marginTop: '6px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                      <th>สินค้า</th>
                      <th>จำนวน</th>
                      <th>ราคา/หน่วย</th>
                      <th>รวม</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item: any) => (
                      <tr key={item.id}>
                        <td>{item.product_name}</td>
                        <td>{item.quantity}</td>
                        <td>{Number(item.unit_price).toLocaleString()}</td>
                        <td>{Number(item.total_price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
