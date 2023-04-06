import * as React from 'react';
import {
    Grid,
    Box,
    Typography,
    Avatar,
    Button,
    TextField,
    Container
} from '@mui/material';
import { useRouter } from 'next/router';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Link from 'next/link'
import Head from 'next/head'

const validationSchema = yup.object({
    email: yup.string()
      .email('유효한 이메일을 입력해 주세요')
      .required('이메일을 입력해 주세요'),
    password: yup.string()
      .min(7, '7글자 이상 입력해 주세요')
      .required('비밀번호를 입력해 주세요'),
    passwordConfirmation: yup.string()
      .required('비밀번호를 입력해 주세요')
      .oneOf([yup.ref('password'), null], '비밀번호와 일치하지 않습니다'),
    address: yup.string()
      .required('주소를 입력해 주세요')
  });

const url = "/api/auth/signup";

export default function SignUp() {
    const router = useRouter();
    const open = useDaumPostcodePopup();
    const [address, setAddress] = useState('');

    const formik = useFormik({
        initialValues: {
          email: '',
          password: '',
          passwordConfirmation: '',
          address: '',
        },
        validationSchema: validationSchema,

        onSubmit: (values) => {
            submitSignup(values);
        },
      });

    async function submitSignup(data) {
        const options = {
            method: "POST",
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify(data)
        }

        const res = await fetch(url, options);
        if (!res.ok) {
            const { error } = await res.json();
            alert(error.message);
            return;
        }
        router.push('/signin');
    };

    function handleAddressInput(data) {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }
        formik.values.address = fullAddress;
        setAddress(fullAddress);
    };

    const handleAddressPopup = () => {
        open({ onComplete: handleAddressInput });
    };

    return (

        <>
        <Head>
            <title>회원가입</title>
            </Head>
        <Container maxWidth="sm">
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            </Avatar>
            <Typography component="h1" variant="h5">
                회원 가입
            </Typography>
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '1px solid #c6c6c6',
                borderRadius: '10px',
                padding: 4
            }}
        >
            
            <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            label="이메일"
                            name="email"
                            autoComplete="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            name="password"
                            label="비밀번호(7글자 이상 입력해 주세요)"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            name="passwordConfirmation"
                            label="비밀번호 확인"
                            type="password"
                            id="passwordConfirmation"
                            autoComplete="new-password"
                            value={formik.values.passwordConfirmation}
                            onChange={formik.handleChange}
                            error={formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
                            helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
                        />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <TextField
                            fullWidth
                            name="address"
                            label="주소"
                            id="address"
                            value={address}
                            onChange={formik.handleChange}
                            error={formik.touched.address && Boolean(formik.errors.address)}
                            helperText={formik.touched.address && formik.errors.address}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button type='button' onClick={handleAddressPopup} variant="contained">
                            Open
                        </Button>
                    </Grid>
                </Grid>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    size="large"
                >
                    회원 가입
                </Button>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Link href="/signin" variant="body2">
                            로그인 페이지로 가기
                        </Link>
                    </Grid>
                </Grid>
            </Box>
            </Box >
                </Container>
        </>
    );
}