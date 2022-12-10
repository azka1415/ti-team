import { Link, useColorModeValue } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface Props {
    children: ReactNode
}

export default function NavLink({ children }: Props) {
    return (
        <Link
            px={2}
            py={1}
            rounded={'md'}
            _hover={{
                textDecoration: 'none',
                bg: useColorModeValue('blue.400', 'gray.700'),
            }}
            href={'#'}>
            {children}
        </Link>
    )
}