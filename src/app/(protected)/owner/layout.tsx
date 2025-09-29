'use client';

import AppHeader from "@/components/header/header";
import Sidebar from "@/components/sidebar/Sidebar";
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
  padding: 16px 22px 40px;
`;

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <Shell>
      <Sidebar />
      <div className="content">
        <AppHeader />
        <Main>{children}</Main>
      </div>
    </Shell>
  );
}
