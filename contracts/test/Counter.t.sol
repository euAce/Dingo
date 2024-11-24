// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Counter} from "../src/Counter.sol";

contract CounterTest is Test {
    Counter public counter;
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");

    function setUp() public {
        counter = new Counter();
    }

    function testSetUserCounter() public {
        counter.setUserCounter(42);
        assertEq(counter.getUserCounter(address(this)), 42);
    }

    function testIncrementUserCounter() public {
        counter.setUserCounter(1);
        counter.incrementUserCounter();
        assertEq(counter.getUserCounter(address(this)), 2);
    }

    function testMultipleUsers() public {
        vm.prank(alice);
        counter.setUserCounter(1);

        vm.prank(bob);
        counter.setUserCounter(2);

        assertEq(counter.getUserCounter(alice), 1);
        assertEq(counter.getUserCounter(bob), 2);
    }

    function testUserCounterIncrement() public {
        vm.startPrank(alice);
        counter.setUserCounter(1);
        counter.incrementUserCounter();
        counter.incrementUserCounter();
        vm.stopPrank();

        assertEq(counter.getUserCounter(alice), 3);
    }

    function testFuzz_SetUserCounter(uint256 x) public {
        counter.setUserCounter(x);
        assertEq(counter.getUserCounter(address(this)), x);
    }
}
