import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router';

function Navbar() {
    const { data: session, status } = useSession()
    const router = useRouter();
    return (
        <nav className='header'>
            <h1 className='logo'>
                <Link href='/' legacyBehavior>
                    <a>Home</a>
                </Link>
            </h1>
            <ul className={`main-nav ${!session && status === "loading" ? 'loading' : 'loaded'}`}>

                {status !== "loading" && !session && (
                    <li>
                        <a
                            onClick={e => {
                                e.preventDefault()
                                router.push('/signin');
                            }}>
                            Sign In
                        </a>
                    </li>
                )}
                {status === "authenticated" && (
                    <li>
                        <Link href='/api/auth/signout' legacyBehavior>
                            <a
                                onClick={e => {
                                    e.preventDefault()
                                    signOut()
                                }}>
                                Sign Out
                            </a>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}

export default Navbar