'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button, TextField } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import Image from "next/image";
import styled from "styled-components";
import useUserStore from "@/store/userStore";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
    email: z.string().email("กรุณากรอกอีเมลให้ถูกต้อง"),
    password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type LoginResponse = {
    id?: string | number | null;
    redirect: string;
    role?: string | null;
    username?: string | null;
    name?: string | null;
    fullName?: string | null;
    full_name?: string | null;
    user?: {
        username?: string | null;
        name?: string | null;
        fullName?: string | null;
        full_name?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        first_name?: string | null;
        last_name?: string | null;
    } | null;
};

function pickNonEmpty(...values: Array<string | null | undefined>) {
    for (const value of values) {
        if (typeof value !== "string") {
            continue;
        }

        const trimmed = value.trim();
        if (trimmed.length > 0) {
            return trimmed;
        }
    }

    return null;
}

function deriveUsername(payload: LoginResponse, fallbackEmail?: string) {
    const user = payload.user ?? null;

    const directMatch = pickNonEmpty(
        payload.username,
        payload.name,
        payload.fullName,
        payload.full_name,
        user?.username,
        user?.name,
        user?.fullName,
        user?.full_name
    );
    if (directMatch) {
        return directMatch;
    }

    const composedName = pickNonEmpty(
        [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim(),
        [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim()
    );
    if (composedName) {
        return composedName;
    }

    if (typeof fallbackEmail === "string" && fallbackEmail.length > 0) {
        const localPart = fallbackEmail.split("@")[0]?.trim();
        if (localPart) {
            return localPart;
        }
        return fallbackEmail.trim().length > 0 ? fallbackEmail.trim() : null;
    }

    return null;
}

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

export default function LoginForm() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const backendDomain = (process.env.NEXT_PUBLIC_BACKEND_DOMAIN_URL ?? "http://localhost").replace(/\/$/, "");
    const backendPort = process.env.NEXT_PUBLIC_BACKEND_PORT ?? "5002";
    const backendBaseUrl = `${backendDomain}:${backendPort}`;

    // --- 🧠 Tanstack Query Mutation ---
    const loginMutation = useMutation<LoginResponse, Error, LoginFormData>({
        mutationFn: async (data: LoginFormData) => {
            const url = `${backendBaseUrl}/auth/login`;
            console.log("📡 กำลัง fetch:", url);

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "เข้าสู่ระบบล้มเหลว");
            }

            return res.json() as Promise<LoginResponse>;
        },
        onSuccess: async (data: LoginResponse, variables: LoginFormData) => {
            console.log("✅ Login success:", data);

            // ✅ ดึง setter จาก store
            const { setID, setRole, setUsername, setName } = useUserStore.getState();

            // ✅ เก็บค่าทั้งหมดใน localStorage
            setID(data.id ? String(data.id) : null);
            setRole(data.role ?? null);
            setUsername(data.username ?? deriveUsername(data, variables.email));
            setName(data.name ?? deriveUsername(data, variables.email));

            // ✅ รอ persist เขียนลง localStorage ก่อน redirect
            await new Promise((resolve) => setTimeout(resolve, 300));

            router.push(data.redirect);
        },
        onError: (err: Error) => {
            alert(err.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
        },
    });


    // --- 🧩 Form Submit Handler ---
    const onSubmit = (data: LoginFormData) => {
        loginMutation.mutate(data);
    };

    const handleGoogleLogin = () => {
        const googleUrl = `${backendBaseUrl}/auth/google`;
        window.location.href = googleUrl;
    };

    return (
        <div className="w-full h-screen flex flex-row items-center justify-center">
            <ImageWrapperStyled>
                <Image
                    src="https://res.cloudinary.com/dkft5klt4/image/upload/v1760169060/login-page_t0q4pp.webp"
                    alt="login image"
                    fill
                    className="object-cover"
                />
            </ImageWrapperStyled>

            <LogginFormStyled>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col items-start justify-center gap-10 w-[60%]"
                >
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
                            {...register("email")}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                        <TextField
                            fullWidth
                            label="รหัสผ่าน"
                            type="password"
                            variant="outlined"
                            {...register("password")}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                    </div>

                    {/* ปุ่มเข้าสู่ระบบ */}
                    <div className="flex flex-col gap-5 w-full self-center">
                        <Button
                            variant="contained"
                            size="large"
                            sx={{ textTransform: "none", fontWeight: "bold" }}
                            type="submit"
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
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
                            onClick={handleGoogleLogin}
                            sx={{ textTransform: "none", fontWeight: "bold" }}
                        >
                            เข้าสู่ระบบด้วย Google
                        </Button>
                    </div>
                </form>
            </LogginFormStyled>
        </div>
    );
}
