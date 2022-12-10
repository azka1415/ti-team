import { Box, Card, CardBody, CardHeader, Flex, Heading, Text, Divider, CardFooter } from '@chakra-ui/react'
import React from 'react'

export default function Note() {
    return (
        <Card variant={'elevated'}
            textColor={'white'}
            shadow={'2xl'}
        >
            <CardHeader bg={'yellow.500'} textColor={'black'}>
                <Box as='div' className='min-w-[21rem] max-w-[21rem]'>

                    <Flex justify={'start'}>

                        <Heading size={'md'} >
                            Note Title
                        </Heading>
                    </Flex>
                </Box>
            </CardHeader>
            <CardBody bg={'yellow.300'} >
                <Box as='div' rounded={'lg'} textColor={'brown'} className='flex flex-col justify-center items-center'>


                    <Text fontWeight={'bold'} >
                        body test
                    </Text>
                </Box>
            </CardBody>
            <CardFooter bg={'yellow.300'} textColor={'black'}>
                {new Date().toLocaleDateString()}
            </CardFooter>
        </Card>
    )
}
