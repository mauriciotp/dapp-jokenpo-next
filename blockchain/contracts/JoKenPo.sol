// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract JoKenPo {
    enum Options {
        NONE,
        ROCK,
        PAPER,
        SCISSORS
    } // 0, 1, 2, 3

    struct Player {
        address wallet;
        uint32 wins;
    }

    Options private choice1 = Options.NONE;
    address private player1;
    address payable public immutable owner;
    uint private bid = 0.01 ether;
    uint8 private commission = 10; // percent
    string private result = "";
    Player[] private players;

    constructor() {
        owner = payable(msg.sender);
    }

    function getResult() external view returns (string memory) {
        return result;
    }

    function getBid() external view returns (uint) {
        return bid;
    }

    function setBid(uint newBid) external {
        require(msg.sender == owner, "You do not have permission");
        require(
            player1 == address(0),
            "You cannot change the bid with a game in progress"
        );
        bid = newBid;
    }

    function getCommission() external view returns (uint8) {
        return commission;
    }

    function setCommission(uint8 newCommission) external {
        require(msg.sender == owner, "You do not have permission");
        require(
            player1 == address(0),
            "You cannot change the commission with a game in progress"
        );
        commission = newCommission;
    }

    function updateWinner(address winner) private {
        for (uint i = 0; i < players.length; i++) {
            if (players[i].wallet == winner) {
                players[i].wins++;
                return;
            }
        }

        players.push(Player(winner, 1));
    }

    function finishGame(string memory newResult, address winner) private {
        address contractAddress = address(this);
        payable(winner).transfer(
            (contractAddress.balance / 100) * (100 - commission)
        );
        owner.transfer(contractAddress.balance);

        updateWinner(winner);

        result = newResult;
        player1 = address(0);
        choice1 = Options.NONE;
    }

    function getBalance() external view returns (uint) {
        require(msg.sender == owner, "You do not have permission");
        return address(this).balance;
    }

    function play(Options newOption) external payable returns (string memory) {
        require(msg.sender != owner, "The owner cannot play");
        require(newOption != Options.NONE, "Invalid choice");
        require(msg.value >= bid, "Invalid bid");
        require(msg.sender != player1, "Wait the another player");

        if (choice1 == Options.NONE) {
            choice1 = newOption;
            player1 = msg.sender;
            result = "Player 1 already choose his/her option, waiting for player 2.";
        } else if (choice1 == Options.ROCK && newOption == Options.SCISSORS) {
            finishGame("Rock breaks scissors, player 1 won.", player1);
        } else if (choice1 == Options.PAPER && newOption == Options.ROCK) {
            finishGame("Paper wraps rock, player 1 won.", player1);
        } else if (choice1 == Options.SCISSORS && newOption == Options.PAPER) {
            finishGame("Scissors cuts paper, player 1 won.", player1);
        } else if (choice1 == Options.ROCK && newOption == Options.PAPER) {
            finishGame("Paper wraps rock, player 2 won.", msg.sender);
        } else if (choice1 == Options.PAPER && newOption == Options.SCISSORS) {
            finishGame("Scissors cuts paper, player 2 won.", msg.sender);
        } else if (choice1 == Options.SCISSORS && newOption == Options.ROCK) {
            finishGame("Rock breaks scissors, player 2 won.", msg.sender);
        } else {
            result = "Draw game. The prize was doubled.";
            choice1 = Options.NONE;
            player1 = address(0);
        }

        return result;
    }

    function getLeaderBoard() external view returns (Player[] memory) {
        if (players.length < 2) {
            return players;
        }

        Player[] memory arr = new Player[](players.length);

        for (uint i = 0; i < players.length; i++) {
            arr[i] = players[i];
        }

        for (uint i = 0; i < arr.length - 1; i++) {
            for (uint j = 0; j < arr.length - 1; j++) {
                if (arr[j].wins < arr[j + 1].wins) {
                    Player memory temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }

        return arr;
    }
}
