import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useRef } from "react";
import { style } from '@mui/system';


export default function SignIn() {
    const router = useRouter();

    async function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const status = await signIn("credentials", {
            redirect: false,
            email: data.get('email'),
            password: data.get('password'),
            callbackUrl: "/"
        });

        if (status.ok) {
            router.push('/');
        } else {
            //TOOD: 로그인 폼에 에러 표시.
            console.log(status);
        }
    }

    return (
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            </Avatar>
            <Typography component="h1" variant="h5">
                오늘의 옷
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="이메일"
                    name="email"
                    autoComplete="email"
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="비밀번호"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                />
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label={<Typography styles={style.formControlLabel}>로그인 상태유지</Typography>}
                />
                <Button
                    size="lg"
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 1, mb: 2 }}
                >
                    로그인
                </Button>
                <Grid container>
                    <Grid item xs>
                        <Link href="#">
                            Forgot password?
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="/signup">
                            회원 가입
                        </Link>
                    </Grid>
                </Grid>
            </Box>

        </Box>
    );
}