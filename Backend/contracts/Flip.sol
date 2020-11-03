import "./Ownable.sol";
pragma solidity 0.5.12;

contract Flip is Ownable {

    uint public balance = address(this).balance;

    function flipCoin(uint betOption) public payable {

      require(msg.value < balance, "bet ammount must be lower than contract balance");

      uint betAmmount = msg.value;
      bool outcome;

      if (random() == betOption)
      {
        balance -= betAmmount;
        msg.sender.transfer(betAmmount*2);
        outcome = true;
      }
      else
      {
        balance += betAmmount;
        outcome = false;
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
