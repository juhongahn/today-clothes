import { Container } from "@mui/material";
import Navbar from "./Navbar";
import { useRouter } from 'next/router';

export default function Layout({children}) {
    const router = useRouter();
    const showNavbar = !(router.pathname === '/signin' || router.pathname === '/signup');
    return(
        <>
            { showNavbar && <Navbar />}
            <Container
                maxWidth="xs"
                component="main"
                disableGutters={true}
            >
                {children}
            </Container>
        </>
    )
}