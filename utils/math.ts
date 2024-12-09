import { ethers } from "ethers";
import type { BigNumberish } from "ethers";
import Decimal from "decimal.js";

export const MAX_UINT8 = "255"; // 2^8 - 1
export const MAX_UINT32 = "4294967295"; // 2^32 - 1
export const MAX_UINT64 = "18446744073709551615"; // 2^64 - 1

export const FLOAT_PRECISION = expandDecimals(1, 30);

export function percentageToFloat(value: string) {
  if (value[value.length - 1] !== "%") {
    throw new Error("Invalid percentage input");
  }

  const trimmedValue = value.substring(0, value.length - 1);

  return ethers.parseUnits(trimmedValue, 28);
}

export function exponentToFloat(value: string) {
  if (!value.includes("e")) {
    throw new Error("Invalid exponent input");
  }

  const components = value.split("e");
  if (components.length !== 2) {
    throw new Error("Invalid exponent input");
  }

  const exponent = parseInt(components[1]);
  if (isNaN(exponent)) {
    throw new Error("Invalid exponent");
  }

  return ethers.parseUnits(components[0], 30 + exponent);
}

export function bigNumberify(n: BigNumberish) {
  return ethers.getBigInt(n);
}

export function expandDecimals(n: BigNumberish, decimals: number) {
  return bigNumberify(n) * (bigNumberify(10) ** BigInt(decimals));
}

export function decimalToFloat(value: BigNumberish, decimals = 0) {
  return expandDecimals(value, 30 - decimals);
}

export function applyFactor(n: BigNumberish, factor: BigNumberish) {
  return (bigNumberify(n) * bigNumberify(factor)) / FLOAT_PRECISION;
}

// both `base` and `exponent` should have 30 decimals
export function pow(base: BigNumberish, exponent: BigNumberish) {
  const baseDecimal = new Decimal(base.toString()).div(FLOAT_PRECISION.toString());
  const exponentDecimal = new Decimal(exponent.toString()).div(FLOAT_PRECISION.toString());

  return bigNumberify(baseDecimal.pow(exponentDecimal).mul(FLOAT_PRECISION.toString()).toFixed(0));
}

const limitDecimals = (amount: BigNumberish, maxDecimals: number) => {
  let amountStr = amount.toString();
  if (maxDecimals === undefined) {
    return amountStr;
  }
  if (maxDecimals === 0) {
    return amountStr.split(".")[0];
  }
  const dotIndex = amountStr.indexOf(".");
  if (dotIndex !== -1) {
    const decimals = amountStr.length - dotIndex - 1;
    if (decimals > maxDecimals) {
      amountStr = amountStr.substr(0, amountStr.length - (decimals - maxDecimals));
    }
  }
  return amountStr;
};

const padDecimals = (amount: BigNumberish, minDecimals: number) => {
  let amountStr = amount.toString();
  const dotIndex = amountStr.indexOf(".");
  if (dotIndex !== -1) {
    const decimals = amountStr.length - dotIndex - 1;
    if (decimals < minDecimals) {
      amountStr = amountStr.padEnd(amountStr.length + (minDecimals - decimals), "0");
    }
  } else {
    amountStr = amountStr + ".0000";
  }
  return amountStr;
};

function numberWithCommas(x: string) {
  if (!x) {
    return "...";
  }
  const parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function formatAmount(
  amount: BigNumberish,
  tokenDecimals: number,
  displayDecimals?: number,
  useCommas = false,
  defaultValue?: any
) {
  if (!defaultValue) {
    defaultValue = "...";
  }
  if (amount === undefined || amount.toString().length === 0) {
    return defaultValue;
  }
  if (displayDecimals === undefined) {
    displayDecimals = 4;
  }
  let amountStr = ethers.formatUnits(amount, tokenDecimals);
  amountStr = limitDecimals(amountStr, displayDecimals);
  if (displayDecimals !== 0) {
    amountStr = padDecimals(amountStr, displayDecimals);
  }
  if (useCommas) {
    return numberWithCommas(amountStr);
  }
  return amountStr;
}
