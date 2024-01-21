// @ts-nocheck comment
import React from "react";
import loadnmanagerabi from "../../../utils/LoanManager.json";
import loanabi from "../../../utils/Loans.json";
import nftabi from "../../../utils/NFT.json";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
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
  Center,
} from "@chakra-ui/react";

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

const Profile = () => {
  const [loans, setLoans] = useState([]);

  function convertEpochToStandardTime(epochTime) {
    // Create a new Date object from the epoch time
    const date = new Date(epochTime * 1000);

    // Get the year, month, day, hour, minute, and second from the Date object
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-indexed in JavaScript
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    // Return the standard time in a string format
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  const loadBorrowedLoans = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      "0x854913Dc6C0e978E77F6290D217fC816ba404cc6",
      loadnmanagerabi,
      signer
    );
    const nftContractAddress = "0x3b47042A391e5ab3722dD8eD5647c072cC05a40f";
    console.log(contractInstance);
    const res = await contractInstance.getBorrowerLoans();
    console.log(res);
    //console.log("Total Loans Created: " + res.length);
    for (let i = 0; i < res.length; i++) {
      const loanContractInstance = new ethers.Contract(res[i], loanabi, signer);
      console.log(loanContractInstance);
      const borrowedAmt = await loanContractInstance.loanAmount();
      console.log("Borrowed Amount: " + borrowedAmt);
      const loanNftId = await loanContractInstance.NFTId();
      console.log("Collateral NFT Id: " + loanNftId);
      const loanExpDate = await loanContractInstance.loanExpiration();
      const normalTime = convertEpochToStandardTime(loanExpDate);
      console.log("Loan Expiration Date: " + normalTime);
      const intrestRate = await loanContractInstance.interestRate();
      console.log("Intrest Rate: " + intrestRate);
      const loanLender = await loanContractInstance.lender();
      console.log("lender is: " + loanLender);
      const remAmt = await loanContractInstance.remainingAmount();
      console.log("Remaining Amt: " + remAmt);
      const nftContractInstance = new ethers.Contract(
        nftContractAddress,
        nftabi,
        signer
      );
      console.log(nftContractInstance);
      const nftOwnerAddress = await nftContractInstance.ownerOf(loanNftId);
      console.log("Owner of NFT: " + nftOwnerAddress);
      const nftImgIpfsUri = await nftContractInstance.tokenURI(5);
      console.log("Ipfs URI of collateral NFT: " + nftImgIpfsUri);
      const isActive = await contractInstance.activeLoans(res[i]);
      console.log("Is Loan Active: " + isActive);
      setLoans((prevState) => [
        ...prevState,
        {
          loanAmt: borrowedAmt,
          collateralNFTId: loanNftId,
          loanExpDate: normalTime,
          loanIntrestRate: intrestRate,
          remLoanAmt: remAmt,
          nftOwnerAdd: nftOwnerAddress,
          nftTokenURI: nftImgIpfsUri,
          loanContractAdd: res[i],
          nftAdd: nftContractAddress,
          nftTokenId: loanNftId,
          loanLender: loanLender,
          isActive: isActive,
        },
      ]);
    }
  };

  useEffect(() => {
    return () => loadBorrowedLoans();
  }, []);

  return (
    <Container maxW={"7xl"} p="12">
      <Heading as="h1">Created Loans: </Heading>
      {loans.length == 0 && <Center mt={8}>No Loans Found</Center>}
      {loans && loans.map((loan) => <ProfileCard loan={loan} />)}
    </Container>
  );
};

export default Profile;
