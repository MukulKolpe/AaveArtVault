// @ts-nocheck comment
import React, { useState, useRef, use, useEffect } from "react";
import {
  Progress,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  GridItem,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  InputLeftAddon,
  InputGroup,
  Textarea,
  FormHelperText,
  InputRightElement,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Icon,
  chakra,
  VisuallyHidden,
  Text,
  Stack,
  ring,
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import LoanManagerAbi from "../../../utils/LoanManager.json";
import NFTAbi from "../../../utils/NFT.json";

const CreateLoanForm = () => {
  const toast = useToast();
  const [loanAmount, setLoanAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [nft, setNft] = useState("");
  const [nftId, setNftId] = useState("");
  const [loanExpiration, setLoanExpiration] = useState("");
  const [nftTransfered, setNftTransfered] = useState(false);

  const convertToEpoch = (dateString: any) => {
    const epochValue = new Date(dateString + "T00:00:00Z").getTime() / 1000;
    return epochValue;
  };

  useEffect(() => {
    console.log(loanExpiration);
  }, [loanExpiration]);

  const transferNFT = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      "0x3b47042A391e5ab3722dD8eD5647c072cC05a40f",
      NFTAbi,
      signer
    );

    const tx = await contract.transferFrom(
      signer.getAddress(),
      "0x854913Dc6C0e978E77F6290D217fC816ba404cc6",
      nftId
    );
    await tx.wait();
    setNftTransfered(true);
    toast({
      title: "NFT Transferred",
      description: "Your NFT has been transferred.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  const handleSubmit = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      "0x854913Dc6C0e978E77F6290D217fC816ba404cc6",
      LoanManagerAbi,
      signer
    );
    const tx = await contract.createLoan(
      ethers.utils.parseEther(loanAmount.toString(), 18),
      interestRate,
      nft,
      nftId,
      loanExpiration
    );
    await tx.wait();
    toast({
      title: "Loan Created",
      description: "Your loan has been created.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        p={6}
        m="10px auto"
        as="form"
      >
        <SimpleGrid columns={1} spacing={6}>
          <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
            Get Quick Loan
          </Heading>
          <FormControl mr="2%">
            <FormLabel htmlFor="loan-amount" fontWeight={"normal"}>
              Loan Amount
            </FormLabel>
            <Input
              id="loan-amount"
              placeholder="Enter Loan Amount"
              autoComplete="loan-amount"
              onChange={(e) => setLoanAmount(e.target.value as any)}
            />
          </FormControl>
          <FormControl mr="2%">
            <FormLabel htmlFor="interest-rate" fontWeight={"normal"}>
              Interest Rate (APR)
            </FormLabel>
            <Input
              id="interest-rate"
              placeholder="Enter Interest Rate"
              onChange={(e) => setInterestRate(e.target.value as any)}
            />
          </FormControl>
          <FormControl mr="2%">
            <FormLabel htmlFor="nft-address" fontWeight={"normal"}>
              NFT Address
            </FormLabel>
            <Input
              id="nft-address"
              placeholder="Enter NFT Address"
              onChange={(e) => setNft(e.target.value as any)}
            />
          </FormControl>

          <FormControl mr="2%">
            <FormLabel htmlFor="nft-id" fontWeight={"normal"}>
              NFT ID
            </FormLabel>
            <Input
              id="nft-id"
              placeholder="Enter NFT ID #"
              onChange={(e) => setNftId(e.target.value)}
            />
          </FormControl>
          <FormControl mr="5%">
            <FormLabel htmlFor="datetime-local" fontWeight={"normal"}>
              Loan Expiration Date
            </FormLabel>
            <Input
              placeholder="Select Date and Time"
              size="md"
              type="date"
              id="datetime-local"
              onChange={(e) => {
                setLoanExpiration(convertToEpoch(e.target.value) as any);
              }}
            />
          </FormControl>
          <Button colorScheme="teal" variant="solid" onClick={transferNFT}>
            {nftTransfered
              ? "Collateral Transferred Successfully!"
              : "Transfer Collateral"}
          </Button>
          {nftTransfered && (
            <Button colorScheme="teal" variant="solid" onClick={handleSubmit}>
              Create Loan
            </Button>
          )}
        </SimpleGrid>
      </Box>
    </>
  );
};

export default CreateLoanForm;
