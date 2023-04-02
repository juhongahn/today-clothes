import * as React from 'react';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from 'react';
import Head from 'next/head'
import Image from "next/image";
import Lottie from 'react-lottie-player'
import lottieJson from '/public/backgroundLottie.json'
import { createTheme,
        responsiveFontSizes,
        ThemeProvider,
} from '@mui/material/styles';
import {
    Grid,
    Box,
    Typography,
    Avatar,
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
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
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
        <>
            <Head>
                <title>로그인</title>
            </Head>
            
            <div className="signin-container">
                    <Paper elevation={6} sx={{
                        width: '50%',
                        height: '70%',
                        borderRadius: '15px',
                        overflow: 'hidden'
                    }}>
                    <Grid container
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                        height: '100%',
                    }}>
                        <Box
                            component={Grid}
                            item
                            sm={4}
                            md={6.5}
                            display={{
                                xs: "none", sm: 'blcok', md: 'block', lg: "block",
                            }}
                            sx={{
                                backgroundColor: 'skyblue', height: '100%', 
                            }}
                        >
                            <Lottie 
                                loop
                                animationData={lottieJson}
                                play
                                style={{width: '100%', height: '100%'}}
                            />
                        </Box>
                           
                        <Grid item xs={12} sm={8} md={5.5}>    
                            <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1, p:3 }}>
                            <ThemeProvider theme={theme}>
                                <Typography variant="h3" gutterBottom sx={{textAlign: 'center',}}>
                                    오늘의 옷
                                </Typography>
                                
                            </ThemeProvider>
                                
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
                                        background: 'skyblue',
                                        fontSize: '1vw'
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
                        </Grid>  
                    </Grid>
                    </Paper>
                
            </div>
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
                        background: rgb(137,247,255);
                        background: linear-gradient(0deg, rgba(137,247,255,1) 4%, rgba(132,202,255,1) 53%, rgba(73,150,255,1) 74%, rgba(0,112,255,1) 100%);
                    }
                    .error-msg{
                        font-size: 0.9vw;
                        color: red;
                    }
                `}</style>
        </>
    );
}