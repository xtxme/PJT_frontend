'use client';

import Image from "next/image";
import styled from 'styled-components';
import {Button, TextField} from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import color from '@/app/styles/color';

const ImageWrapperStyled = styled.div`
    flex: 1;
    position: relative;
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
    background: ${color.colors.green};;
`;

const LogginFormStyled = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
`

const LoginForm = () => {
    return (
        <>
            <div className="w-full h-screen flex flex-row items-center justify-center">
                <ImageWrapperStyled>
                    <Image src="/login-page.webp" alt="login image" fill className="object-cover"/>
                </ImageWrapperStyled>
                <LogginFormStyled>
                    <div className="flex flex-col items-start justify-center gap-10 w-[50%]">
                        <div>
                            <h1 className="text-3xl font-bold">เข้าสู่ระบบ PJT INVENTORY</h1>
                            <h2 className="text-xl font-extralight">เลือกวิธีการเข้าสู่ระบบ</h2>
                        </div>
                        <div className="flex flex-col gap-5 w-full">
                            <TextField fullWidth id="outlined-basic" label="อีเมล" variant="outlined"/>
                            <TextField fullWidth id="outlined-basic" label="รหัสผ่าน" variant="outlined" />
                        </div>
                        <div className="flex flex-col gap-5 w-full self-center">
                            <Button
                                variant="contained"
                                size="large"
                                sx={{
                                    textTransform: 'none', // keeps original capitalization
                                    fontWeight: 'bold',    // makes text bold
                                }}
                            >
                                เข้าสู่ระบบ
                            </Button>
                        </div>
                        <div className="flex flex-row gap-3 w-full items-center">
                            <hr className="border-t border-gray-300 flex-1 w-full"/>
                            <p className="text-s font-extralight">หรือ</p>
                            <hr className="border-t border-gray-300 flex-1 w-full"/>
                        </div>
                        <div className="flex flex-col gap-5 w-full">
                            <Button
                                variant="outlined"
                                size="large"
                                startIcon={<GoogleIcon />}
                                component="a"
                                href={`${process.env.BACKEND_DOMAIN_URL}:${process.env.BACKEND_PORT}/auth/google`}
                                sx={{ textTransform: 'none', fontWeight: 'bold' }}
                            >
                                เข้าสู่ระบบด้วย Google
                            </Button>
                        </div>

                    </div>
                </LogginFormStyled>
            </div>
        </>
    );
}

export default LoginForm;