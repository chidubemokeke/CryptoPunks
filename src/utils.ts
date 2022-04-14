import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import { CToken } from "../generated/schema";

export function getGlobalId(event: ethereum.Event): string {
  let globalId = event.transaction.hash
    .toHexString()
    .concat("-")
    .concat(event.logIndex.toString());
  return globalId;
}

export function getOwnerFromCToken(event: ethereum.Event): string {
  let cTokenLogIndex = event.logIndex.minus(BigInt.fromI32(1));
  let id = event.transaction.hash
    .toHexString()
    .concat("-")
    .concat(cTokenLogIndex.toString());

  let cToken = CToken.load(id);
  if (!cToken) {
    cToken = new CToken(id);
    cToken.blockNumber = event.block.number;
    cToken.referenceId = cToken.id;
    cToken.blockHash = event.block.hash;
    cToken.txHash = event.transaction.hash;
    cToken.timestamp = event.block.timestamp;
    cToken.save();
  }

  let owner = cToken.owner;

  return owner;
}