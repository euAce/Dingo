// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

import "./IBaseOrderUtils.sol";

interface IExchangeRouter {
    function multicall(bytes[] calldata data) external payable;

    function sendWnt(address to, uint256 amount) external;

    function createOrder(
        IBaseOrderUtils.CreateOrderParams calldata params
    ) external payable returns (bytes32);
}