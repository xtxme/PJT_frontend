import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/login'); // จะ redirect ไป /login ทันที
}
