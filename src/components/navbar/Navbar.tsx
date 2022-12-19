import Image from "next/image";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { Fragment } from "react";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = router.pathname.replace("/", "");

  return (
    <nav className="sticky top-0 z-50 flex w-full space-x-4 bg-gradient-to-r from-blue-400 to-blue-600 p-2">
      <div
        className={`flex h-10 w-full items-center justify-start space-x-4 transition-all`}
      >
        <Image src="/favicon.ico" alt="logo" width={40} height={40} />
        <div className="hidden justify-between space-x-4 md:flex">
          <Link
            href={"/"}
            className={`transition-all hover:text-white ${
              pathname === "" && "text-white underline"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href={"/teams"}
            className={`transition-all hover:text-white ${
              pathname === "teams" && "text-white underline"
            }`}
          >
            Teams
          </Link>
        </div>
      </div>
      <div className="flex w-full items-center justify-end space-x-2">
        {session?.user?.image ? (
          <Menu>
            <Menu.Button>
              <Image
                src={session?.user?.image}
                alt="user profile picture"
                width={35}
                height={35}
                className="rounded-md md:hidden"
              />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-in-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform translate-x-5 opacity-0 scale-75"
            >
              <Menu.Items
                as="div"
                className={`absolute right-1 top-[3.8rem] flex flex-col items-start justify-start space-y-1 rounded-lg bg-blue-600 p-2 shadow-xl transition-all md:hidden`}
              >
                <Menu.Item>
                  <Link href={"/"}>
                    <button
                      className={`${
                        pathname === "" ? "bg-white underline" : "bg-blue-400"
                      } rounded-lg p-2 transition-all hover:bg-white`}
                    >
                      Dashboard
                    </button>
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link href={"/teams"}>
                    <button
                      className={`${
                        pathname === "teams"
                          ? "bg-white underline"
                          : "bg-blue-400"
                      } rounded-lg p-2 transition-all hover:bg-white`}
                    >
                      Teams
                    </button>
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link href={"/account"}>
                    <button
                      className={`${
                        pathname === "account"
                          ? "bg-white underline"
                          : "bg-blue-400"
                      } rounded-lg p-2 transition-all hover:bg-white`}
                    >
                      Account
                    </button>
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <button
                    onClick={() => signOut()}
                    className="rounded-lg bg-blue-400 p-2 transition-all hover:bg-white"
                  >
                    Log out
                  </button>
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        ) : (
          <button onClick={() => signIn("google")}>Login</button>
        )}
        <Menu>
          <Menu.Button>
            {session?.user?.image && (
              <Image
                src={session?.user?.image}
                alt="user profile picture"
                width={35}
                height={35}
                className="hidden rounded-md md:flex"
              />
            )}
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-in-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform translate-x-5 opacity-0 scale-75"
          >
            <Menu.Items
              as="div"
              className={`invisible absolute right-1 top-[3.8rem] flex h-60 w-60 flex-col items-center justify-center space-y-4 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 p-2 shadow-xl transition-all md:visible`}
            >
              <Menu.Item>
                <Image
                  width={100}
                  height={100}
                  src={String(session?.user?.image)}
                  alt="user profile picture"
                  className="rounded-full"
                />
              </Menu.Item>
              <Menu.Item>
                <Link href={"/account"}>
                  <button
                    className={`${
                      pathname === "account"
                        ? "bg-white underline"
                        : "bg-blue-400"
                    } rounded-lg p-2 transition-all hover:bg-white`}
                  >
                    Account
                  </button>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <button
                  onClick={() => signOut()}
                  className="rounded-lg bg-blue-400 p-2 transition-all hover:bg-white"
                >
                  Log out
                </button>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </nav>
  );
}
