// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract USDB is ERC20, AccessControl, ERC20Permit {

    constructor(address defaultAdmin)
        ERC20("USDB", "USDB")
        ERC20Permit("USDB")
    {
        _mint(msg.sender, 1000000 * 10 ** decimals());
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
