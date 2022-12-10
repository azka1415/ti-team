import { Box, Card, CardBody, CardHeader, Flex, Heading, Text, Divider, CardFooter, Checkbox, Button } from '@chakra-ui/react'
import React from 'react'

export default function Note() {
    return (
        <Card variant={'elevated'}
            textColor={'white'}
            shadow={'2xl'}
            w={'auto'}
            h={'auto'}
            maxH={'sm'}
            maxW={'sm'}
        >
            <CardHeader bg={'yellow.500'} textColor={'black'}>
                <Box className='w-auto'>

                    <Flex justify={'start'} gap='2'>

                        <Heading size={'md'} >
                            Note Title
                        </Heading>
                        <Checkbox
                            colorScheme={'green'}
                            isDisabled defaultChecked={true}
                        />
                    </Flex>
                </Box>
            </CardHeader>
            <CardBody bg={'yellow.300'} >
                <Box rounded={'lg'} textColor={'brown'} p='2'>
                    <Flex direction={'column'} justify='center'
                        alignItems={'center'} h={'full'}>


                        <Text fontWeight={'bold'} >
                            body test
                        </Text>
                    </Flex>
                </Box>
            </CardBody>
            <Box h={0.5} bg='yellow.500'></Box>
            <CardFooter bg={'yellow.300'} textColor={'black'}>
                <Box display="flex" alignItems="center" justifyContent="space-between" w={'full'}>
                    <Text>
                        {new Date().toLocaleString()}
                    </Text>
                    <Button size={'sm'} colorScheme='green' >Check</Button>
                    <Button size={'sm'} colorScheme='red'>Delete</Button>
                </Box>
            </CardFooter>
        </Card >
    )
}
