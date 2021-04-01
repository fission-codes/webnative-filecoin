// This file extracted from @zondax/filecoin-signing-tools
// That package contains dependencies that break our code, so we just pull out the relevant bits
import blake from 'blakejs'
import { util as cbor } from 'ipld-dag-cbor';
import lowercaseKeys from 'lowercase-keys'
import base32Decode from 'base32-decode'
import BN from 'bn.js'
import leb from 'leb128'
import { MessageBody } from '../types';

const CID_PREFIX = Buffer.from([0x01, 0x71, 0xa0, 0xe4, 0x02, 0x20]);

export const getCID = (message: Uint8Array): Buffer => {
  const blakeCtx = blake.blake2bInit(32);
  blake.blake2bUpdate(blakeCtx, message);
  const hash = Buffer.from(blake.blake2bFinal(blakeCtx));
  return Buffer.concat([CID_PREFIX, hash]);
}


export const transactionSerializeRaw = (msg: MessageBody): Uint8Array => {
  const message = lowercaseKeys(msg);

  if (!("to" in message) || typeof message.to !== "string") {
    throw new Error("'to' is a required field and has to be a 'string'");
  }
  if (!("from" in message) || typeof message.from !== "string") {
    throw new Error("'from' is a required field and has to be a 'string'");
  }
  if (!("nonce" in message) || typeof message.nonce !== "number") {
    throw new Error("'nonce' is a required field and has to be a 'number'");
  }
  if (
    !("value" in message) ||
    typeof message.value !== "string" ||
    message.value === "" ||
    message.value.includes("-")
  ) {
    throw new Error(
      "'value' is a required field and has to be a 'string' but not empty or negative"
    );
  }
  if (!("gasfeecap" in message) || typeof message.gasfeecap !== "string") {
    throw new Error("'gasfeecap' is a required field and has to be a 'string'");
  }
  if (!("gaspremium" in message) || typeof message.gaspremium !== "string") {
    throw new Error(
      "'gaspremium' is a required field and has to be a 'string'"
    );
  }
  if (!("gaslimit" in message) || typeof message.gaslimit !== "number") {
    throw new Error("'gaslimit' is a required field and has to be a 'number'");
  }
  if (!("method" in message) || typeof message.method !== "number") {
    throw new Error("'method' is a required field and has to be a 'number'");
  }
  if (!("params" in message) || typeof message.params !== "string") {
    throw new Error("'params' is a required field and has to be a 'string'");
  }

  const to = addressAsBytes(message.to);
  const from = addressAsBytes(message.from);

  const value = serializeBigNum(message.value);
  const gasfeecap = serializeBigNum(message.gasfeecap);
  const gaspremium = serializeBigNum(message.gaspremium);

  const messageToEncode = [
    0,
    to,
    from,
    message.nonce,
    value,
    message.gaslimit,
    gasfeecap,
    gaspremium,
    message.method,
    Buffer.from(message.params, "base64"),
  ];

  return cbor.serialize(messageToEncode);
}


const addressAsBytes = (address: string): Buffer => {
  let addressDecoded, payload, checksum;
  const protocolIndicator = address[1];
  const protocolIndicatorByte = `0${protocolIndicator}`;

  switch (Number(protocolIndicator)) {
    case ProtocolIndicator.ID:
      if (address.length > 18) {
        throw new InvalidPayloadLength();
      }
      return Buffer.concat([
        Buffer.from(protocolIndicatorByte, "hex"),
        Buffer.from(leb.unsigned.encode(address.substr(2))),
      ]);
    case ProtocolIndicator.SECP256K1:
      addressDecoded = base32Decode(address.slice(2).toUpperCase(), "RFC4648");

      payload = addressDecoded.slice(0, -4);
      checksum = Buffer.from(addressDecoded.slice(-4));

      if (payload.byteLength !== 20) {
        throw new InvalidPayloadLength();
      }
      break;
    case ProtocolIndicator.ACTOR:
      addressDecoded = base32Decode(address.slice(2).toUpperCase(), "RFC4648");

      payload = addressDecoded.slice(0, -4);
      checksum = Buffer.from(addressDecoded.slice(-4));

      if (payload.byteLength !== 20) {
        throw new InvalidPayloadLength();
      }
      break;
    case ProtocolIndicator.BLS:
      addressDecoded = base32Decode(address.slice(2).toUpperCase(), "RFC4648");

      payload = addressDecoded.slice(0, -4);
      checksum = Buffer.from(addressDecoded.slice(-4));

      if (payload.byteLength !== 48) {
        throw new InvalidPayloadLength();
      }
      break;
    default:
      throw new UnknownProtocolIndicator();
  }

  const bytesAddress = Buffer.concat([
    Buffer.from(protocolIndicatorByte, "hex"),
    Buffer.from(payload),
  ]);

  if (getChecksum(bytesAddress).toString("hex") !== checksum.toString("hex")) {
    throw new InvalidChecksumAddress();
  }

  return bytesAddress;
}

const getChecksum = (payload: Buffer): Buffer => {
  const blakeCtx = blake.blake2bInit(4);
  blake.blake2bUpdate(blakeCtx, payload);
  return Buffer.from(blake.blake2bFinal(blakeCtx));
}

const serializeBigNum = (gasprice: string): Buffer => {
  if (gasprice == "0") {
    return Buffer.from("");
  }
  const gaspriceBigInt = new BN(gasprice, 10);
  const gaspriceBuffer = gaspriceBigInt.toArrayLike(
    Buffer,
    "be",
    gaspriceBigInt.byteLength()
  );
  return Buffer.concat([Buffer.from("00", "hex"), gaspriceBuffer]);
}

const ProtocolIndicator = {
  ID: 0,
  SECP256K1: 1,
  ACTOR: 2,
  BLS: 3,
};

class UnknownProtocolIndicator extends Error {
  constructor() {
    super();
    this.message = "Unknown protocol indicator byte.";
  }
}

class InvalidPayloadLength extends Error {
  constructor() {
    super();
    this.message = "Invalid payload length.";
  }
}

class InvalidChecksumAddress extends Error {
  constructor() {
    super();
    this.message = `Invalid address (checksum not matching the payload).`;
  }
}




