// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./JKPLibrary.sol";

interface IJoKenPo {
    function getResult() external view returns (string memory);

    function getBid() external view returns (uint256);

    function getCommission() external view returns (uint8);

    function getBalance() external view returns (uint256);

    function getLeaderBoard()
        external
        view
        returns (JKPLibrary.Player[] memory);

    function setBid(uint256 newBid) external;

    function setCommission(uint8 newCommission) external;

    function play(
        JKPLibrary.Options newChoice
    ) external payable returns (string memory);
}
