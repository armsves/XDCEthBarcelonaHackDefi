// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EthLendingPool {
    uint256 public totalPool;
    mapping(address => uint256) public collateral;

    // Loan to Value ratio (e.g. 70% LTV -> 0.7)
    uint256 public constant LTV_RATIO = 7e17;
    uint256 public constant INTEREST_RATE = 5; // 5%


    struct Loan {
        bool isActive;
        uint256 amount;
        uint256 collateral;
    }

    mapping(address => Loan) public loans;

    event Deposit(address indexed depositor, uint256 amount);
    event LoanCreated(address indexed borrower, uint256 amount);
    event LoanRepaid(address indexed borrower, uint256 amount);
    event CollateralWithdrawn(address indexed borrower, uint256 amount);

    function deposit() external payable {
        require(msg.value > 0, "Deposit must be greater than 0");
        totalPool += msg.value;

        emit Deposit(msg.sender, msg.value);
    }

    function depositCollateral() external payable {
        require(msg.value > 0, "Collateral must be greater than 0");
        collateral[msg.sender] += msg.value;
    }

    function createLoan(uint256 amount) external {
        require(collateral[msg.sender] * LTV_RATIO / 1e18 >= amount, "Insufficient collateral for this loan amount");
        require(totalPool >= amount, "Not enough funds in the pool");

        totalPool -= amount;
        loans[msg.sender] = Loan({
            isActive: true,
            amount: amount,
            collateral: collateral[msg.sender]
        });

        payable(msg.sender).transfer(amount);
        emit LoanCreated(msg.sender, amount);
    }

    function repayLoan() external payable {
        Loan storage loan = loans[msg.sender];
        require(loan.isActive, "No active loan found");
        require(msg.value >= loan.amount, "Payment not enough to cover the loan");

        totalPool += msg.value;
        loan.isActive = false;
        emit LoanRepaid(msg.sender, loan.amount);
    }

   function withdrawCollateral(uint256 amount) external {
    require(collateral[msg.sender] >= amount, "Not enough collateral available");
    require(!loans[msg.sender].isActive, "Can't withdraw collateral while a loan is active");

    uint256 fee = (amount * INTEREST_RATE) / 100; // 5% fee
    require(collateral[msg.sender] >= amount + fee, "Not enough collateral available for withdrawal and fee");

    collateral[msg.sender] -= (amount + fee);
    totalPool += fee;

    payable(msg.sender).transfer(amount);
    emit CollateralWithdrawn(msg.sender, amount);
}


    function getLoanDetails(address account) external view returns(bool, uint256) {
    Loan storage loan = loans[account];
    return (loan.isActive, loan.amount);
    }

}


