//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../src/token/USDB.sol";
import "../src/gnosis/ConditionalTokens.sol";
import "../src/gnosis/FixedProductMarketMakerFactory.sol";
import "../src/ChallengeManager.sol";
import "./DeployHelpers.s.sol";

contract DeployScript is ScaffoldETHDeploy {
  error InvalidPrivateKey(string);

  function run() external {
    uint256 deployerPrivateKey = setupLocalhostEnv();
    if (deployerPrivateKey == 0) {
      revert InvalidPrivateKey(
        "You don't have a deployer account. Make sure you have set DEPLOYER_PRIVATE_KEY in .env or use `yarn generate` to generate a new random account"
      );
    }
    vm.startBroadcast(deployerPrivateKey);

    address deployer = vm.addr(deployerPrivateKey);

    USDB usdb = new USDB(deployer);
    console.logString(
      string.concat(
        "USDB deployed at: ", vm.toString(address(usdb))
      )
    );

    ConditionalTokens conditionalTokens = new ConditionalTokens();
    console.logString(
      string.concat(
        "ConditionalTokens deployed at: ", vm.toString(address(conditionalTokens))
      )
    );

    FixedProductMarketMakerFactory fixedProductMarketMakerFactory = new FixedProductMarketMakerFactory();
    console.logString(
      string.concat(
        "FixedProductMarketMakerFactory deployed at: ", vm.toString(address(fixedProductMarketMakerFactory))
      )
    );

    ChallengeManager challengeManager = new ChallengeManager(
      block.timestamp,
      deployer,
      address(conditionalTokens),
      address(usdb),
      address(fixedProductMarketMakerFactory)
    );
    console.logString(
      string.concat(
        "ChallengeManager deployed at: ", vm.toString(address(challengeManager))
      )
    );

    vm.stopBroadcast();

    /**
     * This function generates the file containing the contracts Abi definitions.
     * These definitions are used to derive the types needed in the custom scaffold-eth hooks, for example.
     * This function should be called last.
     */
    exportDeployments();
  }

  function test() public { }
}
