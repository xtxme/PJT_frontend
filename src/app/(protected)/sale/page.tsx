import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/sale/sales'); // จะ redirect ไป /login ทันที
}
