'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useUserStore from '@/store/userStore';

function BridgeContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const { setID, setRole, setUsername, setName } = useUserStore();

  useEffect(() => {
    const id = sp.get('id');
    const role = sp.get('role');
    const username = sp.get('username');
    const name = sp.get('name');
    const redirect = sp.get('redirect') || '/';

    setID(id ?? null);
    setRole(role ?? null);
    setUsername(username ?? name ?? null);
    setName(name ?? username ?? null);

    const t = setTimeout(() => router.replace(redirect), 150);
    return () => clearTimeout(t);
  }, [sp, router, setID, setRole, setUsername, setName]);

  return <div>กำลังเข้าระบบ...</div>;
}

export default function Bridge() {
  return (
    <Suspense fallback={<div>กำลังโหลด...</div>}>
      <BridgeContent />
    </Suspense>
  );
}

export const dynamic = 'force-dynamic';
