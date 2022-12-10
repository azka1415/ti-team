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
    Text,
    useColorMode,
    useColorModeValue,
    useDisclosure
} from "@chakra-ui/react";
import NavLink from "./NavLink";
const Links = ['Dashboard', 'Projects', 'Team'];
export default function Navbar() {
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Box bgGradient={useColorModeValue('linear(to-r,#1CD8D2,#93EDC7)', 'linear(to-r,#141E30,#243B55')} px={4} py={2}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>

                    <HStack alignItems={'center'}>

                        <IconButton
                            aria-label="Open Menu"
                            size={'sm'}
                            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                            display={{ md: 'none' }}
                            onClick={isOpen ? onClose : onOpen}
                            bg={'inherit'}
                        />
                        <HStack
                            as={'nav'}
                            px={4}
                            display={{ base: 'none', md: 'flex' }}
                            justifyContent={'center'}
                            alignItems={'center'}>
                            {Links.map((link) => (
                                <NavLink key={link}>{link}</NavLink>
                            ))}
                        </HStack>
                    </HStack>

                    <Flex alignItems={'center'}>
                        <Stack direction={'row'} spacing={7}>
                            <Button onClick={toggleColorMode} bg={'inherit'}>
                                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            </Button>

                            <Menu>
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
                                <MenuList alignItems={'center'}>
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
                                    <MenuItem>Log out</MenuItem>
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