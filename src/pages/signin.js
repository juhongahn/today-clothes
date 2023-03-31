import * as React from 'react';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from 'react';
import { style } from '@mui/system';
import {
    Grid,
    Box,
    Typography,
    Avatar,
    Button,
    TextField,
} from '@mui/material';

const validationSchema = yup.object({
    email: yup.string()
      .required('이메일을 입력해 주세요'),
    password: yup.string()
      .required('비밀번호를 입력해 주세요'),
  });

export default function SignIn() {
    const router = useRouter();
    const [signinError, setSigninError] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
    const formik = useFormik({
        initialValues: {
          email: '',
          password: '',
        },
        validationSchema: validationSchema,

        onSubmit: (values) => {
            handleSignin(values);
        },
      });

    async function handleSignin(data) {

        const status = await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password,
            callbackUrl: "/"
        });

        if (status.ok) {
            router.push('/');
        } else {
            //TOOD: 로그인 폼에 에러 표시.
            console.log(status);
            setErrorMsg(status.error);
            setSigninError(true);
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
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    fullWidth
                    id="email"
                    label="이메일"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="password"
                    label="비밀번호"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />
                {signinError && <div className="error-msg">
                    {errorMsg}
                </div>}
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
            <style jsx>{`
                    .error-msg{
                        font-size: 1.5vw;
                        color: red;
                    }
                `}</style>
        </Box>
    );
}