import * as React from 'react';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from 'react';
import Head from 'next/head'
import {
    createTheme,
    responsiveFontSizes,
} from '@mui/material/styles';
import {
    Grid,
    Box,
    Typography,
    Button,
    TextField,
    Paper,
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

    let theme = createTheme();
    theme = responsiveFontSizes(theme);

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
            
            setErrorMsg(status.error);
            setSigninError(true);
        }
    }

    return (
        <>
            <Head>
                <title>오늘의 옷 : 로그인</title>
            </Head>
            <Paper
                elevation={6}
                sx={{
                    borderRadius: '15px',
                    mt: 15,
                    opacity: 0.8,
                }}>
                <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1, p: 3 }}>
                    <Typography variant="h3"
                        gutterBottom
                        sx={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                        }}>
                        오늘의 옷
                    </Typography>
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
                    {signinError &&
                        <div className="error-msg">
                            {errorMsg}
                        </div>
                    }
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 1,
                            mb: 2,
                            fontSize: '1.2rem',
                        }}
                        size="large"
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
            </Paper>
            <style jsx>{`
                    .form-grid-container{
                        width: 60%;
                        height: 60%;
                    }
                    .signin-container{
                        display: flex;
                        height: 100%;
                        justify-content: center;
                        align-items: center;
                    }
                    .error-msg{
                        font-size: 0.9rem;
                        color: red;
                    }
                `}</style>
        </>
    );
}