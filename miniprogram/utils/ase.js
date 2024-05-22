const CryptoJS = require('./CryptoJS');
const iv = CryptoJS.enc.Utf8.parse('十六位十六进制数作为秘钥偏移量');  
function Encrypt(word,key = "JYeontu666668888") {
  let srcs = CryptoJS.enc.Utf8.parse(word);
  key = CryptoJS.enc.Utf8.parse(key);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.ciphertext.toString().toUpperCase();
}

function Decrypt(word,key = "JYeontu666668888") {
  key = CryptoJS.enc.Utf8.parse(key);
  let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr;
}
module.exports = {
  Encrypt,
  Decrypt
};