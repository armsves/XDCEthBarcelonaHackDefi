let countdown = 5; // Set the initial countdown value (in seconds)
const updateCountdown = () => {
    countdown--;
    if (countdown === 0) {
        countdown = 5; // Reset the countdown
        fetchCryptoData(); // Fetch new data
    }
    //document.getElementById('countdown').innerText = "Refresh in " + countdown.toString() + " seconds";
};

const fetchCryptoData = () => {
    const apiUrl = 'https://bitrue.armsves.workers.dev';
    fetch(apiUrl, {})
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let priceTicker = document.getElementById("price-ticker");
            if (priceTicker !== null) {
                document.getElementById("price-ticker").innerHTML = "Current Price: " + data.price + " USDT/XDC";
            }
        })
        .catch(error => {
            console.log('Error fetching crypto data:', error);
        });
};
setInterval(updateCountdown, 1000);
fetchCryptoData();

const web3 = new Web3(window.ethereum);
const contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "borrower",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "CollateralWithdrawn",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "depositor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Deposit",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "depositor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "interest",
				"type": "uint256"
			}
		],
		"name": "InterestPaid",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "borrower",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "LoanCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "borrower",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "LoanRepaid",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "INTEREST_RATE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "LTV_RATIO",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "collateral",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "createLoan",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "depositCollateral",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "getLoanDetails",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "interestEarned",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "loans",
		"outputs": [
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "collateral",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "repayLoan",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalPool",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdrawCollateral",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]; // Add contract ABI here
        const contractAddress = "0x5c3B43EBc9358072B3227B56866449DD618ad7Ef"; // Add contract address here
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        let accounts = [];

        async function showConnect() {
            accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Connected: ", accounts[0]);

            //let balance = await web3.eth.getBalance(accounts[0]).then(console.log);
            web3.eth.getChainId().then(console.log);
            document.getElementById("connectButton").innerHTML = accounts[0].substr(0, 2) + "..." + accounts[0].substr(-4);
            document.getElementById("connectButton").style.backgroundColor = '#1e2e9e';
            balance = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]), 'ether');
            //document.getElementById("depositMaxButton").innerHTML = "Deposit Max XDC (max is:" + balance;
            loadLoanDetails()
            updateBalance()
            window.ethereum.on('accountsChanged', function (accounts) {
                // Time to reload your interface with accounts[0]!
                console.log("Account changed: ", accounts[0]);
                 loadLoanDetails();  // Add this line at the end of the function

            });

        }
        async function deposit() {
            await contract.methods.deposit().send({ from: accounts[0], value: web3.utils.toWei('1', 'ether') });
            console.log("Deposit successful");
        }

async function updateBalance() {
    balance = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]), 'ether');
    //document.getElementById("depositMaxButton").innerHTML = "Deposit Max XDC (max is:" + balance;
    document.getElementById("balance").innerHTML = "Balance: " + parseFloat(balance).toFixed(4) + " XDC";
    console.log("Balance is: ", balance);
}

async function connect() {
    accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    showConnect()
}

async function createLoan() {
    const loanAmount = document.getElementById('loanAmountInput').value;
    await contract.methods.createLoan(web3.utils.toWei(loanAmount, 'ether')).send({ from: accounts[0] });
    updateBalance()
    console.log("Loan created");
}

async function depositCollateral() {
    await contract.methods.depositCollateral().send({ from: accounts[0], value: web3.utils.toWei('1', 'ether') });
    updateBalance()
    console.log("Collateral deposit successful");
}

        async function repayLoan() {
            let result = await contract.methods.getLoanDetails(accounts[0]).call();
            if (result[0]===false) return console.log("No active loan found");
            await contract.methods.repayLoan().send({ from: accounts[0], value: result[1] });
            console.log("Loan repaid");
        }

        async function withdrawCollateral() {
            const collateralBalance = await contract.methods.collateral(accounts[0]).call();
            await contract.methods.withdrawCollateral(collateralBalance).send({ from: accounts[0] });
            console.log("Collateral withdrawn");
        }

        async function loadLoanDetails() {
            let result = await contract.methods.getLoanDetails(accounts[0]).call();
            const collateralBalance = await contract.methods.collateral(accounts[0]).call();
            //const loanAmountInEth = web3.utils.fromWei(amount, 'ether');
            let loanDetailsText = "No active loan.";
            if (result[0]) {
                loanDetailsText = `Active loan amount: ${result[1]} XDC`;
            }
            document.getElementById('loanDetails').innerHTML = loanDetailsText;
            console.log("cola",collateralBalance)
            document.getElementById('collateralBalanceI').innerHTML = `${collateralBalance}`;
        }


        document.getElementById('connectButton').addEventListener('click', connect);
        document.getElementById('depositButton').addEventListener('click', deposit);
        document.getElementById('depositCollateralButton').addEventListener('click', depositCollateral);
        document.getElementById('createLoanButton').addEventListener('click', createLoan);
        document.getElementById('repayLoanButton').addEventListener('click', repayLoan);
        document.getElementById('withdrawCollateralButton').addEventListener('click', withdrawCollateral);


		window.onload = function () {
			var lines = document.querySelectorAll('.typewriter-text');
			var delay = 0;

			lines.forEach(function (line) {
				setTimeout(function () {
					line.style.animation = 'typing 3.5s steps(40, end), blink-caret .75s step-end infinite';
				}, delay);
				delay += 3500; // This delay should match the duration of your typing animation
			});
		}
