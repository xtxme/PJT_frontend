'use client';

import Sidebar from "@/components/sidebar/Sidebar"
import styled from "styled-components";


const Shell = styled.div`
    display: grid;
    grid-template-columns: 264px 1fr;
    min-height: 100dvh;
    background-color: #eeeeee;
`;

const Main = styled.main`
    padding: 24px;
`;

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
        <Shell>
            <Sidebar/>
            <Main>{children}</Main>
        </Shell>
  );
}