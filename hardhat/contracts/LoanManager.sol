// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./Loans.sol";

contract LoanManager {
    address public owner;

    mapping(address => address[]) public borrowerLoans;
    mapping(address => bool) public activeLoans;
    address[] public allLoans; // Mapping to display all created loans

    event LoanCreated(address indexed borrower, address loanContract);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createLoan(
        uint256 loanAmount,
        uint256 interestRate,
        address _nft,
        uint256 _nftid,
        uint256 loanExpiration
    ) external {
        require(
            !activeLoans[msg.sender],
            "Borrower already has an active loan"
        );

        // transfer nft to contract
        IERC721 nftContract = IERC721(_nft);
        require(
            nftContract.ownerOf(_nftid) == address(this),
            "LoanManager: NFT is not transferred to contract"
        );

        // Create Aave-backed LoanContract
        address loanContract = address(
            new Loans(
                msg.sender,
                address(this),
                loanAmount,
                interestRate,
                _nft,
                _nftid,
                loanExpiration
            )
        );

        borrowerLoans[msg.sender].push(loanContract);
        activeLoans[msg.sender] = true;
        nftContract.transferFrom(address(this), loanContract, _nftid);
        allLoans.push(loanContract); // Add the loan to the mapping
        emit LoanCreated(msg.sender, loanContract);
    }

    function getBorrowerLoans() external view returns (address[] memory) {
        return borrowerLoans[msg.sender];
    }

    function setActiveLoans(address borrower, bool status) external {
        activeLoans[borrower] = status;
    }

    function getAllLoansLength() external view returns (uint256) {
        return allLoans.length;
    }
}
