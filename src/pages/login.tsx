import { signIn, signOut, useSession } from 'next-auth/react';
import React, { useState } from 'react'
import Navbar from '../components/navbar/Navbar'

export default function Login() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const handleSignOut = async () => {
        setLoading(true);
        await signOut();
        setLoading(false);
    }
    const handleSignIn = async () => {
        setLoading(true);
        await signIn('google');
        setLoading(false);
    }

    return (
        <>
            <Navbar />
            <div className='flex justify-center my-80 items-center  scrollbar-hide'>
                <div className='flex flex-col space-y-2 p-2 bg-blue-400 rounded-lg'>
                    {session && (
                        <>
                            <h1 className='text-2xl font-bold'>
                                Welcome! {session.user?.name}
                            </h1>
                            <p>
                                ({session.user?.email})
                            </p>
                            <button className='bg-blue-500 p-2 rounded-md text-black transition-all hover:bg-white' onClick={handleSignOut}>
                                {loading ? 'Logging out...' : 'Log out'}</button>
                        </>
                    )}
                    {!session && (
                        <>
                            <button className='bg-blue-500 p-2 rounded-md text-black transition-all hover:bg-white' onClick={handleSignIn}>{loading ? 'Logging in...' : 'login'}</button>
                        </>
                    )}
                </div>

            </div>
        </>
    )
}
