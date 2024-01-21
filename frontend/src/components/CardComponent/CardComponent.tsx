// @ts-nocheck comment
import {
  Heading,
  Avatar,
  Box,
  Center,
  Image,
  Flex,
  Text,
  Stack,
  Button,
  useColorModeValue,
  FormControl,
  FormLabel,
  Icon,
  Input,
  VisuallyHidden,
  chakra,
  Grid,
  GridItem,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Nftabi from "../../../utils/NFT.json";
import LoansAbi from "../../../utils/Loans.json";
import { ethers } from "ethers";

const CardComponent = ({ address }) => {
  const [imageURI, setImageURI] = useState("");
  const [amount, setAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [borrower, setBorrower] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  useEffect(() => {
    const getNFT = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const loanContract = new ethers.Contract(address, LoansAbi, signer);
      const id = await loanContract.NFTId();
      const loanamount = await loanContract.loanAmount();
      const interestrate = await loanContract.interestRate();
      const borrower = await loanContract.borrower();
      const expirationdate = await loanContract.loanExpiration();
      let d = new Date(0);
      d.setUTCSeconds(expirationdate.toString());
      console.log(d.getDay());

      setExpirationDate(d.toString());
      setBorrower(borrower.toString());
      setInterestRate(interestrate.toString());

      setAmount(loanamount.toString());

      const nftId = id.toString();

      const nftcontract = new ethers.Contract(
        "0x3b47042A391e5ab3722dD8eD5647c072cC05a40f",
        Nftabi,
        signer
      );

      const tokenURI = await nftcontract.tokenURI(nftId);
      setImageURI(tokenURI);
    };

    getNFT();
  }, []);

  console.log(borrower.length);

  return (
    <div>
      <Center py={6}>
        <Box
          h={"full"}
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          boxShadow={"2xl"}
          rounded={"md"}
          overflow={"hidden"}
        >
          <Image h={"120px"} w={"full"} src={imageURI} objectFit={"cover"} />

          <Box p={6}>
            <Stack spacing={0} align={"center"} mb={5}>
              <Text fontWeight={500} fontFamily={"body"}>
                Loan Amount $ {amount}
              </Text>
            </Stack>

            <Stack spacing={0} align={"center"} mb={5}>
              <Text fontWeight={500} fontFamily={"body"}>
                Interest Rate {interestRate} %
              </Text>
            </Stack>

            <Stack spacing={0} align={"center"} mb={5}>
              <Text fontWeight={500} fontFamily={"body"}>
                Borrower Address:
                {borrower.slice(0, 5) + "....." + borrower.slice(38, 41)}
              </Text>
            </Stack>

            <Stack spacing={0} align={"center"} mb={5}>
              <Text fontWeight={500} fontFamily={"body"}>
                Expiration Date: {expirationDate.slice(4, 15)}
              </Text>
            </Stack>

            <Button
              w={"full"}
              mt={8}
              bg={useColorModeValue("#151f21", "gray.900")}
              color={"white"}
              rounded={"md"}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              //   onClick={() => handleSizeClick("xl")}
            >
              Lend Loan
            </Button>
          </Box>
        </Box>
      </Center>
    </div>
  );
};

export default CardComponent;
