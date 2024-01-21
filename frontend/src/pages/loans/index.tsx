// @ts-nocheck comment
import React, { useState, useEffect } from "react";
import CardComponent from "../../components/CardComponent/CardComponent";
import {
  Grid,
  GridItem,
  Center,
  Button,
  Flex,
  Stack,
  useColorModeValue,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Container,
  SimpleGrid,
  Icon,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import LoanManager from "../../../utils/LoanManager.json";

export default function Loans() {
  const [loans, setLoans] = useState([]);
  useEffect(() => {
    const getLoans = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x854913Dc6C0e978E77F6290D217fC816ba404cc6",
        LoanManager,
        signer
      );

      const getLength = await contract.getAllLoansLength();
      const length = getLength.toString();
      console.log(length);
      for (let i = 0; i < length; i++) {
        const loan = await contract.allLoans(i);

        setLoans((loans) => [...loans, loan]);
      }
    };
    getLoans();
  }, []);

  return (
    <Grid
      templateRows="repeat(2, 1fr)"
      templateColumns="repeat(3, 1fr)"
      gap={4}
      mr={6}
    >
      {loans.map((address) => {
        return (
          <GridItem rowSpan={1} colSpan={1}>
            <CardComponent address={address} />
          </GridItem>
        );
      })}
    </Grid>
  );
}
