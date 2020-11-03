var web3 = new Web3(Web3.givenProvider);
var contractAddress = "0xd1fEFB53353f74F7F7f48feDf4f4DcEAE11e9C9E";
var contractInstance, acc;

$(document).ready(async function() {
    window.ethereum.enable().then(function(accounts){
      contractInstance = new web3.eth.Contract(abi, contractAddress, {from: accounts[0]})

      console.log(contractInstance);
    })
    .then(async function(){

      acc = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      getUserBalance();
    });

    $("#bet_heads_button").click(function() { placeBet(0); });
    $("#bet_tails_button").click(function() { placeBet(1); });
});

function placeBet(betOption) {
  var betAmmount = $("#bet_input").val();
  console.log("user has bet on: " + betOption);

  //This sort of validation I would usually do in the backend. As some cheeky user might just remove this bit of code using the browser inspector.
  //In the same time, I saw some solutions in Solidity for converting strings to int or checking if strings can be converted to int. But to me personally it would seem as a waste of gas to perfrom such operations in a smart contracts.
  //Ideally I would have a middle layer in the backed that would actually be called by the front-end, which would execute all necessary validation on the input data and only afterwards, if data is valid, I would call the smart contract.
  if (isNaN(betAmmount) || !betAmmount || betAmmount <= 0){
    alert("Please provide the input as a postive number");
    return false;
  }

  var config = {
    value: web3.utils.toWei(betAmmount,"ether")
  };

  contractInstance.methods.flipCoin(betOption).send(config)
    .then(function() {
      getUserBalance();
    });
}

function getUserBalance(){

  let balance;
  web3.eth.getBalance(acc[0]).then((bal) => {
      $("#eth_ammount").text(web3.utils.fromWei(bal));
      $("#eth_address").text(acc[0]);
    });
  web3.eth.getBalance(contractAddress).then((bal) => {
      $("#contract_ballance").text(web3.utils.fromWei(bal));
    });
}
