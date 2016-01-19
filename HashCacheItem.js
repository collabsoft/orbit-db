'use strict';

const encryption = require('./Encryption');

const HashCacheOps = {
  Add: "ADD",
  Put: "PUT",
  Delete: "DELETE"
};

class HashCacheItem {
  constructor(operation, key, sequenceNumber, targetHash, metaInfo) {
    this.op     = operation;
    this.key    = key;
    this.seq    = sequenceNumber;
    this.target = targetHash;
    this.meta   = metaInfo;
  }
}

class EncryptedHashCacheItem extends HashCacheItem {
  constructor(operation, key, sequenceNumber, targetHash, metaInfo, publicKey, privateKey, salt) {
    super(operation, key, sequenceNumber, targetHash, metaInfo);
    this.pubkey  = publicKey;
    try {
      this.target  = encryption.encrypt(targetHash, privateKey, publicKey);
      this.payload = this.target; // old hash-cache api compatibility
      this.meta    = encryption.encrypt(JSON.stringify(metaInfo), privateKey, publicKey);
      this.sig     = encryption.sign(this.target, privateKey, this.seq, salt || "");
    } catch(e) {
      console.log("Signing HashCacheItem failed:", e);
    }
  }
}

module.exports = {
  HashCacheOps: HashCacheOps,
  HashCacheItem: HashCacheItem,
  EncryptedHashCacheItem: EncryptedHashCacheItem
};