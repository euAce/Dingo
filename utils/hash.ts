import { ethers } from "ethers";
const { keccak256, toUtf8Bytes } = ethers;

export function encodeData(dataTypes: string[], dataValues: any[]) {
  const bytes = ethers.solidityPacked(dataTypes, dataValues);
  return ethers.hexlify(bytes);
}

export function hashData(dataTypes: string[], dataValues: any[]) {
  const bytes = ethers.solidityPacked(dataTypes, dataValues);
  const hash = ethers.keccak256(ethers.getBytes(bytes));

  return hash;
}

export function hashString(string: string) {
  return hashData(["string"], [string]);
}

export function keccakString(string: string) {
  return keccak256(toUtf8Bytes(string));
}
