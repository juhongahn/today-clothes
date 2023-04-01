import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router';

function Navbar() {
    const { data: session, status } = useSession()
    const router = useRouter();

    async function handleSignOut() {
        const data = await signOut({redirect: false, callbackUrl: "/signin"});
        router.push(data.url);
    }

    return (
        <nav className='header'>
            <h1 className='logo'>
                <Link href='/' legacyBehavior>
                    <a>오늘의 옷</a>
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
                        <button legacyBehavior>
                            <a
                                onClick={e => {
                                    handleSignOut();
                                }}>
                                Sign Out
                            </a>
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    )
}

export default Navbar