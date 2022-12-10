/* eslint-disable react-hooks/rules-of-hooks */
import { CloseIcon, HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
    Avatar,
    Box,
    Button,
    Center,
    Flex,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Stack,
    useColorMode,
    useColorModeValue,
    useDisclosure
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import NavLink from "./NavLink";
const Links = ['Dashboard', 'Team'];
export default function Navbar() {
    const router = useRouter();
    console.log(router.pathname);
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Box bgGradient={useColorModeValue('linear(to-r,#3a7bd5,#3a6073)', 'gray.900')} px={2} py={1}
                textColor={'white'}
                rounded={'lg'}
                className='sticky top-0 z-50'
            >
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <IconButton
                        bg={'transparent'}
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <Box bg={"inherit"} display={{ md: 'flex' }} rounded={"xl"} className='hidden' >
                        <HStack as={'nav'} >

                            {Links.map((link) => (
                                <NavLink key={link}>{link}</NavLink>
                            ))}
                        </HStack>
                    </Box>

                    <Flex alignItems={'center'}>
                        <Stack direction={'row'} spacing={7}>
                            <IconButton aria-label="theme switcher" onClick={toggleColorMode} bg={'transparent'} variant={'unstyled'} className='p-2 transition hover:bg-slate-800'>
                                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            </IconButton>

                            <Menu >
                                <MenuButton
                                    as={Button}
                                    rounded={'full'}
                                    variant={'link'}
                                    cursor={'pointer'}
                                    minW={0}>
                                    <Avatar
                                        size={'sm'}
                                        src={'https://avatars.dicebear.com/api/male/username.svg'}
                                    />
                                </MenuButton>
                                <MenuList alignItems={'center'} bg={"transparent"} textColor={'black'}>
                                    <br />
                                    <Center>
                                        <Avatar
                                            size={'2xl'}
                                            src={'https://avatars.dicebear.com/api/male/username.svg'}
                                        />
                                    </Center>
                                    <br />
                                    <Center>
                                        <p>Username</p>
                                    </Center>
                                    <br />
                                    <MenuDivider />
                                    <MenuItem>Your Servers</MenuItem>
                                    <MenuItem>Account Settings</MenuItem>
                                    <MenuItem>Logout</MenuItem>
                                </MenuList>
                            </Menu>
                        </Stack>
                    </Flex>
                </Flex>
                {isOpen ? (
                    <Box bg={"inherit"} display={{ md: 'none' }} rounded={"xl"} >
                        <Stack as={'nav'} >

                            {Links.map((link) => (
                                <NavLink key={link}>{link}</NavLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>
        </>
    );
}