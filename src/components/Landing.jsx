'use client'
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, getFirestore, query, orderBy, serverTimestamp, Firestore, addDoc, getDocs, where, setDoc, doc, getDoc } from 'firebase/firestore'
import { useState } from "react";

export default function Landing(props) {
  const [loading, setLoading] = useState(false)
  const db = getFirestore(props.app);

  async function makeUser() {
    const userRef = collection(db, 'users')
    const docRef = doc(db, "users", props.auth.currentUser.uid)
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      await setDoc(doc(userRef, props.auth.currentUser.uid), {
        uid: props.auth.currentUser.uid,
        tokens: 5,
      });

    }
  }
  function doAuth() {
    signInWithPopup(props.auth, new GoogleAuthProvider()).then((result) => {
      console.log(result)
      makeUser()
    }).catch((error) => {
      console.log(error)
    })

  }



  return (
    <>
      <Box
        w={"100%"}
        h={"100vh"}
        bgSize={"cover"}
        backgroundRepeat={"no-repeat"}
        backgroundImage={
          "url(https://img.freepik.com/free-vector/dark-gradient-background-with-copy-space_53876-99548.jpg?w=740&t=st=1685090878~exp=1685091478~hmac=9dc5f235602db5cfc684f5770b5bab12eb0d120145799a6767c5c8fbef2b51aa)"
        }
      >
        <Center h={"100vh"} w={["90%", "100%"]}>
          {loading ? <Text color={"white"} fontSize={"xl"}>Loading...</Text> :
            (
              <Flex
                align={"center"}
                justify={"center"}
                gap={"6"}
                direction={"column"}
              >
                <Text
                  color={"white"}
                  fontWeight={"extrabold"}
                  fontSize={["xl", "3xl", "6xl"]}
                  fontFamily={"sans-serif"}
                  size={"xl"}
                >
                  Get Out Of the Tutorial Hell with <Text as='span' color={"pink.600"}>AIJect</Text>
                </Text>
                <Text
                  fontWeight={"normal"}
                  fontSize={["md", "lg", "2xl"]}
                  color={"whiteAlpha.800"}
                  fontFamily={"sans-serif"}
                >
                  Solve Question and Implement them, Get your project Ready with AI.
                </Text>
                <Flex
                  align={"center"}
                  justify={"center"}
                  direction={"row"}
                  width={"80%"}
                  gap={"7"}
                >
                  <Button
                    width={["120px", "190px"]}
                    height={["50px", "60px"]}
                    borderRadius={"10px"}
                    color={"whiteAlpha.700"}
                    bgColor={"whiteAlpha.200"}
                    _hover={{ bgColor: "whiteAlpha.400" }}
                    backdropBlur={"40px"}
                    borderColor={"whiteAlpha.400"}
                    focusBorderColor="whiteAlpha.200"
                    fontSize={["xs", "xl"]}
                    onClick={() => {
                      doAuth()
                    }}
                  >

                    Get Started
                  </Button>
                </Flex>
              </Flex>
            )}
        </Center>
      </Box>
    </>
  );
}
