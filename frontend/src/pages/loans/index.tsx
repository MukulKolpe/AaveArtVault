// @ts-nocheck comment
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import LoanManager from "../../../utils/LoanManager.json";

export default function Loans() {
  const [loans, setLoans] = useState([]);
  useEffect(() => {
    const getLoans = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x5A338E380Cb541b825f49901050cC9C862d39Ccf",
        LoanManager,
        signer
      );

      for (let i = 0; i < 2; i++) {
        const loan = await contract.allLoans(i);
      }
    };
    getLoans();
  }, []);

  console.log(loans);

  return <div>Loans</div>;
}
