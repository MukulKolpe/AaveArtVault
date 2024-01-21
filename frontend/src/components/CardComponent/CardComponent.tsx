// @ts-nocheck comment\
import { useAccount } from "wagmi";
import {
  Heading,
  HStack,
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
  useToast,
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
import DAIAbi from "../../../utils/DAI.json";
import DebtTokenAbi from "../../../utils/DebtToken.json";
import { ethers } from "ethers";

const CardComponent = ({ address }) => {
  const [imageURI, setImageURI] = useState("");
  const [amount, setAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [borrower, setBorrower] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [size, setSize] = useState("md");
  const [currentStep, setCurrentStep] = useState(1);
  const [daiTransfered, setDaiTransfered] = useState(false);
  const [daiTransferedHash, setDaiTransferedHash] = useState("");
  const [daiApproved, setDaiApproved] = useState(false);
  const [daiApprovedHash, setDaiApprovedHash] = useState("");
  const [daiDelegated, setDaiDelegated] = useState(false);
  const [isLendLoan, setisLendLoan] = useState(false);
  const [isLendLoanHash, setisLendLoanHash] = useState("");

  const { address: userAddress } = useAccount();

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const tranferDAI = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const daiContract = new ethers.Contract(
      "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357",
      DAIAbi,
      signer
    );

    const tx = await daiContract.transfer(address, amount);

    const receipt = await tx.wait();
    setDaiTransfered(true);
    setDaiTransferedHash(tx.hash);
  };

  const approveDai = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const loanContract = new ethers.Contract(address, LoansAbi, signer);
    const tx = await loanContract.approvedai();
    const receipt = await tx.wait();
    setDaiApproved(true);
    setDaiApprovedHash(tx.hash);
  };

  const delegateCredit = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const ghoDebtTokenContract = new ethers.Contract(
      "0x67ae46EF043F7A4508BD1d6B94DB6c33F0915844",
      DebtTokenAbi,
      signer
    );

    console.log(ghoDebtTokenContract);

    const tx = await ghoDebtTokenContract.approveDelegation(address, amount);

    const receipt = await tx.wait();
    setDaiDelegated(true);
  };

  const lendLoan = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const loanContract = new ethers.Contract(address, LoansAbi, signer);
    const tx = await loanContract.lendLoan(userAddress);
    const receipt = await tx.wait();
    console.log(receipt);

    setisLendLoan(true);
    setisLendLoanHash(tx.hash);
  };

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const renderDot = (step) => {
    const isCompleted = step <= currentStep;
    return (
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: isCompleted ? "#90CDF4" : "gray",
          marginRight: "8px",
        }}
      />
    );
  };

  const renderStepContent = () => {
    return (
      <VStack spacing={4} align="stretch">
        <HStack mb={4}>{[1, 2, 3, 4].map((step) => renderDot(step))}</HStack>
        {currentStep === 1 && (
          <>
            <Button
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              onClick={tranferDAI}
              variant="outline"
              colorScheme="blue"
              mb={4}
            >
              Step 1: Transfer Dai
            </Button>
            {daiTransfered && (
              <Text fontWeight={500} fontFamily={"body"}>
                Dai Transfered Successfully
              </Text>
            )}
            <HStack spacing={4}>
              <Button onClick={handleNextStep}>Next Step</Button>
            </HStack>
          </>
        )}
        {currentStep === 2 && (
          <>
            <Button
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              variant="outline"
              colorScheme="blue"
              onClick={approveDai}
              mb={4}
            >
              Step 2: Approve DAI to AAVE Lending Pool
            </Button>
            {daiApproved && (
              <Text fontWeight={500} fontFamily={"body"}>
                Dai Approved Successfully
              </Text>
            )}
            <HStack spacing={4}>
              <Button onClick={handlePrevStep}>Back</Button>
              <Button onClick={handleNextStep}>Next</Button>
            </HStack>
          </>
        )}
        {currentStep === 3 && (
          <>
            <Button
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              variant="outline"
              colorScheme="blue"
              onClick={delegateCredit}
              mb={4}
            >
              Step 3: Delgiate Credit
            </Button>
            {daiDelegated && (
              <Text fontWeight={500} fontFamily={"body"}>
                Dai Delegated Successfully
              </Text>
            )}
            <HStack spacing={4}>
              <Button onClick={handlePrevStep}>Back</Button>
              <Button onClick={handleNextStep}>Next</Button>
            </HStack>
          </>
        )}
        {currentStep === 4 && (
          <>
            <Button
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              variant="outline"
              colorScheme="blue"
              mb={4}
              onClick={lendLoan}
            >
              Step 4: Confirm Transaction
            </Button>
            {isLendLoan && (
              <>
                <Text fontWeight={500} fontFamily={"body"}>
                  Loan Lended Successfully
                </Text>
                <Button>
                  {" "}
                  <a
                    href={`https://sepolia.etherscan.io/tx/${isLendLoanHash}`}
                    target="_blank"
                  >
                    View Transaction
                  </a>
                </Button>
              </>
            )}
            <HStack spacing={4}>
              <Button onClick={handlePrevStep}>Back</Button>
            </HStack>
          </>
        )}
      </VStack>
    );
  };

  const handleSizeClick = (newSize: string) => {
    setSize(newSize);

    onOpen();
  };

  const toast = useToast();
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
                Loan Amount $ {amount / 1e18}
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
              onClick={() => handleSizeClick("xl")}
            >
              Lend Loan
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Lend Loan</ModalHeader>
                <ModalCloseButton />
                <ModalBody>{renderStepContent()}</ModalBody>

                <ModalFooter></ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        </Box>
      </Center>
    </div>
  );
};

export default CardComponent;
