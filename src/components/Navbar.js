import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
    IconButton,
    MenuItem,
    Menu,
} from '@mui/material'
import AccountCircle from '@mui/icons-material/AccountCircle';

function Navbar() {
    const { data: session, status } = useSession()
    const router = useRouter();

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    async function handleSignout() {
        await signOut({ redirect: true});
    }

    return (
        <nav className='header'>
            <div className='logo-box'>
                <h1 className='logo'>
                    오늘의 옷
                </h1>
            </div>
            <ul className={`main-nav ${!session && status === "loading" ? 'loading' : 'loaded'}`}>
                {status === "authenticated" && (
                    <div>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                        <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleSignout}>로그아웃</MenuItem>
                        </Menu>
                    </div>
                )}
                
            </ul>
        </nav>
    )
}

export default Navbar