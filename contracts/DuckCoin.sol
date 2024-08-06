// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DuckCoin is ERC20 {

    constructor() ERC20("DuckCoin", "DUC"){
        _mint(msg.sender, 1000 * 10 ** 18);
    }
    
}