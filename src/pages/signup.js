import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { useState } from 'react';
import { convertAddress } from '@/lib/addressConvert';


export default function SignUp() {
    const router = useRouter();
    const open = useDaumPostcodePopup();
    const [address, setAddress] = useState('');

    const url = "http://localhost:3000/api/auth/signup";

    async function handleSubmit(event) {
        let x, y;
        event.preventDefault();
        console.log(address)
        const data = new FormData(event.currentTarget);

        await convertAddress(address)
            .then(res => {
                x = res.x
                y = res.y
            });


        const signupData = {
            email: data.get('email'),
            password: data.get('password'),
            address: { fullAddress: address, x: x, y: y },
        };

        const options = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData)
        }

        await fetch(url, options)
            .then(res => res.json())
            .catch((error) => {
                console.log(error)
            })
            .then((data) => {
                if (data) router.push('/signin');
            })

    };

    function handleComplete(data) {
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

        setAddress(fullAddress);
    };

    const handleClick = () => {
        open({ onComplete: handleComplete });
    };

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
                회원 가입
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            label="이메일"
                            name="email"
                            autoComplete="email"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="password"
                            label="비밀번호"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                        />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <TextField
                            required
                            fullWidth
                            name="주소"
                            label="주소"
                            id="address"
                            value={address}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button type='button' onClick={handleClick} variant="contained">
                            Open
                        </Button>
                    </Grid>
                </Grid>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    회원 가입
                </Button>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Link href="/signin" variant="body2">
                            Already have an account? Sign in
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Box >
    );
}