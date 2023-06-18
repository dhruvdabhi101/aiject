
import { Text, Center, Box, Flex } from "@chakra-ui/react"


export default function Loading() {
    return (
        <div>
        <Box
        w={"100%"}
        h={"100vh"}
        bgSize={"cover"}
        backgroundRepeat={"no-repeat"}
        backgroundImage={
            "url(https://img.freepik.com/free-vector/dark-gradient-background-with-copy-space_53876-99548.jpg?w=740&t=st=1685090878~exp=1685091478~hmac=9dc5f235602db5cfc684f5770b5bab12eb0d120145799a6767c5c8fbef2b51aa)"
        }
        p={"10"}
        >
        <Flex justify={"center"} align={"center"} alignItems={"center"} h={"100%"}>
        <Text color={"white"} fontSize={"3xl"} fontWeight={"bold"}>Loading...</Text>
        </Flex>

        </Box>




    </div>
    )
}
