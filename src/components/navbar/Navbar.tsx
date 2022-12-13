import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Fragment, useState } from "react";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";


export default function Navbar() {
    const { data: session } = useSession();
    const router = useRouter();
    const pathname = router.pathname.replace('/', '');
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 flex w-full bg-gradient-to-r from-blue-400 to-blue-600 space-x-4 p-2 z-50">
            <div className={`flex h-10 w-full justify-start items-center space-x-4 transition-all`}>
                <Image src="/favicon.ico" alt="logo" width={40} height={40} />
                <div className="justify-between space-x-4 hidden md:flex">

                    <Link href={'/'} className={`transition-all hover:text-white ${pathname === '' && 'text-white underline'}`}>Dashboard</Link>
                    <Link href={'/teams'} className={`transition-all hover:text-white ${pathname === 'teams' && 'text-white underline'}`}>Teams</Link>
                </div>

            </div>
            <div className="w-full flex justify-end items-center space-x-2">
                {session?.user?.image ?
                    (<Menu>
                        <Menu.Button>
                            <Image src={session?.user?.image} alt='user profile picture' width={35} height={35} className='rounded-md md:hidden' />
                        </Menu.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform translate-x-5 opacity-0 scale-75"
                        >

                            <div className={`${isOpen ? 'flex' : 'hidden'} absolute flex-col justify-start items-start right-1 p-2 bg-blue-600 rounded-lg top-12 shadow-xl space-y-1 transition-all`}>
                                <button className="bg-blue-400 transition-all hover:bg-white p-2 rounded-lg">Dashboard</button>
                                <button className="bg-blue-400 transition-all hover:bg-white p-2 rounded-lg">Teams</button>

                            </div>
                        </Transition>
                    </Menu>
                    ) : <button>Login</button>}
                {session?.user?.image && <Image src={session?.user?.image} alt='user profile picture' width={35} height={35} className='hidden md:flex rounded-md' />}
            </div>


        </nav>
    );
}