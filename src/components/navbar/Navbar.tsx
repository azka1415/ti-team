import { useRouter } from "next/router";
import NavLink from "./NavLink";
const Links = ['Dashboard', 'Team'];
export default function Navbar() {
    const router = useRouter();
    console.log(router.pathname);


    return (
        <>

        </>
    );
}