'use client';

import React, { useState } from "react";
import Image from "next/image";
import styled from 'styled-components';
import { Button, TextField } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';

const ImageWrapperStyled = styled.div`
    flex: 11;
    position: relative;
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
`;

const LogginFormStyled = styled.div`
    flex: 9;
    display: flex;
    justify-content: center;
`;

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        console.log("👉 เริ่ม login ด้วย email/password", { email, password });

        // ✅ Validation
        if (!email.trim() || !password.trim()) {
            console.warn("❌ Email หรือ Password ว่าง");
            alert("กรุณากรอก Email และ Password ให้ครบ");
            return;
        }

        // Basic email regex check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.warn("❌ Email ไม่ถูกต้อง:", email);
            alert("กรุณากรอก Email ให้ถูกต้อง");
            return;
        }

        try {
            const url = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN_URL}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/auth/login`;
            console.log("📡 กำลัง fetch:", url);

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            console.log("📥 Response status:", res.status);
            const data = await res.json();
            console.log("📥 Response body:", data);

            if (res.ok) {
                console.log("✅ Login success → redirect:", data.redirect);
                window.location.href = data.redirect;
            } else {
                console.warn("❌ Login failed:", data.message);
                alert(data.message || "Login failed");
            }
        } catch (err) {
            console.error("🚨 Login error:", err);
            alert("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
        }
    };


    const handleGoogleLogin = () => {
        const googleUrl = `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN_URL}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/auth/google`;
        console.log("👉 กำลัง redirect ไป Google:", googleUrl);
        window.location.href = googleUrl;
    };

    return (
        <div className="w-full h-screen flex flex-row items-center justify-center">
            <ImageWrapperStyled>
                <Image
                    src="/images/login-page.webp"
                    alt="login image"
                    fill
                    className="object-cover"
                />
            </ImageWrapperStyled>

            <LogginFormStyled>
                <div className="flex flex-col items-start justify-center gap-10 w-[60%]">
                    <div>
                        <h1 className="text-3xl font-bold">เข้าสู่ระบบ PJT INVENTORY</h1>
                        <h2 className="text-xl font-extralight">เลือกวิธีการเข้าสู่ระบบ</h2>
                    </div>

                    {/* Email + Password */}
                    <div className="flex flex-col gap-5 w-full">
                        <TextField
                            fullWidth
                            label="อีเมล"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="รหัสผ่าน"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* ปุ่มเข้าสู่ระบบ */}
                    <div className="flex flex-col gap-5 w-full self-center">
                        <Button
                            variant="contained"
                            size="large"
                            sx={{ textTransform: 'none', fontWeight: 'bold' }}
                            onClick={handleLogin}
                        >
                            เข้าสู่ระบบ
                        </Button>
                    </div>

                    {/* OR Divider */}
                    <div className="flex flex-row gap-3 w-full items-center">
                        <hr className="border-t border-gray-300 flex-1 w-full" />
                        <p className="text-s font-extralight">หรือ</p>
                        <hr className="border-t border-gray-300 flex-1 w-full" />
                    </div>

                    {/* Google Login */}
                    <div className="flex flex-col gap-5 w-full">
                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<GoogleIcon />}
                            component="a"
                            href={`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN_URL}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/auth/google`}
                            sx={{ textTransform: 'none', fontWeight: 'bold' }}
                        >
                            เข้าสู่ระบบด้วย Google
                        </Button>
                    </div>
                </div>
            </LogginFormStyled>
        </div>
    );
};

export default LoginForm;
