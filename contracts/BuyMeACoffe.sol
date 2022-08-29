// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

// Contract deployed to goerli at 0x0a409e1f1C77B0a193042638dEadCeaB929bE5e8
import "@openzeppelin/contracts/access/Ownable.sol";

contract BuyMeACoffee is Ownable {
    enum CoffeSize {
        None,
        Small,
        Medium,
        Large
    }

    // Event to emit when a Memo is created
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message,
        CoffeSize size
    );

    // Memo struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
        CoffeSize size;
    }

    // List of all memos received from friends
    Memo[] memos;

    /**
     * @dev buy a coffee for contract owner
     * @param _name name of the coffee buyer
     * @param _message a nice message from the coffee buyer
     */
    function buyCoffee(
        string memory _name,
        string memory _message,
        CoffeSize _size
    ) public payable {
        require(msg.value > 0, "Can't buy a coffee with 0 eth");

        // add the memo to storage
        memos.push(Memo(msg.sender, block.timestamp, _name, _message, _size));

        // Emit a log event when a new memo is created!
        emit NewMemo(msg.sender, block.timestamp, _name, _message, _size);
    }

    /**
     * @dev send the entire balance stored in this contract to the owner
     */
    function withdrawtips() public onlyOwner {
        require(payable(address(owner())).send(address(this).balance));
    }

    /**
     * @dev retriev all the memos received stored on the blockchain
     */
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }
}
