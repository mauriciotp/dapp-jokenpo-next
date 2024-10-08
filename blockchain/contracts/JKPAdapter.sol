// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "./IJoKenPo.sol";
import "./JKPLibrary.sol";

contract JKPAdapter {
    IJoKenPo private joKenPo;
    address public immutable owner;

    event Played(address indexed player, string result);

    constructor() {
        owner = msg.sender;
    }

    function getImplementationAddress() external view returns (address) {
        return address(joKenPo);
    }

    function getResult() external view upgraded returns (string memory) {
        return joKenPo.getResult();
    }

    function getBid() external view upgraded returns (uint) {
        return joKenPo.getBid();
    }

    function getCommission() external view upgraded returns (uint8) {
        return joKenPo.getCommission();
    }

    function setBid(uint newBid) external upgraded {
        joKenPo.setBid(newBid);
    }

    function setCommission(uint8 newCommission) external upgraded {
        joKenPo.setCommission(newCommission);
    }

    function getBalance() external view upgraded returns (uint) {
        return joKenPo.getBalance();
    }

    function play(JKPLibrary.Options newOption) external payable upgraded {
        string memory result = joKenPo.play{value: msg.value}(newOption);
        emit Played(msg.sender, result);
    }

    function getLeaderboard()
        external
        view
        upgraded
        returns (JKPLibrary.Player[] memory)
    {
        return joKenPo.getLeaderboard();
    }

    function upgrade(address newImplementation) external restricted {
        require(address(0) != newImplementation, "The address is required");
        joKenPo = IJoKenPo(newImplementation);
    }

    modifier restricted() {
        require(owner == msg.sender, "You do not have permission");
        _;
    }

    modifier upgraded() {
        require(address(joKenPo) != address(0), "You must upgrade first");
        _;
    }
}
