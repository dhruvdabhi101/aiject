'use client'
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Text,
  Input,
  Stack,
  HStack,
  FormControl,
    Skeleton,
    Spinner
} from "@chakra-ui/react";
import { collection, getFirestore, query, orderBy, serverTimestamp, Firestore, addDoc, where, getDocs, doc, get, setDoc, updateDoc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from "react";
import { loadStripe } from '@stripe/stripe-js';


const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function HomePage(props) {
    const user = props.auth.currentUser;
    const [questions, setQuestions] = useState([])
    const [tokens, setTokens] = useState(0)
    const [projectIdea, setProjectIdeas] = useState("")
    const [techStack, setTechStack] = useState("")
    const [loading, setLoading] = useState(false)
    const [qLoading, setQLoading]= useState(false)

    useEffect(() => {
        setLoading(true)
        const db = getFirestore(props.app)
        const userRef = collection(db, 'users')
        const docRef = doc(db, "users", props.auth.currentUser.uid)
        const docSnap = getDoc(docRef).then((docS) => {
            if (docS.exists()) {
                console.log("Document data:", docS.data());
                setTokens(docS.data().tokens)
            } else {
                console.log("No such document!");
            }
        })

    const queryP = new URLSearchParams(window.location.search);
    if (queryP.get('success')) {
      console.log(queryP.get('success'))
      console.log('Order placed! You will receive an email confirmation');
      increaseTokens().then(() => {
        console.log("Tokens increased")
      })


    }

    if (queryP.get('canceled')) {
      console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
    }
      setLoading(false)
  }, [])




  const increaseTokens = async () => {
      setLoading(true)
    const db = getFirestore(props.app)
    const userRef = collection(db, 'users')
    const docRef = doc(db, "users", props.auth.currentUser.uid)
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      await updateDoc(docRef, {
        tokens: docSnap.data().tokens + 10
      })
      setTokens(docSnap.data().tokens + 10)
    } else {
      console.log("No such document!");
    }
      setLoading(false)
  }


  const decreaseTokens = async () => {
    const db = getFirestore(props.app)
    const userRef = collection(db, 'users')
    const docRef = doc(db, "users", props.auth.currentUser.uid)
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      await updateDoc(docRef, {
        tokens: docSnap.data().tokens - 1
      })
      setTokens(docSnap.data().tokens - 1)
    } else {
      console.log("No such document!");
    }
  }

  const buyTokens = async () => {
      setLoading(true)
    const stripe = await stripePromise;
    const response = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const session = await response.json();
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
    if (result.error) {
      console.log(result.error.message)
    }
  }


  const makeOpenAIRequest = async () => {
      setQLoading(true)

    if (tokens < 1) {
      alert("You do not have enough tokens to make a request")
      return
    }



    try {
       // const response = await fetch("https://us-central1-aiject.cloudfunctions.net/generate", {
        const response = await fetch("https://us-central1-aiject.cloudfunctions.net/generate", {

            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tech: techStack,
                idea: projectIdea
            })
        });
        console.log(response)
     const data = await response.json();
           const answerString = data.choices[0].message.content;
           console.log(answerString.split("\n"));
    //    const answerString = data.choices[0].message;
        setQuestions(answerString.split("\n"))

      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      await decreaseTokens()


    } catch (error) {
      console.error(error);
      alert(error.message);
    }

      setQLoading(false)

  }


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
        overflowY={"scroll"}
      >
        <Flex direction={"column"} align={"center"} gap={"7rem"} >
          <HStack align={"center"} spacing={["1em", "4em", "13em", "15em", "25em", "50em"]}>
            <Heading> AIJect </Heading>
            <Flex align={"center"} gap={"3"}>
              <Text> Tokens: <Text as={"span"}> {tokens} </Text> </Text>
              <Button
                width={["70px", "100px", "170px"]}
                height={["30px", "40px"]}
                borderRadius={"10px"}
                color={"whiteAlpha.700"}
                bgColor={"whiteAlpha.200"}
                _hover={{ bgColor: "whiteAlpha.400" }}
                backdropBlur={"40px"}
                borderColor={"whiteAlpha.400"}
                focusBorderColor="whiteAlpha.200"
                fontSize={["xs", "md", "lg"]}
                onClick={async () => {
                  await props.auth.signOut()
                }
                }

              >

                Log Out
              </Button>
              <Button onClick={buyTokens}> Buy Tokens </Button>
            </Flex>
          </HStack>
          <Stack gap={"10"} w={"100%"} justify={"center"} align={"center"}>
            <Stack gap={"5"}>
              <Input
                placeholder={"Enter Project Idea"}
                width={["15rem", "25rem", "40rem", "40rem"]}
                height={["40px", "45px", "50px"]}
                color={"white"}
                backgroundColor={"whiteAlpha.200"}
                backdropBlur={"40px"}
                borderColor={"whiteAlpha.300"}
                _outline={{ borderColor: "whiteAlpha.300" }}
                focusBorderColor="whiteAlpha.200"
                _placeholder={{ color: "whiteAlpha.900", fontSize: "xl", textAlign: "center" }}
                _hover={{ borderColor: "whiteAlpha.400" }}
                onChange={(e) => {
                  setProjectIdeas(e.target.value)
                }}
              />

              <Input
                placeholder={"Enter Tech Stack"}
                width={["15rem", "25rem", "40rem", "40rem"]}
                height={["40px", "45px", "50px"]}
                color={"white"}
                backgroundColor={"whiteAlpha.200"}
                backdropBlur={"40px"}
                borderColor={"whiteAlpha.300"}
                _outline={{ borderColor: "whiteAlpha.300" }}
                focusBorderColor="whiteAlpha.200"
                _placeholder={{ color: "whiteAlpha.900", fontSize: "xl", textAlign: "center" }}
                _hover={{ borderColor: "whiteAlpha.400" }}
                onChange={(e) => {
                  setTechStack(e.target.value)
                }}
              />
            </Stack>


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
              onClick={async () => {
                await makeOpenAIRequest()
                console.log("clicked")
              }}
            >
              Get Questions
            </Button>

            <Flex align={"center"} justify={"center"} h={["12em","19em","20em","30em"]} w={"100%"} >
              <Box
                backgroundColor={"whiteAlpha.200"}
                backdropBlur={"40px"}
                p={"4"}
                borderRadius={"xl"}
                w={["80%", "75%", "70", "65%", "50%"]}
                h={"100%"}
                boxShadow={"lg"}
                overflowY={"auto"}
              >
                {qLoading && 
                    <Center>
                    <Spinner
                      thickness='4px'
                      speed='0.65s'
                      emptyColor='gray.200'
                      color='purple.300'
                      size='xl'
                />
                    </Center>
                }
      {!qLoading &&
                <Stack spacing={"5"}>
                  {questions.map((question) => {
                    return (
                      <Box
                        backgroundColor={"whiteAlpha.300"}
                        backdropBlur={"40px"}
                        p={"4"}
                        borderRadius={"xl"}
                        boxShadow={"lg"}
                      >
                        <Text> {question} </Text>
                      </Box>
                    )
                  })}
                </Stack>

      }

              </Box>

            </Flex>



          </Stack>
        </Flex>

      </Box>




    </div>
  )
}
