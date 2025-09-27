'use client';
import styled from "styled-components";

const Aside = styled.aside`
    width: 264px;
    height: 100dvh;
    background-color: #F9F9F9;
    position: sticky;
    top: 0;
    border-right: 1px solid #E4E4E4;

    .pic-logo{
    width: 180px;
    height: 180px;
    aspect-ratio: 1/1;
    margin-left: 42px;
    }
    
    .border{
    width: 264px;
    height: 1px;
    color: #E4E4E4;
    }

    .link-wrap{
        margin-top: 16px;
        margin-left: 16px;
        margin-right: 48px;
    }

    .lable-wrap{
        
    }
`;


export default function Sidebar() {
    return (
    <Aside>
        <img className="pic-logo" 
            src="/images/logo-black.webp" 
            alt="logo-black" />
        <div className="border"></div>
        <div className="link-wrap">

        </div>
    </Aside>
    );
};