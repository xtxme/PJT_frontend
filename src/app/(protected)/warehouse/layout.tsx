'use client';

import AppHeader from "@/components/header/header";
import Sidebar_warehouse from "@/components/sidebar/Sidebar_warehouse";
import useUserStore from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styled from "styled-components";

const Shell = styled.div`
  display: grid;
  grid-template-columns: 264px 1fr;
  min-height: 100dvh;
  background-color: #f4f4f8;

  .content {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
    background-color: #f4f4f8;
  }
`;

const Main = styled.main`
  flex: 1;
  padding: 20px 20px;
`;

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { role } = useUserStore();

  useEffect(() => {
    if (role === null) {
      router.push("/login");
    } else if (role !== "warehouse") {
      router.back();
    }
  }, [role, router]);

  if (role !== "warehouse") {
    return null;
  }  
  return (
    <Shell>
      <Sidebar_warehouse />
      <div className="content">
        <AppHeader />
        <Main>{children}</Main>
      </div>
    </Shell>
  );
}
