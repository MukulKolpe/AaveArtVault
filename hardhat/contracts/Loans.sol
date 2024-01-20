// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IVariableDebtToken} from "./IVariableDebtToken.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "./LoanManager.sol";

contract Loans {
    address public borrower;
    uint256 public loanAmount;
    uint256 public remainingAmount;
    uint256 public interestRate;
    address public collateralNFT;
    address public lender;
    uint256 public NFTId;
    address public loanManager;

    IPoolAddressesProvider public ADDRESSES_PROVIDER =
        IPoolAddressesProvider(0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A);
    IVariableDebtToken public sGho =
        IVariableDebtToken(0x67ae46EF043F7A4508BD1d6B94DB6c33F0915844);
    IPool public POOL = IPool(ADDRESSES_PROVIDER.getPool());
    address private daiAddress = 0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357;
    address public GHO_TOKEN = 0xc4bF5CbDaBE595361438F8c6a187bDc330539c60;
    IERC20 private dai = IERC20(daiAddress);

    mapping(address => uint256) public paidInstallments;
    uint256 public loanExpiration;

    event LoanPaid(
        address indexed borrower,
        uint256 amountPaid,
        uint256 remainingAmount
    );

    modifier loanNotPaid() {
        require(remainingAmount > 0, "Loan already paid");
        _;
    }

    modifier loanNotExpired() {
        require(block.timestamp <= loanExpiration, "Loan has expired");
        _;
    }

    modifier checkGhoAllowance(uint amount) {
        require(
            IERC20(GHO_TOKEN).allowance(msg.sender, address(this)) >= amount,
            "Error"
        );
        _;
    }

    constructor(
        address _borrower,
        address _loanManager,
        uint256 _loanAmount,
        uint256 _interestRate,
        address _nft,
        uint256 _nftid,
        uint256 _loanExpiration
    ) {
        borrower = _borrower;
        loanManager = _loanManager;
        loanAmount = _loanAmount;
        remainingAmount = _loanAmount;
        interestRate = _interestRate;
        collateralNFT = _nft;
        NFTId = _nftid;
        loanExpiration = _loanExpiration; // User-selected expiration date
    }

    function checkAndTransferCollateral() external loanNotExpired {
        require(remainingAmount > 0, "Loan is fully paid");
        // Transfer collateral to the lender
        IERC721(collateralNFT).transferFrom(address(this), lender, NFTId);
    }

    //need to approve appropriate amount of GHO before approval
    function makePayment(
        address _lender,
        uint256 _amount
    ) external payable loanNotPaid checkGhoAllowance(_amount) {
        IERC20(GHO_TOKEN).transferFrom(msg.sender, address(this), _amount);
        uint256 ghobalance = IERC20(GHO_TOKEN).balanceOf(address(this));
        require(
            ghobalance == remainingAmount,
            "Loan amount is less than remaining amount"
        );
        IERC20(GHO_TOKEN).transfer(_lender, ghobalance);
        IERC721(collateralNFT).transferFrom(address(this), borrower, NFTId);
    }

    function approvedai() external returns (bool) {
        return dai.approve(address(POOL), loanAmount);
    }

    function lendLoan(address _lender) external payable {
        lender = _lender;
        POOL.supply(daiAddress, loanAmount, _lender, 0);
        //delegrate credit
        sGho.approveDelegation(address(this), loanAmount);
        POOL.borrow(GHO_TOKEN, loanAmount, 2, 0, _lender);
        uint256 ghobalance = IERC20(GHO_TOKEN).balanceOf(address(this));
        IERC20(GHO_TOKEN).transfer(borrower, ghobalance);
    }
}
