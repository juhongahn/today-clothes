import Navbar from "./Navbar";
import { useRouter } from 'next/router';

export default function Layout({children}) {
    const router = useRouter();
    const showNavbar = !(router.pathname === '/signin' || router.pathname === '/signup');
    return(
        <>
            { showNavbar && <Navbar />}
            <div>
                {children}
            </div>
        </>
    )
}