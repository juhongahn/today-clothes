import { Container } from "@mui/material";
import Navbar from "./Navbar";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Error from '../pages/_error'

export default function Layout({ children }) {
    const router = useRouter();
    
    const showNavbar = !(router.pathname === '/signin' || router.pathname === '/signup');
    return (
        <Container
            maxWidth="xs"
            component="main"
            disableGutters={true}
            sx={{
                width: '100%',
                height: '100%',
            }}
        >
            {showNavbar && <Navbar />}
            {children}
        </Container>
    )
}