import "./Ownable.sol";
pragma solidity 0.5.12;

contract Flip is Ownable {

    uint public balance = 20000000000000000000;//paresInt(web3.utils.toWei('20',"ether"));

    function flipCoin() public payable {

      uint betAmmount = msg.value;

      if (random() == 1)
      {
        balance -= betAmmount;
        msg.sender.transfer(betAmmount*2);
      }
      else
      {
        balance += betAmmount;
      }
    }

    function random() private returns(uint) {
      return now % 2;
    }

    function withdrawAll() public onlyOwner returns(uint) {
        uint toTransfer = balance;
        balance = 0;
        msg.sender.transfer(toTransfer);
        return toTransfer;
    }
}
