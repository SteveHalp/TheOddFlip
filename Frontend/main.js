var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
        contractInstance = new web3.eth.Contract(abi, "0x55795dBB92D0E3Dff089CE6EC8A3fbb5E28a0331", {from: accounts[0]});
        console.log(contractInstance);
    });
    $("#bet_button").click(placeBet);
});

function placeBet() {
  var betAmmount = $("#bet_input").val();

  //This sort of validation I would usually do in the backend. As some cheeky user might just remove this bit of code using the browser inspector.
  //In the same time, I saw some solutions in Solidity for converting strings to int or checking if strings can be converted to int. But to me personally it would seem as a waste of gas to perfrom such operations in a smart contracts.
  //Ideally I would have a middle layer in the backed that would actually be called by the front-end, which would execute all necessary validation on the input data and only afterwards, if data is valid, I would call the smart contract.
  if (isNaN(betAmmount)){
         alert("Please provide the input as a number");
         return false;
      }

  var config = {
    value: web3.utils.toWei(betAmmount,"ether")
  };

  contractInstance.methods.flipCoin().send(config);
}
