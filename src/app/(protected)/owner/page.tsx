import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/owner/dashboard'); // จะ redirect ไป /login ทันที
}
