// @ts-nocheck comment
import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Image,
  Text,
  Divider,
  HStack,
  Tag,
  Wrap,
  WrapItem,
  SpaceProps,
  useColorModeValue,
  Container,
  VStack,
  Button,
  useToast,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import GHOabi from "../../../utils/GHOabi.json";
import Loanabi from "../../../utils/Loans.json";
import { ethers } from "ethers";

interface IBlogTags {
  tags: Array<string>;
  marginTop?: SpaceProps["marginTop"];
}

interface Props {
  marginTop?: number;
  tags: any[];
}

const BlogTags = (props: Props) => {
  const { marginTop = 0, tags } = props;

  return (
    <HStack spacing={2} marginTop={marginTop}>
      {tags.map((tag) => {
        return (
          <Tag size={"md"} variant="solid" colorScheme="orange" key={tag}>
            {tag}
          </Tag>
        );
      })}
    </HStack>
  );
};

interface BlogAuthorProps {
  date: Date;
  name: string;
}

const BlogAuthor = (props: BlogAuthorProps) => {
  return (
    <HStack marginTop="2" spacing="2" display="flex" alignItems="center">
      <Image
        borderRadius="full"
        boxSize="40px"
        src="https://100k-faces.glitch.me/random-image"
        alt={`Avatar of ${props.name}`}
      />
      <Text fontWeight="medium">{props.name}</Text>
      <Text>—</Text>
      <Text>{props.date.toLocaleDateString()}</Text>
    </HStack>
  );
};

const ProfileCard = ({ loan }) => {
  const [approvalFlag, setApprovalFlag] = useState(false);
  const toast = useToast();

  const approveGho = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const ghoInstance = new ethers.Contract(
      "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60",
      GHOabi,
      signer
    );
    console.log(ghoInstance);
    const paramAdd = loan.loanContractAdd;
    const paramAmt = loan.loanAmt;
    const tx = await ghoInstance.approve(paramAdd, paramAmt);
    await tx.wait();
    toast({
      title: "GHO Approved",
      description: "You have approved GHO tokens to the contract.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    console.log("GHO Approved");
    setApprovalFlag(true);
  };

  const makePayment = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const paramAdd = loan.loanContractAdd;
    const contractInstance = new ethers.Contract(paramAdd, Loanabi, signer);
    const lenderAdd = loan.loanLender;
    const paramAmt = loan.loanAmt;
    const tx = await contractInstance.makePayment(lenderAdd, paramAmt);
    await tx.wait();
    toast({
      title: "Loan Paid Back",
      description: "Your collateral NFT will be transferred back to you.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    console.log("Loan Paid back");
  };

  return (
    <Box
      marginTop={{ base: "1", sm: "5" }}
      display="flex"
      flexDirection={{ base: "column", sm: "row" }}
      justifyContent="space-between"
      mb={8}
    >
      <Box
        display="flex"
        flex="1"
        marginRight="3"
        position="relative"
        alignItems="center"
      >
        <Box
          width={{ base: "100%", sm: "85%" }}
          zIndex="2"
          marginLeft={{ base: "0", sm: "5%" }}
          marginTop="5%"
        >
          <Box textDecoration="none" _hover={{ textDecoration: "none" }}>
            <Image
              borderRadius="lg"
              src={loan.nftTokenURI}
              alt="Collateral NFT Image"
              objectFit="contain"
            />
          </Box>
        </Box>
        <Box zIndex="1" width="100%" position="absolute" height="100%">
          <Box
            bgGradient={useColorModeValue(
              "radial(orange.600 1px, transparent 1px)",
              "radial(orange.300 1px, transparent 1px)"
            )}
            backgroundSize="20px 20px"
            opacity="0.4"
            height="100%"
          />
        </Box>
      </Box>
      <Box
        display="flex"
        flex="1"
        flexDirection="column"
        justifyContent="center"
        marginTop={{ base: "3", sm: "0" }}
      >
        <Heading marginTop="1">
          <Text textDecoration="none" _hover={{ textDecoration: "none" }}>
            Loan Amount: ${Number(loan.loanAmt)}
          </Text>
        </Heading>
        <Text
          as="p"
          marginTop="2"
          color={useColorModeValue("gray.700", "gray.200")}
          fontSize="lg"
        >
          Loan Expiration Date: {loan.loanExpDate}
        </Text>
        <Text
          as="p"
          marginTop="2"
          color={useColorModeValue("gray.700", "gray.200")}
          fontSize="lg"
        >
          Remaining Amount: ${Number(loan.remLoanAmt)}
        </Text>
        <Text
          as="p"
          marginTop="2"
          color={useColorModeValue("gray.700", "gray.200")}
          fontSize="lg"
        >
          Intrest Rate: {Number(loan.loanIntrestRate)}%
        </Text>
        <Text
          as="p"
          marginTop="2"
          color={useColorModeValue("gray.700", "gray.200")}
          fontSize="lg"
        >
          Expiration Date: {Number(loan.loanIntrestRate)}%
        </Text>
        {!loan.isActive && (
          <Text
            as="p"
            marginTop="2"
            color={useColorModeValue("gray.700", "gray.200")}
            fontSize="lg"
          >
            Lender: {loan.loanLender}
          </Text>
        )}
        <Text
          as="p"
          marginTop="2"
          color={useColorModeValue("gray.700", "gray.200")}
          fontSize="lg"
        >
          Currently Owned By:{" "}
          {loan.loanContractAdd == loan.nftOwnerAdd ? (
            <>Owned By Platform</>
          ) : (
            <>Owned By you</>
          )}
        </Text>
        <Button mt={2}>
          <Link
            href={`https://sepolia.etherscan.io/nft/${loan.nftAdd}/${loan.nftTokenId}`}
            isExternal
          >
            View NFT <ExternalLinkIcon mx="2px" />
          </Link>
        </Button>
        {!approvalFlag && (
          <Button onClick={approveGho} mt={2}>
            Approve GHO
          </Button>
        )}
        {approvalFlag && (
          <Button onClick={makePayment} mt={2}>
            Pay Now
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ProfileCard;
