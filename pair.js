const web3 = new Web3(window.ethereum);


// Replace with your contract addresses

// Contract instances

// Accounts array
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
  window.ethereum.on('accountsChanged', function (accounts) {
      // Time to reload your interface with accounts[0]!
      console.log("Account changed: ", accounts[0]);

  });

}
async function connect() {
  accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  showConnect()
}

document.getElementById('connectButton').addEventListener('click', connect);


window.onload = function() {
  let oracleFactoryContract;

fetch('oracleFactory.json')
  .then(response => response.json())
  .then(oracleFactory => {
    oracleFactoryContract = new web3.eth.Contract(oracleFactory.abi, oracleFactory.address);
  })
  .catch(error => console.error(error));

  fetch('tokens.json')
    .then(response => response.json())
    .then(tokens => {
      const fromTokenDropdown = document.querySelector('#fromTokenDropdown .menu');
      const toTokenDropdown = document.querySelector('#toTokenDropdown .menu');

      tokens.forEach(token => {
        const optionA = document.createElement('div');
        optionA.className = 'item';
        optionA.dataset.value = token.tokenAddress;
        optionA.dataset.oracleAddress = token.oracleAddress;
        optionA.textContent = token.symbol;

        const optionB = optionA.cloneNode(true);

        fromTokenDropdown.appendChild(optionA);
        toTokenDropdown.appendChild(optionB);
      });

      // Initialize dropdowns with Semantic UI
      $('.ui.dropdown').dropdown();
    })
    .catch(error => console.error(error));



let routerContract;

fetch('router.json')
  .then(response => response.json())
  .then(router => {
    routerContract = new web3.eth.Contract(router.abi, router.address);
  })
  .catch(error => console.error(error));





  document.getElementById("createPairButton").addEventListener("click", function() {
    const fromTokenAddress = document.querySelector("#fromTokenDropdown input[name='fromToken']").value;
    const toTokenAddress = document.querySelector("#toTokenDropdown input[name='toToken']").value;

    // Check if same token is selected in both dropdowns
    if(fromTokenAddress === toTokenAddress) {
      alert('Cannot select the same token for both sides of the pair');
      return;
    }

    const fromOracleAddress = document.querySelector(`#fromTokenDropdown .menu .item[data-value='${fromTokenAddress}']`).dataset.oracleAddress;
    const toOracleAddress = document.querySelector(`#toTokenDropdown .menu .item[data-value='${toTokenAddress}']`).dataset.oracleAddress;

    // Now you have your selected token addresses and their corresponding oracle addresses
    // You can use these to interact with your smart contracts
    console.log(fromTokenAddress, toTokenAddress, fromOracleAddress, toOracleAddress);

    const amountADesired = web3.utils.toWei('1', 'ether'); // Example: 1 tokenA
    const amountBDesired = web3.utils.toWei('1', 'ether'); // Example: 1 tokenB

    routerContract.methods.addLiquidity(
      fromTokenAddress,
      toTokenAddress,
      amountADesired,
      amountBDesired,
      accounts[0] // destination address
    ).send({ from: accounts[0] })
      .on('receipt', (receipt) => {
        console.log(receipt);
      })
      .on('error', (error) => {
        console.error(error);
      });
  });


};
