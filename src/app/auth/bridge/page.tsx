'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useUserStore from '@/store/userStore';

export default function Bridge() {
    const router = useRouter();
    const sp = useSearchParams();
    const { setID, setRole, setUsername, setName } = useUserStore();

    useEffect(() => {
        // 1) อ่าน payload จาก query
        const id = sp.get('id');
        const role = sp.get('role');
        const username = sp.get('username');
        const name = sp.get('name');
        const redirect = sp.get('redirect') || '/';

        // 2) เซ็ต store/localStorage
        setID(id ?? null);
        setRole(role ?? null);
        setUsername(username ?? name ?? null);
        setName(name ?? username ?? null);

        // 3) รอ persist เล็กน้อยแล้วค่อยเด้ง
        const t = setTimeout(() => router.replace(redirect), 150);
        return () => clearTimeout(t);
    }, [sp, router, setID, setRole, setUsername, setName]);

    return <div className="p-6">กำลังเข้าระบบ…</div>;
}
