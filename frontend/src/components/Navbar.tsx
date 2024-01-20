import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Icon,
  Heading,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  HamburgerIcon,
  CloseIcon,
  AddIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";

import { Link } from "@chakra-ui/next-js";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isDisconnected } = useAccount();

  return (
    <>
      <Box bg={useColorModeValue("white", "gray.800")} px={10}>
        <Flex
          h={16}
          alignItems="center"
          justifyContent="space-between"
          mx="auto"
        >
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack
            spacing={8}
            alignItems={"center"}
            fontSize="26px"
            fontWeight="0"
            ml="2"
            color="brand.00"
          >
            <Link href="/">LFGHO</Link>
          </HStack>
          <Flex alignItems={"center"}>
            <div style={{ display: "flex" }}>
              <>
                {!isDisconnected && (
                  <>
                    <HStack
                      as={"nav"}
                      spacing={4}
                      display={{ base: "none", md: "flex" }}
                      marginRight={4}
                    >
                      <Link href="/mint-nft">
                        <Button w="full" variant="ghost">
                          Mint NFT
                        </Button>
                      </Link>
                    </HStack>
                    <HStack
                      as={"nav"}
                      spacing={4}
                      display={{ base: "none", md: "flex" }}
                      marginRight={4}
                    >
                      <Link href="/create-loan">
                        <Button w="full" variant="ghost">
                          Create Loan
                        </Button>
                      </Link>
                    </HStack>
                  </>
                )}
              </>

              <HStack>
                <ConnectKitButton />
              </HStack>
            </div>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              <Link href="/mint-nft">
                <Button w="full" variant="ghost">
                  Mint NFT
                </Button>
              </Link>
              <Link href="/create-loan">
                <Button w="full" variant="ghost">
                  Create Loan
                </Button>
              </Link>
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
