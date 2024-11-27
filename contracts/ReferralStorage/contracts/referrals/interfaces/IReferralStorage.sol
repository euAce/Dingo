// SPDX-License-Identifier: MIT

pragma solidity 0.8.27;

interface IReferralStorage {
    function setTraderReferralCode(address _account, bytes32 _code) external;
    function getTraderReferralInfo(address _account) external view returns (bytes32, address);
}
