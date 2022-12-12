import Image from "next/image";
import { useRouter } from "next/router";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useSession } from "next-auth/react";
import { useState } from "react";


export default function Navbar() {
    const { data: session } = useSession();
    const router = useRouter();
    console.log(router.pathname);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 flex w-full bg-gradient-to-r from-blue-400 to-blue-600 space-x-4 p-2 z-50">
            <div className={`flex h-10 w-full justify-start items-center space-x-2 transition-all`}>
                <Image src="/favicon.ico" alt="logo" width={40} height={40} />
            </div>
            <div className="w-full flex justify-end items-center space-x-2">
                {session?.user?.image ?
                    <Image src={session?.user?.image} alt='user profile picture' width={35} height={35} className='rounded-md md:hidden' onClick={() => setIsOpen(!isOpen)} /> : <button>Login</button>}
                {session?.user?.image && <Image src={session?.user?.image} alt='user profile picture' width={35} height={35} className='hidden md:flex rounded-md' />}
            </div>

            <div className={`${isOpen ? 'flex' : 'hidden'} absolute flex-col justify-start items-start right-1 p-2 bg-blue-600 rounded-lg top-12 shadow-xl space-y-1`}>
                <button className="bg-blue-400 transition-all hover:bg-white p-2 rounded-lg">Dashboard</button>
                <button className="bg-blue-400 transition-all hover:bg-white p-2 rounded-lg">Teams</button>

            </div>
        </nav>
    );
}