import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/warehouse/stockIn'); // จะ redirect ไป /login ทันที
}
