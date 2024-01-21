"use client";
import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";

import {
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
        <Flex p={8} flex={1} align={"center"} justify={"center"}>
          <Stack spacing={6} w={"full"} maxW={"lg"}>
            <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
              <Text
                as={"span"}
                position={"relative"}
                _after={{
                  content: "''",
                  width: "full",
                  height: useBreakpointValue({ base: "20%", md: "30%" }),
                  position: "absolute",
                  bottom: 1,
                  left: 0,
                  bg: "blue.500",
                  zIndex: -1,
                }}
              >
                Empower Your Vision
              </Text>
              <br />{" "}
              <Text color={"blue.500"} as={"span"}>
                Put Your Art to Work..
              </Text>{" "}
            </Heading>
            <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
              Transforming finance for artists by collateralizing their
              creations as NFTs with GHO tokens on Aave, revolutionizing
              decentralized lending for creative empowerment.
            </Text>
            <Stack direction={{ base: "column", md: "row" }} spacing={4}>
              <Button
                rounded={"full"}
                bg={"blue.500"}
                color={"white"}
                _hover={{
                  bg: "blue.600",
                }}
                width={{ base: "full", md: "auto" }}
                onClick={() => router.push("/mint-nft")}
              >
                Get Started
              </Button>
              <Button width={{ base: "full", md: "auto" }} rounded={"full"}>
                How It Works
              </Button>
            </Stack>
          </Stack>
        </Flex>
        <Flex flex={1}>
          <Image
            alt={"Login Image"}
            objectFit={"cover"}
            srcSet="https://i.postimg.cc/R0jSnqtK/HeroImg.png"
            width={600}
            height={600}
          />
        </Flex>
      </Stack>
    </>
  );
}
