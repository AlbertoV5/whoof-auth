import { createRequire } from "node:module";
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __require = /* @__PURE__ */ createRequire(import.meta.url);

// ../../node_modules/js-md5/src/md5.js
var require_md5 = __commonJS((exports, module) => {
  (function() {
    var INPUT_ERROR = "input is invalid type";
    var FINALIZE_ERROR = "finalize already called";
    var WINDOW = typeof window === "object";
    var root = WINDOW ? window : {};
    if (root.JS_MD5_NO_WINDOW) {
      WINDOW = false;
    }
    var WEB_WORKER = !WINDOW && typeof self === "object";
    var NODE_JS = !root.JS_MD5_NO_NODE_JS && typeof process === "object" && process.versions && process.versions.node;
    if (NODE_JS) {
      root = global;
    } else if (WEB_WORKER) {
      root = self;
    }
    var COMMON_JS = !root.JS_MD5_NO_COMMON_JS && typeof module === "object" && module.exports;
    var AMD = typeof define === "function" && define.amd;
    var ARRAY_BUFFER = !root.JS_MD5_NO_ARRAY_BUFFER && typeof ArrayBuffer !== "undefined";
    var HEX_CHARS = "0123456789abcdef".split("");
    var EXTRA = [128, 32768, 8388608, -2147483648];
    var SHIFT = [0, 8, 16, 24];
    var OUTPUT_TYPES = ["hex", "array", "digest", "buffer", "arrayBuffer", "base64"];
    var BASE64_ENCODE_CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
    var blocks = [], buffer8;
    if (ARRAY_BUFFER) {
      var buffer = new ArrayBuffer(68);
      buffer8 = new Uint8Array(buffer);
      blocks = new Uint32Array(buffer);
    }
    var isArray = Array.isArray;
    if (root.JS_MD5_NO_NODE_JS || !isArray) {
      isArray = function(obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
      };
    }
    var isView = ArrayBuffer.isView;
    if (ARRAY_BUFFER && (root.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW || !isView)) {
      isView = function(obj) {
        return typeof obj === "object" && obj.buffer && obj.buffer.constructor === ArrayBuffer;
      };
    }
    var formatMessage = function(message2) {
      var type = typeof message2;
      if (type === "string") {
        return [message2, true];
      }
      if (type !== "object" || message2 === null) {
        throw new Error(INPUT_ERROR);
      }
      if (ARRAY_BUFFER && message2.constructor === ArrayBuffer) {
        return [new Uint8Array(message2), false];
      }
      if (!isArray(message2) && !isView(message2)) {
        throw new Error(INPUT_ERROR);
      }
      return [message2, false];
    };
    var createOutputMethod = function(outputType) {
      return function(message2) {
        return new Md5(true).update(message2)[outputType]();
      };
    };
    var createMethod = function() {
      var method = createOutputMethod("hex");
      if (NODE_JS) {
        method = nodeWrap(method);
      }
      method.create = function() {
        return new Md5;
      };
      method.update = function(message2) {
        return method.create().update(message2);
      };
      for (var i = 0;i < OUTPUT_TYPES.length; ++i) {
        var type = OUTPUT_TYPES[i];
        method[type] = createOutputMethod(type);
      }
      return method;
    };
    var nodeWrap = function(method) {
      var crypto2 = __require("crypto");
      var Buffer = __require("buffer").Buffer;
      var bufferFrom;
      if (Buffer.from && !root.JS_MD5_NO_BUFFER_FROM) {
        bufferFrom = Buffer.from;
      } else {
        bufferFrom = function(message2) {
          return new Buffer(message2);
        };
      }
      var nodeMethod = function(message2) {
        if (typeof message2 === "string") {
          return crypto2.createHash("md5").update(message2, "utf8").digest("hex");
        } else {
          if (message2 === null || message2 === undefined) {
            throw new Error(INPUT_ERROR);
          } else if (message2.constructor === ArrayBuffer) {
            message2 = new Uint8Array(message2);
          }
        }
        if (isArray(message2) || isView(message2) || message2.constructor === Buffer) {
          return crypto2.createHash("md5").update(bufferFrom(message2)).digest("hex");
        } else {
          return method(message2);
        }
      };
      return nodeMethod;
    };
    var createHmacOutputMethod = function(outputType) {
      return function(key, message2) {
        return new HmacMd5(key, true).update(message2)[outputType]();
      };
    };
    var createHmacMethod = function() {
      var method = createHmacOutputMethod("hex");
      method.create = function(key) {
        return new HmacMd5(key);
      };
      method.update = function(key, message2) {
        return method.create(key).update(message2);
      };
      for (var i = 0;i < OUTPUT_TYPES.length; ++i) {
        var type = OUTPUT_TYPES[i];
        method[type] = createHmacOutputMethod(type);
      }
      return method;
    };
    function Md5(sharedMemory) {
      if (sharedMemory) {
        blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
        this.blocks = blocks;
        this.buffer8 = buffer8;
      } else {
        if (ARRAY_BUFFER) {
          var buffer2 = new ArrayBuffer(68);
          this.buffer8 = new Uint8Array(buffer2);
          this.blocks = new Uint32Array(buffer2);
        } else {
          this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
      }
      this.h0 = this.h1 = this.h2 = this.h3 = this.start = this.bytes = this.hBytes = 0;
      this.finalized = this.hashed = false;
      this.first = true;
    }
    Md5.prototype.update = function(message2) {
      if (this.finalized) {
        throw new Error(FINALIZE_ERROR);
      }
      var result = formatMessage(message2);
      message2 = result[0];
      var isString = result[1];
      var code, index = 0, i, length = message2.length, blocks2 = this.blocks;
      var buffer82 = this.buffer8;
      while (index < length) {
        if (this.hashed) {
          this.hashed = false;
          blocks2[0] = blocks2[16];
          blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
        }
        if (isString) {
          if (ARRAY_BUFFER) {
            for (i = this.start;index < length && i < 64; ++index) {
              code = message2.charCodeAt(index);
              if (code < 128) {
                buffer82[i++] = code;
              } else if (code < 2048) {
                buffer82[i++] = 192 | code >>> 6;
                buffer82[i++] = 128 | code & 63;
              } else if (code < 55296 || code >= 57344) {
                buffer82[i++] = 224 | code >>> 12;
                buffer82[i++] = 128 | code >>> 6 & 63;
                buffer82[i++] = 128 | code & 63;
              } else {
                code = 65536 + ((code & 1023) << 10 | message2.charCodeAt(++index) & 1023);
                buffer82[i++] = 240 | code >>> 18;
                buffer82[i++] = 128 | code >>> 12 & 63;
                buffer82[i++] = 128 | code >>> 6 & 63;
                buffer82[i++] = 128 | code & 63;
              }
            }
          } else {
            for (i = this.start;index < length && i < 64; ++index) {
              code = message2.charCodeAt(index);
              if (code < 128) {
                blocks2[i >>> 2] |= code << SHIFT[i++ & 3];
              } else if (code < 2048) {
                blocks2[i >>> 2] |= (192 | code >>> 6) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
              } else if (code < 55296 || code >= 57344) {
                blocks2[i >>> 2] |= (224 | code >>> 12) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
              } else {
                code = 65536 + ((code & 1023) << 10 | message2.charCodeAt(++index) & 1023);
                blocks2[i >>> 2] |= (240 | code >>> 18) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code >>> 12 & 63) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
                blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
              }
            }
          }
        } else {
          if (ARRAY_BUFFER) {
            for (i = this.start;index < length && i < 64; ++index) {
              buffer82[i++] = message2[index];
            }
          } else {
            for (i = this.start;index < length && i < 64; ++index) {
              blocks2[i >>> 2] |= message2[index] << SHIFT[i++ & 3];
            }
          }
        }
        this.lastByteIndex = i;
        this.bytes += i - this.start;
        if (i >= 64) {
          this.start = i - 64;
          this.hash();
          this.hashed = true;
        } else {
          this.start = i;
        }
      }
      if (this.bytes > 4294967295) {
        this.hBytes += this.bytes / 4294967296 << 0;
        this.bytes = this.bytes % 4294967296;
      }
      return this;
    };
    Md5.prototype.finalize = function() {
      if (this.finalized) {
        return;
      }
      this.finalized = true;
      var blocks2 = this.blocks, i = this.lastByteIndex;
      blocks2[i >>> 2] |= EXTRA[i & 3];
      if (i >= 56) {
        if (!this.hashed) {
          this.hash();
        }
        blocks2[0] = blocks2[16];
        blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
      }
      blocks2[14] = this.bytes << 3;
      blocks2[15] = this.hBytes << 3 | this.bytes >>> 29;
      this.hash();
    };
    Md5.prototype.hash = function() {
      var a, b, c, d, bc, da, blocks2 = this.blocks;
      if (this.first) {
        a = blocks2[0] - 680876937;
        a = (a << 7 | a >>> 25) - 271733879 << 0;
        d = (-1732584194 ^ a & 2004318071) + blocks2[1] - 117830708;
        d = (d << 12 | d >>> 20) + a << 0;
        c = (-271733879 ^ d & (a ^ -271733879)) + blocks2[2] - 1126478375;
        c = (c << 17 | c >>> 15) + d << 0;
        b = (a ^ c & (d ^ a)) + blocks2[3] - 1316259209;
        b = (b << 22 | b >>> 10) + c << 0;
      } else {
        a = this.h0;
        b = this.h1;
        c = this.h2;
        d = this.h3;
        a += (d ^ b & (c ^ d)) + blocks2[0] - 680876936;
        a = (a << 7 | a >>> 25) + b << 0;
        d += (c ^ a & (b ^ c)) + blocks2[1] - 389564586;
        d = (d << 12 | d >>> 20) + a << 0;
        c += (b ^ d & (a ^ b)) + blocks2[2] + 606105819;
        c = (c << 17 | c >>> 15) + d << 0;
        b += (a ^ c & (d ^ a)) + blocks2[3] - 1044525330;
        b = (b << 22 | b >>> 10) + c << 0;
      }
      a += (d ^ b & (c ^ d)) + blocks2[4] - 176418897;
      a = (a << 7 | a >>> 25) + b << 0;
      d += (c ^ a & (b ^ c)) + blocks2[5] + 1200080426;
      d = (d << 12 | d >>> 20) + a << 0;
      c += (b ^ d & (a ^ b)) + blocks2[6] - 1473231341;
      c = (c << 17 | c >>> 15) + d << 0;
      b += (a ^ c & (d ^ a)) + blocks2[7] - 45705983;
      b = (b << 22 | b >>> 10) + c << 0;
      a += (d ^ b & (c ^ d)) + blocks2[8] + 1770035416;
      a = (a << 7 | a >>> 25) + b << 0;
      d += (c ^ a & (b ^ c)) + blocks2[9] - 1958414417;
      d = (d << 12 | d >>> 20) + a << 0;
      c += (b ^ d & (a ^ b)) + blocks2[10] - 42063;
      c = (c << 17 | c >>> 15) + d << 0;
      b += (a ^ c & (d ^ a)) + blocks2[11] - 1990404162;
      b = (b << 22 | b >>> 10) + c << 0;
      a += (d ^ b & (c ^ d)) + blocks2[12] + 1804603682;
      a = (a << 7 | a >>> 25) + b << 0;
      d += (c ^ a & (b ^ c)) + blocks2[13] - 40341101;
      d = (d << 12 | d >>> 20) + a << 0;
      c += (b ^ d & (a ^ b)) + blocks2[14] - 1502002290;
      c = (c << 17 | c >>> 15) + d << 0;
      b += (a ^ c & (d ^ a)) + blocks2[15] + 1236535329;
      b = (b << 22 | b >>> 10) + c << 0;
      a += (c ^ d & (b ^ c)) + blocks2[1] - 165796510;
      a = (a << 5 | a >>> 27) + b << 0;
      d += (b ^ c & (a ^ b)) + blocks2[6] - 1069501632;
      d = (d << 9 | d >>> 23) + a << 0;
      c += (a ^ b & (d ^ a)) + blocks2[11] + 643717713;
      c = (c << 14 | c >>> 18) + d << 0;
      b += (d ^ a & (c ^ d)) + blocks2[0] - 373897302;
      b = (b << 20 | b >>> 12) + c << 0;
      a += (c ^ d & (b ^ c)) + blocks2[5] - 701558691;
      a = (a << 5 | a >>> 27) + b << 0;
      d += (b ^ c & (a ^ b)) + blocks2[10] + 38016083;
      d = (d << 9 | d >>> 23) + a << 0;
      c += (a ^ b & (d ^ a)) + blocks2[15] - 660478335;
      c = (c << 14 | c >>> 18) + d << 0;
      b += (d ^ a & (c ^ d)) + blocks2[4] - 405537848;
      b = (b << 20 | b >>> 12) + c << 0;
      a += (c ^ d & (b ^ c)) + blocks2[9] + 568446438;
      a = (a << 5 | a >>> 27) + b << 0;
      d += (b ^ c & (a ^ b)) + blocks2[14] - 1019803690;
      d = (d << 9 | d >>> 23) + a << 0;
      c += (a ^ b & (d ^ a)) + blocks2[3] - 187363961;
      c = (c << 14 | c >>> 18) + d << 0;
      b += (d ^ a & (c ^ d)) + blocks2[8] + 1163531501;
      b = (b << 20 | b >>> 12) + c << 0;
      a += (c ^ d & (b ^ c)) + blocks2[13] - 1444681467;
      a = (a << 5 | a >>> 27) + b << 0;
      d += (b ^ c & (a ^ b)) + blocks2[2] - 51403784;
      d = (d << 9 | d >>> 23) + a << 0;
      c += (a ^ b & (d ^ a)) + blocks2[7] + 1735328473;
      c = (c << 14 | c >>> 18) + d << 0;
      b += (d ^ a & (c ^ d)) + blocks2[12] - 1926607734;
      b = (b << 20 | b >>> 12) + c << 0;
      bc = b ^ c;
      a += (bc ^ d) + blocks2[5] - 378558;
      a = (a << 4 | a >>> 28) + b << 0;
      d += (bc ^ a) + blocks2[8] - 2022574463;
      d = (d << 11 | d >>> 21) + a << 0;
      da = d ^ a;
      c += (da ^ b) + blocks2[11] + 1839030562;
      c = (c << 16 | c >>> 16) + d << 0;
      b += (da ^ c) + blocks2[14] - 35309556;
      b = (b << 23 | b >>> 9) + c << 0;
      bc = b ^ c;
      a += (bc ^ d) + blocks2[1] - 1530992060;
      a = (a << 4 | a >>> 28) + b << 0;
      d += (bc ^ a) + blocks2[4] + 1272893353;
      d = (d << 11 | d >>> 21) + a << 0;
      da = d ^ a;
      c += (da ^ b) + blocks2[7] - 155497632;
      c = (c << 16 | c >>> 16) + d << 0;
      b += (da ^ c) + blocks2[10] - 1094730640;
      b = (b << 23 | b >>> 9) + c << 0;
      bc = b ^ c;
      a += (bc ^ d) + blocks2[13] + 681279174;
      a = (a << 4 | a >>> 28) + b << 0;
      d += (bc ^ a) + blocks2[0] - 358537222;
      d = (d << 11 | d >>> 21) + a << 0;
      da = d ^ a;
      c += (da ^ b) + blocks2[3] - 722521979;
      c = (c << 16 | c >>> 16) + d << 0;
      b += (da ^ c) + blocks2[6] + 76029189;
      b = (b << 23 | b >>> 9) + c << 0;
      bc = b ^ c;
      a += (bc ^ d) + blocks2[9] - 640364487;
      a = (a << 4 | a >>> 28) + b << 0;
      d += (bc ^ a) + blocks2[12] - 421815835;
      d = (d << 11 | d >>> 21) + a << 0;
      da = d ^ a;
      c += (da ^ b) + blocks2[15] + 530742520;
      c = (c << 16 | c >>> 16) + d << 0;
      b += (da ^ c) + blocks2[2] - 995338651;
      b = (b << 23 | b >>> 9) + c << 0;
      a += (c ^ (b | ~d)) + blocks2[0] - 198630844;
      a = (a << 6 | a >>> 26) + b << 0;
      d += (b ^ (a | ~c)) + blocks2[7] + 1126891415;
      d = (d << 10 | d >>> 22) + a << 0;
      c += (a ^ (d | ~b)) + blocks2[14] - 1416354905;
      c = (c << 15 | c >>> 17) + d << 0;
      b += (d ^ (c | ~a)) + blocks2[5] - 57434055;
      b = (b << 21 | b >>> 11) + c << 0;
      a += (c ^ (b | ~d)) + blocks2[12] + 1700485571;
      a = (a << 6 | a >>> 26) + b << 0;
      d += (b ^ (a | ~c)) + blocks2[3] - 1894986606;
      d = (d << 10 | d >>> 22) + a << 0;
      c += (a ^ (d | ~b)) + blocks2[10] - 1051523;
      c = (c << 15 | c >>> 17) + d << 0;
      b += (d ^ (c | ~a)) + blocks2[1] - 2054922799;
      b = (b << 21 | b >>> 11) + c << 0;
      a += (c ^ (b | ~d)) + blocks2[8] + 1873313359;
      a = (a << 6 | a >>> 26) + b << 0;
      d += (b ^ (a | ~c)) + blocks2[15] - 30611744;
      d = (d << 10 | d >>> 22) + a << 0;
      c += (a ^ (d | ~b)) + blocks2[6] - 1560198380;
      c = (c << 15 | c >>> 17) + d << 0;
      b += (d ^ (c | ~a)) + blocks2[13] + 1309151649;
      b = (b << 21 | b >>> 11) + c << 0;
      a += (c ^ (b | ~d)) + blocks2[4] - 145523070;
      a = (a << 6 | a >>> 26) + b << 0;
      d += (b ^ (a | ~c)) + blocks2[11] - 1120210379;
      d = (d << 10 | d >>> 22) + a << 0;
      c += (a ^ (d | ~b)) + blocks2[2] + 718787259;
      c = (c << 15 | c >>> 17) + d << 0;
      b += (d ^ (c | ~a)) + blocks2[9] - 343485551;
      b = (b << 21 | b >>> 11) + c << 0;
      if (this.first) {
        this.h0 = a + 1732584193 << 0;
        this.h1 = b - 271733879 << 0;
        this.h2 = c - 1732584194 << 0;
        this.h3 = d + 271733878 << 0;
        this.first = false;
      } else {
        this.h0 = this.h0 + a << 0;
        this.h1 = this.h1 + b << 0;
        this.h2 = this.h2 + c << 0;
        this.h3 = this.h3 + d << 0;
      }
    };
    Md5.prototype.hex = function() {
      this.finalize();
      var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
      return HEX_CHARS[h0 >>> 4 & 15] + HEX_CHARS[h0 & 15] + HEX_CHARS[h0 >>> 12 & 15] + HEX_CHARS[h0 >>> 8 & 15] + HEX_CHARS[h0 >>> 20 & 15] + HEX_CHARS[h0 >>> 16 & 15] + HEX_CHARS[h0 >>> 28 & 15] + HEX_CHARS[h0 >>> 24 & 15] + HEX_CHARS[h1 >>> 4 & 15] + HEX_CHARS[h1 & 15] + HEX_CHARS[h1 >>> 12 & 15] + HEX_CHARS[h1 >>> 8 & 15] + HEX_CHARS[h1 >>> 20 & 15] + HEX_CHARS[h1 >>> 16 & 15] + HEX_CHARS[h1 >>> 28 & 15] + HEX_CHARS[h1 >>> 24 & 15] + HEX_CHARS[h2 >>> 4 & 15] + HEX_CHARS[h2 & 15] + HEX_CHARS[h2 >>> 12 & 15] + HEX_CHARS[h2 >>> 8 & 15] + HEX_CHARS[h2 >>> 20 & 15] + HEX_CHARS[h2 >>> 16 & 15] + HEX_CHARS[h2 >>> 28 & 15] + HEX_CHARS[h2 >>> 24 & 15] + HEX_CHARS[h3 >>> 4 & 15] + HEX_CHARS[h3 & 15] + HEX_CHARS[h3 >>> 12 & 15] + HEX_CHARS[h3 >>> 8 & 15] + HEX_CHARS[h3 >>> 20 & 15] + HEX_CHARS[h3 >>> 16 & 15] + HEX_CHARS[h3 >>> 28 & 15] + HEX_CHARS[h3 >>> 24 & 15];
    };
    Md5.prototype.toString = Md5.prototype.hex;
    Md5.prototype.digest = function() {
      this.finalize();
      var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
      return [
        h0 & 255,
        h0 >>> 8 & 255,
        h0 >>> 16 & 255,
        h0 >>> 24 & 255,
        h1 & 255,
        h1 >>> 8 & 255,
        h1 >>> 16 & 255,
        h1 >>> 24 & 255,
        h2 & 255,
        h2 >>> 8 & 255,
        h2 >>> 16 & 255,
        h2 >>> 24 & 255,
        h3 & 255,
        h3 >>> 8 & 255,
        h3 >>> 16 & 255,
        h3 >>> 24 & 255
      ];
    };
    Md5.prototype.array = Md5.prototype.digest;
    Md5.prototype.arrayBuffer = function() {
      this.finalize();
      var buffer2 = new ArrayBuffer(16);
      var blocks2 = new Uint32Array(buffer2);
      blocks2[0] = this.h0;
      blocks2[1] = this.h1;
      blocks2[2] = this.h2;
      blocks2[3] = this.h3;
      return buffer2;
    };
    Md5.prototype.buffer = Md5.prototype.arrayBuffer;
    Md5.prototype.base64 = function() {
      var v1, v2, v3, base64Str = "", bytes = this.array();
      for (var i = 0;i < 15; ) {
        v1 = bytes[i++];
        v2 = bytes[i++];
        v3 = bytes[i++];
        base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] + BASE64_ENCODE_CHAR[(v1 << 4 | v2 >>> 4) & 63] + BASE64_ENCODE_CHAR[(v2 << 2 | v3 >>> 6) & 63] + BASE64_ENCODE_CHAR[v3 & 63];
      }
      v1 = bytes[i];
      base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] + BASE64_ENCODE_CHAR[v1 << 4 & 63] + "==";
      return base64Str;
    };
    function HmacMd5(key, sharedMemory) {
      var i, result = formatMessage(key);
      key = result[0];
      if (result[1]) {
        var bytes = [], length = key.length, index = 0, code;
        for (i = 0;i < length; ++i) {
          code = key.charCodeAt(i);
          if (code < 128) {
            bytes[index++] = code;
          } else if (code < 2048) {
            bytes[index++] = 192 | code >>> 6;
            bytes[index++] = 128 | code & 63;
          } else if (code < 55296 || code >= 57344) {
            bytes[index++] = 224 | code >>> 12;
            bytes[index++] = 128 | code >>> 6 & 63;
            bytes[index++] = 128 | code & 63;
          } else {
            code = 65536 + ((code & 1023) << 10 | key.charCodeAt(++i) & 1023);
            bytes[index++] = 240 | code >>> 18;
            bytes[index++] = 128 | code >>> 12 & 63;
            bytes[index++] = 128 | code >>> 6 & 63;
            bytes[index++] = 128 | code & 63;
          }
        }
        key = bytes;
      }
      if (key.length > 64) {
        key = new Md5(true).update(key).array();
      }
      var oKeyPad = [], iKeyPad = [];
      for (i = 0;i < 64; ++i) {
        var b = key[i] || 0;
        oKeyPad[i] = 92 ^ b;
        iKeyPad[i] = 54 ^ b;
      }
      Md5.call(this, sharedMemory);
      this.update(iKeyPad);
      this.oKeyPad = oKeyPad;
      this.inner = true;
      this.sharedMemory = sharedMemory;
    }
    HmacMd5.prototype = new Md5;
    HmacMd5.prototype.finalize = function() {
      Md5.prototype.finalize.call(this);
      if (this.inner) {
        this.inner = false;
        var innerHash = this.array();
        Md5.call(this, this.sharedMemory);
        this.update(this.oKeyPad);
        this.update(innerHash);
        Md5.prototype.finalize.call(this);
      }
    };
    var exports2 = createMethod();
    exports2.md5 = exports2;
    exports2.md5.hmac = createHmacMethod();
    if (COMMON_JS) {
      module.exports = exports2;
    } else {
      root.md5 = exports2;
      if (AMD) {
        define(function() {
          return exports2;
        });
      }
    }
  })();
});

// ../../node_modules/tiny-typed-emitter/lib/index.js
var require_lib = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.TypedEmitter = __require("events").EventEmitter;
});

// ../../node_modules/@whop/api/node_modules/jose/dist/webapi/lib/buffer_utils.js
var encoder = new TextEncoder;
var decoder = new TextDecoder;
var MAX_INT32 = 2 ** 32;
function concat(...buffers) {
  const size = buffers.reduce((acc, { length }) => acc + length, 0);
  const buf = new Uint8Array(size);
  let i = 0;
  for (const buffer of buffers) {
    buf.set(buffer, i);
    i += buffer.length;
  }
  return buf;
}

// ../../node_modules/@whop/api/node_modules/jose/dist/webapi/lib/base64.js
function decodeBase64(encoded) {
  if (Uint8Array.fromBase64) {
    return Uint8Array.fromBase64(encoded);
  }
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0;i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// ../../node_modules/@whop/api/node_modules/jose/dist/webapi/util/base64url.js
function decode(input) {
  if (Uint8Array.fromBase64) {
    return Uint8Array.fromBase64(typeof input === "string" ? input : decoder.decode(input), {
      alphabet: "base64url"
    });
  }
  let encoded = input;
  if (encoded instanceof Uint8Array) {
    encoded = decoder.decode(encoded);
  }
  encoded = encoded.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
  try {
    return decodeBase64(encoded);
  } catch {
    throw new TypeError("The input to be decoded is not correctly encoded.");
  }
}

// ../../node_modules/@whop/api/node_modules/jose/dist/webapi/util/errors.js
class JOSEError extends Error {
  static code = "ERR_JOSE_GENERIC";
  code = "ERR_JOSE_GENERIC";
  constructor(message, options) {
    super(message, options);
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

class JWTClaimValidationFailed extends JOSEError {
  static code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
  code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
  claim;
  reason;
  payload;
  constructor(message, payload, claim = "unspecified", reason = "unspecified") {
    super(message, { cause: { claim, reason, payload } });
    this.claim = claim;
    this.reason = reason;
    this.payload = payload;
  }
}

class JWTExpired extends JOSEError {
  static code = "ERR_JWT_EXPIRED";
  code = "ERR_JWT_EXPIRED";
  claim;
  reason;
  payload;
  constructor(message, payload, claim = "unspecified", reason = "unspecified") {
    super(message, { cause: { claim, reason, payload } });
    this.claim = claim;
    this.reason = reason;
    this.payload = payload;
  }
}

class JOSEAlgNotAllowed extends JOSEError {
  static code = "ERR_JOSE_ALG_NOT_ALLOWED";
  code = "ERR_JOSE_ALG_NOT_ALLOWED";
}

class JOSENotSupported extends JOSEError {
  static code = "ERR_JOSE_NOT_SUPPORTED";
  code = "ERR_JOSE_NOT_SUPPORTED";
}
class JWSInvalid extends JOSEError {
  static code = "ERR_JWS_INVALID";
  code = "ERR_JWS_INVALID";
}

class JWTInvalid extends JOSEError {
  static code = "ERR_JWT_INVALID";
  code = "ERR_JWT_INVALID";
}
class JWSSignatureVerificationFailed extends JOSEError {
  static code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
  code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
  constructor(message = "signature verification failed", options) {
    super(message, options);
  }
}

// ../../node_modules/@whop/api/node_modules/jose/dist/webapi/lib/crypto_key.js
function unusable(name, prop = "algorithm.name") {
  return new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`);
}
function isAlgorithm(algorithm, name) {
  return algorithm.name === name;
}
function getHashLength(hash) {
  return parseInt(hash.name.slice(4), 10);
}
function getNamedCurve(alg) {
  switch (alg) {
    case "ES256":
      return "P-256";
    case "ES384":
      return "P-384";
    case "ES512":
      return "P-521";
    default:
      throw new Error("unreachable");
  }
}
function checkUsage(key, usage) {
  if (usage && !key.usages.includes(usage)) {
    throw new TypeError(`CryptoKey does not support this operation, its usages must include ${usage}.`);
  }
}
function checkSigCryptoKey(key, alg, usage) {
  switch (alg) {
    case "HS256":
    case "HS384":
    case "HS512": {
      if (!isAlgorithm(key.algorithm, "HMAC"))
        throw unusable("HMAC");
      const expected = parseInt(alg.slice(2), 10);
      const actual = getHashLength(key.algorithm.hash);
      if (actual !== expected)
        throw unusable(`SHA-${expected}`, "algorithm.hash");
      break;
    }
    case "RS256":
    case "RS384":
    case "RS512": {
      if (!isAlgorithm(key.algorithm, "RSASSA-PKCS1-v1_5"))
        throw unusable("RSASSA-PKCS1-v1_5");
      const expected = parseInt(alg.slice(2), 10);
      const actual = getHashLength(key.algorithm.hash);
      if (actual !== expected)
        throw unusable(`SHA-${expected}`, "algorithm.hash");
      break;
    }
    case "PS256":
    case "PS384":
    case "PS512": {
      if (!isAlgorithm(key.algorithm, "RSA-PSS"))
        throw unusable("RSA-PSS");
      const expected = parseInt(alg.slice(2), 10);
      const actual = getHashLength(key.algorithm.hash);
      if (actual !== expected)
        throw unusable(`SHA-${expected}`, "algorithm.hash");
      break;
    }
    case "Ed25519":
    case "EdDSA": {
      if (!isAlgorithm(key.algorithm, "Ed25519"))
        throw unusable("Ed25519");
      break;
    }
    case "ES256":
    case "ES384":
    case "ES512": {
      if (!isAlgorithm(key.algorithm, "ECDSA"))
        throw unusable("ECDSA");
      const expected = getNamedCurve(alg);
      const actual = key.algorithm.namedCurve;
      if (actual !== expected)
        throw unusable(expected, "algorithm.namedCurve");
      break;
    }
    default:
      throw new TypeError("CryptoKey does not support this operation");
  }
  checkUsage(key, usage);
}

// ../../node_modules/@whop/api/node_modules/jose/dist/webapi/lib/invalid_key_input.js
function message(msg, actual, ...types) {
  types = types.filter(Boolean);
  if (types.length > 2) {
    const last = types.pop();
    msg += `one of type ${types.join(", ")}, or ${last}.`;
  } else if (types.length === 2) {
    msg += `one of type ${types[0]} or ${types[1]}.`;
  } else {
    msg += `of type ${types[0]}.`;
  }
  if (actual == null) {
    msg += ` Received ${actual}`;
  } else if (typeof actual === "function" && actual.name) {
    msg += ` Received function ${actual.name}`;
  } else if (typeof actual === "object" && actual != null) {
    if (actual.constructor?.name) {
      msg += ` Received an instance of ${actual.constructor.name}`;
    }
  }
  return msg;
}
var invalid_key_input_default = (actual, ...types) => {
  return message("Key must be ", actual, ...types);
};
function withAlg(alg, actual, ...types) {
  return message(`Key for the ${alg} algorithm must be `, actual, ...types);
}

// ../../node_modules/@whop/api/node_modules/jose/dist/webapi/lib/is_key_like.js
function isCryptoKey(key) {
  return key?.[Symbol.toStringTag] === "CryptoKey";
}
function isKeyObject(key) {
  return key?.[Symbol.toStringTag] === "KeyObject";
}
var is_key_like_default = (key) => {
  return isCryptoKey(key) || isKeyObject(key);
};

// ../../node_modules/@whop/api/node_modules/jose/dist/webapi/lib/is_disjoint.js
var is_disjoint_default = (...headers) => {
  const sources = headers.filter(Boolean);
  if (sources.length === 0 || sources.length === 1) {
    return true;
  }
  let acc;
  for (const header of sources) {
    const parameters = Object.keys(header);
    if (!acc || acc.size === 0) {
      acc = new Set(parameters);
      continue;
    }
    for (const parameter of parameters) {
      if (acc.has(parameter)) {
        return false;
      }
      acc.add(parameter);
    }
  }
  return true;
};

// ../../node_modules/@whop/api/node_modules/jose/dist/webapi/lib/is_object.js
function isObjectLike(value) {
  return typeof value === "object" && value !== null;
}
var is_object_default = (input) => {
  if (!isObjectLike(input) || Object.prototype.toString.call(input) !== "[object Object]") {
    return false;
  }
  if (Object.getPrototypeOf(input) === null) {
    return true;
  }
  let proto = input;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(input) === proto;
};

// ../../node_modules/@whop/api/node_modules/jose/dist/webapi/lib/check_key_length.js
var check_key_length_default = (alg, key) => {
  if (alg.startsWith("RS") || alg.startsWith("PS")) {
    const { modulusLength } = key.algorithm;
    if (typeof modulusLength !== "number" || modulusLength < 2048) {
      throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`);
    }
  }
};

// ../../node_modules/@whop/api/node_modules/jose/dist/webapi/lib/jwk_to_key.js
function subtleMapping(jwk) {
  let algorithm;
  let keyUsages;
  switch (jwk.kty) {
    case "RSA": {
      switch (jwk.alg) {
        case "PS256":
        case "PS384":
        case "PS512":
          algorithm = { name: "RSA-PSS", hash: `SHA-${jwk.alg.slice(-3)}` };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "RS256":
        case "RS384":
        case "RS512":
          algorithm = { name: "RSASSA-PKCS1-v1_5", hash: `SHA-${jwk.alg.slice(-3)}` };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "RSA-OAEP":
        case "RSA-OAEP-256":
        case "RSA-OAEP-384":
        case "RSA-OAEP-512":
          algorithm = {
            name: "RSA-OAEP",
            hash: `SHA-${parseInt(jwk.alg.slice(-3), 10) || 1}`
          };
          keyUsages = jwk.d ? ["decrypt", "unwrapKey"] : ["encrypt", "wrapKey"];
          break;
        default:
          throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    case "EC": {
      switch (jwk.alg) {
        case "ES256":
          algorithm = { name: "ECDSA", namedCurve: "P-256" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ES384":
          algorithm = { name: "ECDSA", namedCurve: "P-384" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ES512":
          algorithm = { name: "ECDSA", namedCurve: "P-521" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
          algorithm = { name: "ECDH", namedCurve: jwk.crv };
          keyUsages = jwk.d ? ["deriveBits"] : [];
          break;
        default:
          throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    case "OKP": {
      switch (jwk.alg) {
        case "Ed25519":
        case "EdDSA":
          algorithm = { name: "Ed25519" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
          algorithm = { name: jwk.crv };
          keyUsages = jwk.d ? ["deriveBits"] : [];
          break;
        default:
          throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    default:
      throw new JOSENotSupported('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
  }
  return { algorithm, keyUsages };
}
var jwk_to_key_default = async (jwk) => {
  if (!jwk.alg) {
    throw new TypeError('"alg" argument is required when "jwk.alg" is not present');
  }
  const { algorithm, keyUsages } = subtleMapping(jwk);
  const keyData = { ...jwk };
  delete keyData.alg;
  delete keyData.use;
  return crypto.subtle.importKey("jwk", keyData, algorithm, jwk.ext ?? (jwk.d ? false : true), jwk.key_ops ?? keyUsages);
};

// ../../node_modules/@whop/api/node_modules/jose/dist/webapi/key/import.js
async function importJWK(jwk, alg, options) {
  if (!is_object_default(jwk)) {
    throw new TypeError("JWK must be an object");
  }
  let ext;
  alg ??= jwk.alg;
  ext ??= options?.extractable ?? jwk.ext;
  switch (jwk.kty) {
    case "oct":
      if (typeof jwk.k !== "string" || !jwk.k) {
        throw new TypeError('missing "k" (Key Value) Parameter value');
      }
      return decode(jwk.k);
    case "RSA":
      if ("oth" in jwk && jwk.oth !== undefined) {
        throw new JOSENotSupported('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
      }
    case "EC":
    case "OKP":
      return jwk_to_key_default({ ...jwk, alg, ext });
    default:
      throw new JOSENotSupported('Unsupported "kty" (Key Type) Parameter value');
  }
}

// ../../node_modules/@whop/api/node_modules/jose/dist/webapi/lib/validate_crit.js
var validate_crit_default = (Err, recognizedDefault, recognizedOption, protectedHeader, joseHeader) => {
  if (joseHeader.crit !== undefined && protectedHeader?.crit === undefined) {
    throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected');
  }
  if (!protectedHeader || protectedHeader.crit === undefined) {
    return new Set;
  }
  if (!Array.isArray(protectedHeader.crit) || protectedHeader.crit.length === 0 || protectedHeader.crit.some((input) => typeof input !== "string" || input.length === 0)) {
    throw new Err('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
  }
  let recognized;
  if (recognizedOption !== undefined) {
    recognized = new Map([...Object.entries(recognizedOption), ...recognizedDefault.entries()]);
  } else {
    recognized = recognizedDefault;
  }
  for (const parameter of protectedHeader.crit) {
    if (!recognized.has(parameter)) {
      throw new JOSENotSupported(`Extension Header Parameter "${parameter}" is not recognized`);
    }
    if (joseHeader[parameter] === undefined) {
      throw new Err(`Extension Header Parameter "${parameter}" is missing`);
    }
    if (recognized.get(parameter) && protectedHeader[parameter] === undefined) {
      throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`);
    }
  }
  return new Set(protectedHeader.crit);
};

// ../../node_modules/@whop/api/node_modules/jose/dist/webapi/lib/validate_algorithms.js
var validate_algorithms_default = (option, algorithms) => {
  if (algorithms !== undefined && (!Array.isArray(algorithms) || algorithms.some((s) => typeof s !== "string"))) {
    throw new TypeError(`"${option}" option must be an array of strings`);
  }
  if (!algorithms) {
    return;
  }
  return new Set(algorithms);
};

// ../../node_modules/@whop/api/node_modules/jose/dist/webapi/lib/is_jwk.js
function isJWK(key) {
  return is_object_default(key) && typeof key.kty === "string";
}
function isPrivateJWK(key) {
  return key.kty !== "oct" && typeof key.d === "string";
}
function isPublicJWK(key) {
  return key.kty !== "oct" && typeof key.d === "undefined";
}
function isSecretJWK(key) {
  return key.kty === "oct" && typeof key.k === "string";
}

// ../../node_modules/@whop/api/node_modules/jose/dist/webapi/lib/normalize_key.js
var cache;
var handleJWK = async (key, jwk, alg, freeze = false) => {
  cache ||= new WeakMap;
  let cached = cache.get(key);
  if (cached?.[alg]) {
    return cached[alg];
  }
  const cryptoKey = await jwk_to_key_default({ ...jwk, alg });
  if (freeze)
    Object.freeze(key);
  if (!cached) {
    cache.set(key, { [alg]: cryptoKey });
  } else {
    cached[alg] = cryptoKey;
  }
  return cryptoKey;
};
var handleKeyObject = (keyObject, alg) => {
  cache ||= new WeakMap;
  let cached = cache.get(keyObject);
  if (cached?.[alg]) {
    return cached[alg];
  }
  const isPublic = keyObject.type === "public";
  const extractable = isPublic ? true : false;
  let cryptoKey;
  if (keyObject.asymmetricKeyType === "x25519") {
    switch (alg) {
      case "ECDH-ES":
      case "ECDH-ES+A128KW":
      case "ECDH-ES+A192KW":
      case "ECDH-ES+A256KW":
        break;
      default:
        throw new TypeError("given KeyObject instance cannot be used for this algorithm");
    }
    cryptoKey = keyObject.toCryptoKey(keyObject.asymmetricKeyType, extractable, isPublic ? [] : ["deriveBits"]);
  }
  if (keyObject.asymmetricKeyType === "ed25519") {
    if (alg !== "EdDSA" && alg !== "Ed25519") {
      throw new TypeError("given KeyObject instance cannot be used for this algorithm");
    }
    cryptoKey = keyObject.toCryptoKey(keyObject.asymmetricKeyType, extractable, [
      isPublic ? "verify" : "sign"
    ]);
  }
  if (keyObject.asymmetricKeyType === "rsa") {
    let hash;
    switch (alg) {
      case "RSA-OAEP":
        hash = "SHA-1";
        break;
      case "RS256":
      case "PS256":
      case "RSA-OAEP-256":
        hash = "SHA-256";
        break;
      case "RS384":
      case "PS384":
      case "RSA-OAEP-384":
        hash = "SHA-384";
        break;
      case "RS512":
      case "PS512":
      case "RSA-OAEP-512":
        hash = "SHA-512";
        break;
      default:
        throw new TypeError("given KeyObject instance cannot be used for this algorithm");
    }
    if (alg.startsWith("RSA-OAEP")) {
      return keyObject.toCryptoKey({
        name: "RSA-OAEP",
        hash
      }, extractable, isPublic ? ["encrypt"] : ["decrypt"]);
    }
    cryptoKey = keyObject.toCryptoKey({
      name: alg.startsWith("PS") ? "RSA-PSS" : "RSASSA-PKCS1-v1_5",
      hash
    }, extractable, [isPublic ? "verify" : "sign"]);
  }
  if (keyObject.asymmetricKeyType === "ec") {
    const nist = new Map([
      ["prime256v1", "P-256"],
      ["secp384r1", "P-384"],
      ["secp521r1", "P-521"]
    ]);
    const namedCurve = nist.get(keyObject.asymmetricKeyDetails?.namedCurve);
    if (!namedCurve) {
      throw new TypeError("given KeyObject instance cannot be used for this algorithm");
    }
    if (alg === "ES256" && namedCurve === "P-256") {
      cryptoKey = keyObject.toCryptoKey({
        name: "ECDSA",
        namedCurve
      }, extractable, [isPublic ? "verify" : "sign"]);
    }
    if (alg === "ES384" && namedCurve === "P-384") {
      cryptoKey = keyObject.toCryptoKey({
        name: "ECDSA",
        namedCurve
      }, extractable, [isPublic ? "verify" : "sign"]);
    }
    if (alg === "ES512" && namedCurve === "P-521") {
      cryptoKey = keyObject.toCryptoKey({
        name: "ECDSA",
        namedCurve
      }, extractable, [isPublic ? "verify" : "sign"]);
    }
    if (alg.startsWith("ECDH-ES")) {
      cryptoKey = keyObject.toCryptoKey({
        name: "ECDH",
        namedCurve
      }, extractable, isPublic ? [] : ["deriveBits"]);
    }
  }
  if (!cryptoKey) {
    throw new TypeError("given KeyObject instance cannot be used for this algorithm");
  }
  if (!cached) {
    cache.set(keyObject, { [alg]: cryptoKey });
  } else {
    cached[alg] = cryptoKey;
  }
  return cryptoKey;
};
var normalize_key_default = async (key, alg) => {
  if (key instanceof Uint8Array) {
    return key;
  }
  if (isCryptoKey(key)) {
    return key;
  }
  if (isKeyObject(key)) {
    if (key.type === "secret") {
      return key.export();
    }
    if ("toCryptoKey" in key && typeof key.toCryptoKey === "function") {
      try {
        return handleKeyObject(key, alg);
      } catch (err) {
        if (err instanceof TypeError) {
          throw err;
        }
      }
    }
    let jwk = key.export({ format: "jwk" });
    return handleJWK(key, jwk, alg);
  }
  if (isJWK(key)) {
    if (key.k) {
      return decode(key.k);
    }
    return handleJWK(key, key, alg, true);
  }
  throw new Error("unreachable");
};

// ../../node_modules/@whop/api/node_modules/jose/dist/webapi/lib/check_key_type.js
var tag = (key) => key?.[Symbol.toStringTag];
var jwkMatchesOp = (alg, key, usage) => {
  if (key.use !== undefined) {
    let expected;
    switch (usage) {
      case "sign":
      case "verify":
        expected = "sig";
        break;
      case "encrypt":
      case "decrypt":
        expected = "enc";
        break;
    }
    if (key.use !== expected) {
      throw new TypeError(`Invalid key for this operation, its "use" must be "${expected}" when present`);
    }
  }
  if (key.alg !== undefined && key.alg !== alg) {
    throw new TypeError(`Invalid key for this operation, its "alg" must be "${alg}" when present`);
  }
  if (Array.isArray(key.key_ops)) {
    let expectedKeyOp;
    switch (true) {
      case (usage === "sign" || usage === "verify"):
      case alg === "dir":
      case alg.includes("CBC-HS"):
        expectedKeyOp = usage;
        break;
      case alg.startsWith("PBES2"):
        expectedKeyOp = "deriveBits";
        break;
      case /^A\d{3}(?:GCM)?(?:KW)?$/.test(alg):
        if (!alg.includes("GCM") && alg.endsWith("KW")) {
          expectedKeyOp = usage === "encrypt" ? "wrapKey" : "unwrapKey";
        } else {
          expectedKeyOp = usage;
        }
        break;
      case (usage === "encrypt" && alg.startsWith("RSA")):
        expectedKeyOp = "wrapKey";
        break;
      case usage === "decrypt":
        expectedKeyOp = alg.startsWith("RSA") ? "unwrapKey" : "deriveBits";
        break;
    }
    if (expectedKeyOp && key.key_ops?.includes?.(expectedKeyOp) === false) {
      throw new TypeError(`Invalid key for this operation, its "key_ops" must include "${expectedKeyOp}" when present`);
    }
  }
  return true;
};
var symmetricTypeCheck = (alg, key, usage) => {
  if (key instanceof Uint8Array)
    return;
  if (isJWK(key)) {
    if (isSecretJWK(key) && jwkMatchesOp(alg, key, usage))
      return;
    throw new TypeError(`JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present`);
  }
  if (!is_key_like_default(key)) {
    throw new TypeError(withAlg(alg, key, "CryptoKey", "KeyObject", "JSON Web Key", "Uint8Array"));
  }
  if (key.type !== "secret") {
    throw new TypeError(`${tag(key)} instances for symmetric algorithms must be of type "secret"`);
  }
};
var asymmetricTypeCheck = (alg, key, usage) => {
  if (isJWK(key)) {
    switch (usage) {
      case "decrypt":
      case "sign":
        if (isPrivateJWK(key) && jwkMatchesOp(alg, key, usage))
          return;
        throw new TypeError(`JSON Web Key for this operation be a private JWK`);
      case "encrypt":
      case "verify":
        if (isPublicJWK(key) && jwkMatchesOp(alg, key, usage))
          return;
        throw new TypeError(`JSON Web Key for this operation be a public JWK`);
    }
  }
  if (!is_key_like_default(key)) {
    throw new TypeError(withAlg(alg, key, "CryptoKey", "KeyObject", "JSON Web Key"));
  }
  if (key.type === "secret") {
    throw new TypeError(`${tag(key)} instances for asymmetric algorithms must not be of type "secret"`);
  }
  if (key.type === "public") {
    switch (usage) {
      case "sign":
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm signing must be of type "private"`);
      case "decrypt":
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm decryption must be of type "private"`);
      default:
        break;
    }
  }
  if (key.type === "private") {
    switch (usage) {
      case "verify":
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm verifying must be of type "public"`);
      case "encrypt":
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm encryption must be of type "public"`);
      default:
        break;
    }
  }
};
var check_key_type_default = (alg, key, usage) => {
  const symmetric = alg.startsWith("HS") || alg === "dir" || alg.startsWith("PBES2") || /^A(?:128|192|256)(?:GCM)?(?:KW)?$/.test(alg) || /^A(?:128|192|256)CBC-HS(?:256|384|512)$/.test(alg);
  if (symmetric) {
    symmetricTypeCheck(alg, key, usage);
  } else {
    asymmetricTypeCheck(alg, key, usage);
  }
};

// ../../node_modules/@whop/api/node_modules/jose/dist/webapi/lib/subtle_dsa.js
var subtle_dsa_default = (alg, algorithm) => {
  const hash = `SHA-${alg.slice(-3)}`;
  switch (alg) {
    case "HS256":
    case "HS384":
    case "HS512":
      return { hash, name: "HMAC" };
    case "PS256":
    case "PS384":
    case "PS512":
      return { hash, name: "RSA-PSS", saltLength: parseInt(alg.slice(-3), 10) >> 3 };
    case "RS256":
    case "RS384":
    case "RS512":
      return { hash, name: "RSASSA-PKCS1-v1_5" };
    case "ES256":
    case "ES384":
    case "ES512":
      return { hash, name: "ECDSA", namedCurve: algorithm.namedCurve };
    case "Ed25519":
    case "EdDSA":
      return { name: "Ed25519" };
    default:
      throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
  }
};

// ../../node_modules/@whop/api/node_modules/jose/dist/webapi/lib/get_sign_verify_key.js
var get_sign_verify_key_default = async (alg, key, usage) => {
  if (key instanceof Uint8Array) {
    if (!alg.startsWith("HS")) {
      throw new TypeError(invalid_key_input_default(key, "CryptoKey", "KeyObject", "JSON Web Key"));
    }
    return crypto.subtle.importKey("raw", key, { hash: `SHA-${alg.slice(-3)}`, name: "HMAC" }, false, [usage]);
  }
  checkSigCryptoKey(key, alg, usage);
  return key;
};

// ../../node_modules/@whop/api/node_modules/jose/dist/webapi/lib/verify.js
var verify_default = async (alg, key, signature, data) => {
  const cryptoKey = await get_sign_verify_key_default(alg, key, "verify");
  check_key_length_default(alg, cryptoKey);
  const algorithm = subtle_dsa_default(alg, cryptoKey.algorithm);
  try {
    return await crypto.subtle.verify(algorithm, cryptoKey, signature, data);
  } catch {
    return false;
  }
};

// ../../node_modules/@whop/api/node_modules/jose/dist/webapi/jws/flattened/verify.js
async function flattenedVerify(jws, key, options) {
  if (!is_object_default(jws)) {
    throw new JWSInvalid("Flattened JWS must be an object");
  }
  if (jws.protected === undefined && jws.header === undefined) {
    throw new JWSInvalid('Flattened JWS must have either of the "protected" or "header" members');
  }
  if (jws.protected !== undefined && typeof jws.protected !== "string") {
    throw new JWSInvalid("JWS Protected Header incorrect type");
  }
  if (jws.payload === undefined) {
    throw new JWSInvalid("JWS Payload missing");
  }
  if (typeof jws.signature !== "string") {
    throw new JWSInvalid("JWS Signature missing or incorrect type");
  }
  if (jws.header !== undefined && !is_object_default(jws.header)) {
    throw new JWSInvalid("JWS Unprotected Header incorrect type");
  }
  let parsedProt = {};
  if (jws.protected) {
    try {
      const protectedHeader = decode(jws.protected);
      parsedProt = JSON.parse(decoder.decode(protectedHeader));
    } catch {
      throw new JWSInvalid("JWS Protected Header is invalid");
    }
  }
  if (!is_disjoint_default(parsedProt, jws.header)) {
    throw new JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
  }
  const joseHeader = {
    ...parsedProt,
    ...jws.header
  };
  const extensions = validate_crit_default(JWSInvalid, new Map([["b64", true]]), options?.crit, parsedProt, joseHeader);
  let b64 = true;
  if (extensions.has("b64")) {
    b64 = parsedProt.b64;
    if (typeof b64 !== "boolean") {
      throw new JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
    }
  }
  const { alg } = joseHeader;
  if (typeof alg !== "string" || !alg) {
    throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
  }
  const algorithms = options && validate_algorithms_default("algorithms", options.algorithms);
  if (algorithms && !algorithms.has(alg)) {
    throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed');
  }
  if (b64) {
    if (typeof jws.payload !== "string") {
      throw new JWSInvalid("JWS Payload must be a string");
    }
  } else if (typeof jws.payload !== "string" && !(jws.payload instanceof Uint8Array)) {
    throw new JWSInvalid("JWS Payload must be a string or an Uint8Array instance");
  }
  let resolvedKey = false;
  if (typeof key === "function") {
    key = await key(parsedProt, jws);
    resolvedKey = true;
  }
  check_key_type_default(alg, key, "verify");
  const data = concat(encoder.encode(jws.protected ?? ""), encoder.encode("."), typeof jws.payload === "string" ? encoder.encode(jws.payload) : jws.payload);
  let signature;
  try {
    signature = decode(jws.signature);
  } catch {
    throw new JWSInvalid("Failed to base64url decode the signature");
  }
  const k = await normalize_key_default(key, alg);
  const verified = await verify_default(alg, k, signature, data);
  if (!verified) {
    throw new JWSSignatureVerificationFailed;
  }
  let payload;
  if (b64) {
    try {
      payload = decode(jws.payload);
    } catch {
      throw new JWSInvalid("Failed to base64url decode the payload");
    }
  } else if (typeof jws.payload === "string") {
    payload = encoder.encode(jws.payload);
  } else {
    payload = jws.payload;
  }
  const result = { payload };
  if (jws.protected !== undefined) {
    result.protectedHeader = parsedProt;
  }
  if (jws.header !== undefined) {
    result.unprotectedHeader = jws.header;
  }
  if (resolvedKey) {
    return { ...result, key: k };
  }
  return result;
}

// ../../node_modules/@whop/api/node_modules/jose/dist/webapi/jws/compact/verify.js
async function compactVerify(jws, key, options) {
  if (jws instanceof Uint8Array) {
    jws = decoder.decode(jws);
  }
  if (typeof jws !== "string") {
    throw new JWSInvalid("Compact JWS must be a string or Uint8Array");
  }
  const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split(".");
  if (length !== 3) {
    throw new JWSInvalid("Invalid Compact JWS");
  }
  const verified = await flattenedVerify({ payload, protected: protectedHeader, signature }, key, options);
  const result = { payload: verified.payload, protectedHeader: verified.protectedHeader };
  if (typeof key === "function") {
    return { ...result, key: verified.key };
  }
  return result;
}

// ../../node_modules/@whop/api/node_modules/jose/dist/webapi/lib/epoch.js
var epoch_default = (date) => Math.floor(date.getTime() / 1000);

// ../../node_modules/@whop/api/node_modules/jose/dist/webapi/lib/secs.js
var minute = 60;
var hour = minute * 60;
var day = hour * 24;
var week = day * 7;
var year = day * 365.25;
var REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
var secs_default = (str) => {
  const matched = REGEX.exec(str);
  if (!matched || matched[4] && matched[1]) {
    throw new TypeError("Invalid time period format");
  }
  const value = parseFloat(matched[2]);
  const unit = matched[3].toLowerCase();
  let numericDate;
  switch (unit) {
    case "sec":
    case "secs":
    case "second":
    case "seconds":
    case "s":
      numericDate = Math.round(value);
      break;
    case "minute":
    case "minutes":
    case "min":
    case "mins":
    case "m":
      numericDate = Math.round(value * minute);
      break;
    case "hour":
    case "hours":
    case "hr":
    case "hrs":
    case "h":
      numericDate = Math.round(value * hour);
      break;
    case "day":
    case "days":
    case "d":
      numericDate = Math.round(value * day);
      break;
    case "week":
    case "weeks":
    case "w":
      numericDate = Math.round(value * week);
      break;
    default:
      numericDate = Math.round(value * year);
      break;
  }
  if (matched[1] === "-" || matched[4] === "ago") {
    return -numericDate;
  }
  return numericDate;
};

// ../../node_modules/@whop/api/node_modules/jose/dist/webapi/lib/jwt_claims_set.js
function validateInput(label, input) {
  if (!Number.isFinite(input)) {
    throw new TypeError(`Invalid ${label} input`);
  }
  return input;
}
var normalizeTyp = (value) => {
  if (value.includes("/")) {
    return value.toLowerCase();
  }
  return `application/${value.toLowerCase()}`;
};
var checkAudiencePresence = (audPayload, audOption) => {
  if (typeof audPayload === "string") {
    return audOption.includes(audPayload);
  }
  if (Array.isArray(audPayload)) {
    return audOption.some(Set.prototype.has.bind(new Set(audPayload)));
  }
  return false;
};
function validateClaimsSet(protectedHeader, encodedPayload, options = {}) {
  let payload;
  try {
    payload = JSON.parse(decoder.decode(encodedPayload));
  } catch {}
  if (!is_object_default(payload)) {
    throw new JWTInvalid("JWT Claims Set must be a top-level JSON object");
  }
  const { typ } = options;
  if (typ && (typeof protectedHeader.typ !== "string" || normalizeTyp(protectedHeader.typ) !== normalizeTyp(typ))) {
    throw new JWTClaimValidationFailed('unexpected "typ" JWT header value', payload, "typ", "check_failed");
  }
  const { requiredClaims = [], issuer, subject, audience, maxTokenAge } = options;
  const presenceCheck = [...requiredClaims];
  if (maxTokenAge !== undefined)
    presenceCheck.push("iat");
  if (audience !== undefined)
    presenceCheck.push("aud");
  if (subject !== undefined)
    presenceCheck.push("sub");
  if (issuer !== undefined)
    presenceCheck.push("iss");
  for (const claim of new Set(presenceCheck.reverse())) {
    if (!(claim in payload)) {
      throw new JWTClaimValidationFailed(`missing required "${claim}" claim`, payload, claim, "missing");
    }
  }
  if (issuer && !(Array.isArray(issuer) ? issuer : [issuer]).includes(payload.iss)) {
    throw new JWTClaimValidationFailed('unexpected "iss" claim value', payload, "iss", "check_failed");
  }
  if (subject && payload.sub !== subject) {
    throw new JWTClaimValidationFailed('unexpected "sub" claim value', payload, "sub", "check_failed");
  }
  if (audience && !checkAudiencePresence(payload.aud, typeof audience === "string" ? [audience] : audience)) {
    throw new JWTClaimValidationFailed('unexpected "aud" claim value', payload, "aud", "check_failed");
  }
  let tolerance;
  switch (typeof options.clockTolerance) {
    case "string":
      tolerance = secs_default(options.clockTolerance);
      break;
    case "number":
      tolerance = options.clockTolerance;
      break;
    case "undefined":
      tolerance = 0;
      break;
    default:
      throw new TypeError("Invalid clockTolerance option type");
  }
  const { currentDate } = options;
  const now = epoch_default(currentDate || new Date);
  if ((payload.iat !== undefined || maxTokenAge) && typeof payload.iat !== "number") {
    throw new JWTClaimValidationFailed('"iat" claim must be a number', payload, "iat", "invalid");
  }
  if (payload.nbf !== undefined) {
    if (typeof payload.nbf !== "number") {
      throw new JWTClaimValidationFailed('"nbf" claim must be a number', payload, "nbf", "invalid");
    }
    if (payload.nbf > now + tolerance) {
      throw new JWTClaimValidationFailed('"nbf" claim timestamp check failed', payload, "nbf", "check_failed");
    }
  }
  if (payload.exp !== undefined) {
    if (typeof payload.exp !== "number") {
      throw new JWTClaimValidationFailed('"exp" claim must be a number', payload, "exp", "invalid");
    }
    if (payload.exp <= now - tolerance) {
      throw new JWTExpired('"exp" claim timestamp check failed', payload, "exp", "check_failed");
    }
  }
  if (maxTokenAge) {
    const age = now - payload.iat;
    const max = typeof maxTokenAge === "number" ? maxTokenAge : secs_default(maxTokenAge);
    if (age - tolerance > max) {
      throw new JWTExpired('"iat" claim timestamp check failed (too far in the past)', payload, "iat", "check_failed");
    }
    if (age < 0 - tolerance) {
      throw new JWTClaimValidationFailed('"iat" claim timestamp check failed (it should be in the past)', payload, "iat", "check_failed");
    }
  }
  return payload;
}

class JWTClaimsBuilder {
  #payload;
  constructor(payload) {
    if (!is_object_default(payload)) {
      throw new TypeError("JWT Claims Set MUST be an object");
    }
    this.#payload = structuredClone(payload);
  }
  data() {
    return encoder.encode(JSON.stringify(this.#payload));
  }
  get iss() {
    return this.#payload.iss;
  }
  set iss(value) {
    this.#payload.iss = value;
  }
  get sub() {
    return this.#payload.sub;
  }
  set sub(value) {
    this.#payload.sub = value;
  }
  get aud() {
    return this.#payload.aud;
  }
  set aud(value) {
    this.#payload.aud = value;
  }
  set jti(value) {
    this.#payload.jti = value;
  }
  set nbf(value) {
    if (typeof value === "number") {
      this.#payload.nbf = validateInput("setNotBefore", value);
    } else if (value instanceof Date) {
      this.#payload.nbf = validateInput("setNotBefore", epoch_default(value));
    } else {
      this.#payload.nbf = epoch_default(new Date) + secs_default(value);
    }
  }
  set exp(value) {
    if (typeof value === "number") {
      this.#payload.exp = validateInput("setExpirationTime", value);
    } else if (value instanceof Date) {
      this.#payload.exp = validateInput("setExpirationTime", epoch_default(value));
    } else {
      this.#payload.exp = epoch_default(new Date) + secs_default(value);
    }
  }
  set iat(value) {
    if (typeof value === "undefined") {
      this.#payload.iat = epoch_default(new Date);
    } else if (value instanceof Date) {
      this.#payload.iat = validateInput("setIssuedAt", epoch_default(value));
    } else if (typeof value === "string") {
      this.#payload.iat = validateInput("setIssuedAt", epoch_default(new Date) + secs_default(value));
    } else {
      this.#payload.iat = validateInput("setIssuedAt", value);
    }
  }
}

// ../../node_modules/@whop/api/node_modules/jose/dist/webapi/jwt/verify.js
async function jwtVerify(jwt, key, options) {
  const verified = await compactVerify(jwt, key, options);
  if (verified.protectedHeader.crit?.includes("b64") && verified.protectedHeader.b64 === false) {
    throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
  }
  const payload = validateClaimsSet(verified.protectedHeader, verified.payload, options);
  const result = { payload, protectedHeader: verified.protectedHeader };
  if (typeof key === "function") {
    return { ...result, key: verified.key };
  }
  return result;
}
// ../../node_modules/@whop/api/dist/chunk-WYHVVPYG.mjs
var import_js_md5 = __toESM(require_md5(), 1);
var import_tiny_typed_emitter = __toESM(require_lib(), 1);
var __defProp2 = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp2(target, name, { get: all[name], enumerable: true });
};
var USER_TOKEN_HEADER_NAME = "x-whop-user-token";
var USER_TOKEN_VERIFICATION_KEY = '{"kty":"EC","x":"rz8a8vxvexHC0TLT91g7llOdDOsNuYiGEfic4Qhni-E","y":"zH0QblKYToexd5PEIMGXPVJS9AB5smKrW4S_TbiXrOs","crv":"P-256"}';
function getUserToken(tokenOrHeadersOrRequest) {
  if (typeof tokenOrHeadersOrRequest === "string")
    return tokenOrHeadersOrRequest;
  if (tokenOrHeadersOrRequest instanceof Headers)
    return tokenOrHeadersOrRequest.get(USER_TOKEN_HEADER_NAME);
  if (tokenOrHeadersOrRequest instanceof Request)
    return tokenOrHeadersOrRequest.headers.get(USER_TOKEN_HEADER_NAME);
  return null;
}
function makeUserTokenVerifier(options) {
  return async function verifyUserToken2(tokenOrHeadersOrRequest, overrideOptions) {
    return await internalVerifyUserToken(tokenOrHeadersOrRequest, {
      ...options,
      ...overrideOptions
    });
  };
}
function verifyUserToken(tokenOrHeadersOrRequest, overrideOptions) {
  return internalVerifyUserToken(tokenOrHeadersOrRequest, {
    ...overrideOptions
  });
}
async function internalVerifyUserToken(tokenOrHeadersOrRequest, options) {
  try {
    const tokenString = getUserToken(tokenOrHeadersOrRequest);
    if (!tokenString) {
      throw new Error("Whop user token not found. If you are the app developer, ensure you are developing in the whop.com iframe and have the dev proxy enabled.");
    }
    const jwkString = options.publicKey ?? USER_TOKEN_VERIFICATION_KEY;
    const key = await importJWK(JSON.parse(jwkString), "ES256").catch(() => {
      throw new Error("Invalid public key provided to verifyUserToken");
    });
    const token = await jwtVerify(tokenString, key, {
      issuer: "urn:whopcom:exp-proxy"
    }).catch((_e) => {
      throw new Error("Invalid user token provided to verifyUserToken");
    });
    if (!(token.payload.sub && token.payload.aud) || Array.isArray(token.payload.aud)) {
      throw new Error("Invalid user token provided to verifyUserToken");
    }
    if (options.appId && token.payload.aud !== options.appId)
      throw new Error("Invalid app id provided to verifyUserToken");
    return {
      appId: token.payload.aud,
      userId: token.payload.sub
    };
  } catch (e) {
    if (options.dontThrow) {
      return null;
    }
    throw e;
  }
}
var proto_exports = {};
__export(proto_exports, {
  bounties_app: () => index_bounties_app_exports,
  calendar_bookings_app: () => index_calendar_bookings_app_exports,
  common: () => index_common_exports,
  content_app: () => index_content_app_exports,
  content_rewards_app: () => index_content_rewards_app_exports,
  courses_app: () => index_courses_app_exports,
  events_app: () => index_events_app_exports,
  experience: () => index_experience_exports,
  games: () => index_games_exports,
  google: () => index_google_exports,
  wheel_app: () => index_wheel_app_exports
});
var index_common_exports = {};
__export(index_common_exports, {
  AccessPassExperience_UpsellType: () => AccessPassExperience_UpsellType,
  AccessPass_AccessPassType: () => AccessPass_AccessPassType,
  AccessPass_Visibility: () => AccessPass_Visibility,
  AccessType: () => AccessType,
  ActiveUserBucket_UserBucketType: () => ActiveUserBucket_UserBucketType,
  AppBuild_Status: () => AppBuild_Status,
  AppViewType: () => AppViewType,
  ChannelSubscriptionState_DisconnectionReason: () => ChannelSubscriptionState_DisconnectionReason,
  Channel_Type: () => Channel_Type,
  ConnectedId_Type: () => ConnectedId_Type,
  Entry_EntryStatus: () => Entry_EntryStatus,
  FeedChatFeed_MemberPermissionType: () => FeedChatFeed_MemberPermissionType,
  FeedDmsFeedMember_DmsFeedMemberStatus: () => FeedDmsFeedMember_DmsFeedMemberStatus,
  FeedDmsFeedMember_NotificationPreference: () => FeedDmsFeedMember_NotificationPreference,
  FeedDmsPost_MessageType: () => FeedDmsPost_MessageType,
  FeedForumFeed_EmailNotificationPreferenceType: () => FeedForumFeed_EmailNotificationPreferenceType,
  FeedForumFeed_LayoutType: () => FeedForumFeed_LayoutType,
  FeedForumFeed_MemberPermissionType: () => FeedForumFeed_MemberPermissionType,
  FeedForumPost_ForumPostType: () => FeedForumPost_ForumPostType,
  FeedLivestreamFeed_MemberPermissionType: () => FeedLivestreamFeed_MemberPermissionType,
  FeedReaction_ReactionType: () => FeedReaction_ReactionType,
  GetTopExperiencesByActiveUsersRequest_AppFilter: () => GetTopExperiencesByActiveUsersRequest_AppFilter,
  GoFetchNotifications_NotifyingEntityType: () => GoFetchNotifications_NotifyingEntityType,
  MuxAsset_MuxAssetStatus: () => MuxAsset_MuxAssetStatus,
  Plan_PlanType: () => Plan_PlanType,
  Plan_ReleaseMethod: () => Plan_ReleaseMethod,
  Plan_Visibility: () => Plan_Visibility,
  Platform: () => Platform,
  Position_Type: () => Position_Type,
  PostReactionCount_ReactionType: () => PostReactionCount_ReactionType,
  ProductSurface_DiscoverSection: () => ProductSurface_DiscoverSection,
  ProductSurface_FeedTab: () => ProductSurface_FeedTab,
  ProductSurface_SurfaceType: () => ProductSurface_SurfaceType,
  ProductSurface_ViewContext: () => ProductSurface_ViewContext,
  Purchase_ReleaseMethod: () => Purchase_ReleaseMethod,
  ResourceType: () => ResourceType,
  UserType: () => UserType,
  User_PlatformRole: () => User_PlatformRole
});
var UserType = {
  UNKNOWN_TYPE: "UNKNOWN_TYPE",
  HUMAN: "HUMAN",
  SYSTEM: "SYSTEM",
  AGENT: "AGENT",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var User_PlatformRole = {
  UNKNOWN_ROLE: "UNKNOWN_ROLE",
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  TRUST_AND_SAFETY_MANAGER: "TRUST_AND_SAFETY_MANAGER",
  MANAGER: "MANAGER",
  SUPPORT: "SUPPORT",
  TESTER: "TESTER",
  SEO_MANAGER: "SEO_MANAGER",
  TEMPLATE_USER: "TEMPLATE_USER",
  MARKETPLACE_MANAGER: "MARKETPLACE_MANAGER",
  DEVELOPER: "DEVELOPER",
  FINANCE_MANAGER: "FINANCE_MANAGER",
  RESOLUTION_CENTER_MANAGER: "RESOLUTION_CENTER_MANAGER",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var AppViewType = {
  APP_VIEW_TYPE_UNKNOWN: "APP_VIEW_TYPE_UNKNOWN",
  APP_VIEW_TYPE_HUB: "APP_VIEW_TYPE_HUB",
  APP_VIEW_TYPE_DASH: "APP_VIEW_TYPE_DASH",
  APP_VIEW_TYPE_ANALYTICS: "APP_VIEW_TYPE_ANALYTICS",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var AccessType = {
  UNKNOWN_ACCESS_TYPE: "UNKNOWN_ACCESS_TYPE",
  NO_ACCESS: "NO_ACCESS",
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var Platform = {
  UNKNOWN: "UNKNOWN",
  WEB: "WEB",
  IOS: "IOS",
  ANDROID: "ANDROID",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var AppBuild_Status = {
  STATUS_UNKNOWN: "STATUS_UNKNOWN",
  STATUS_DRAFT: "STATUS_DRAFT",
  STATUS_PENDING: "STATUS_PENDING",
  STATUS_APPROVED: "STATUS_APPROVED",
  STATUS_REJECTED: "STATUS_REJECTED",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var AccessPass_Visibility = {
  VISIBILITY_UNKNOWN: "VISIBILITY_UNKNOWN",
  VISIBLE: "VISIBLE",
  HIDDEN: "HIDDEN",
  ARCHIVED: "ARCHIVED",
  QUICK_LINK: "QUICK_LINK",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var AccessPass_AccessPassType = {
  ACCESS_PASS_TYPE_UNKNOWN: "ACCESS_PASS_TYPE_UNKNOWN",
  REGULAR: "REGULAR",
  APP: "APP",
  EXPERIENCE_UPSELL: "EXPERIENCE_UPSELL",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var Plan_Visibility = {
  VISIBILITY_UNKNOWN: "VISIBILITY_UNKNOWN",
  VISIBLE: "VISIBLE",
  HIDDEN: "HIDDEN",
  ARCHIVED: "ARCHIVED",
  QUICK_LINK: "QUICK_LINK",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var Plan_ReleaseMethod = {
  RELEASE_METHOD_UNKNOWN: "RELEASE_METHOD_UNKNOWN",
  BUY_NOW: "BUY_NOW",
  WAITLIST: "WAITLIST",
  RAFFLE: "RAFFLE",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var Plan_PlanType = {
  PLAN_TYPE_UNKNOWN: "PLAN_TYPE_UNKNOWN",
  RENEWAL: "RENEWAL",
  ONE_TIME: "ONE_TIME",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var Entry_EntryStatus = {
  ENTRY_STATUS_UNKNOWN: "ENTRY_STATUS_UNKNOWN",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  DENIED: "DENIED",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var AccessPassExperience_UpsellType = {
  UPSELL_TYPE_UNKNOWN: "UPSELL_TYPE_UNKNOWN",
  BEFORE_CHECKOUT: "BEFORE_CHECKOUT",
  AFTER_CHECKOUT: "AFTER_CHECKOUT",
  ONLY_IN_WHOP: "ONLY_IN_WHOP",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var Purchase_ReleaseMethod = {
  UNKNOWN: "UNKNOWN",
  BUY_NOW: "BUY_NOW",
  WAITLIST: "WAITLIST",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var ConnectedId_Type = {
  UNKNOWN: "UNKNOWN",
  ANONYMOUS: "ANONYMOUS",
  USER: "USER",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var Channel_Type = {
  UNKNOWN: "UNKNOWN",
  EXPERIENCE: "EXPERIENCE",
  NOTIFICATIONS: "NOTIFICATIONS",
  DMS: "DMS",
  USER: "USER",
  EVERYONE: "EVERYONE",
  AUTHENTICATED: "AUTHENTICATED",
  ANONYMOUS: "ANONYMOUS",
  PUBLIC: "PUBLIC",
  ACCESS_PASS: "ACCESS_PASS",
  APP: "APP",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var ChannelSubscriptionState_DisconnectionReason = {
  UNKNOWN: "UNKNOWN",
  NO_ACCESS: "NO_ACCESS",
  REQUESTED_DISCONNECT: "REQUESTED_DISCONNECT",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var Position_Type = {
  UNKNOWN: "UNKNOWN",
  MOUSE: "MOUSE",
  PLAYER: "PLAYER",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var FeedDmsPost_MessageType = {
  UNKNOWN_TYPE: "UNKNOWN_TYPE",
  REGULAR: "REGULAR",
  SYSTEM: "SYSTEM",
  AUTOMATED: "AUTOMATED",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var FeedChatFeed_MemberPermissionType = {
  UNKNOWN: "UNKNOWN",
  NONE: "NONE",
  EVERYONE: "EVERYONE",
  MEMBERS: "MEMBERS",
  ADMINS: "ADMINS",
  PRODUCT_OWNERS: "PRODUCT_OWNERS",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var FeedLivestreamFeed_MemberPermissionType = {
  UNKNOWN: "UNKNOWN",
  NONE: "NONE",
  EVERYONE: "EVERYONE",
  ADMINS: "ADMINS",
  PRODUCT_OWNERS: "PRODUCT_OWNERS",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var FeedDmsFeedMember_DmsFeedMemberStatus = {
  UNKNOWN_STATUS: "UNKNOWN_STATUS",
  REQUESTED: "REQUESTED",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var FeedDmsFeedMember_NotificationPreference = {
  UNKNOWN_PREFERENCE: "UNKNOWN_PREFERENCE",
  ALL: "ALL",
  MENTIONS: "MENTIONS",
  NONE: "NONE",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var FeedReaction_ReactionType = {
  UNKNOWN: "UNKNOWN",
  LIKE: "LIKE",
  EMOJI: "EMOJI",
  VIEW: "VIEW",
  VOTE: "VOTE",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var FeedForumFeed_MemberPermissionType = {
  UNKNOWN_PERMISSION: "UNKNOWN_PERMISSION",
  EVERYONE: "EVERYONE",
  ADMINS: "ADMINS",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var FeedForumFeed_LayoutType = {
  UNKNOWN_LAYOUT: "UNKNOWN_LAYOUT",
  FEED: "FEED",
  BLOG: "BLOG",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var FeedForumFeed_EmailNotificationPreferenceType = {
  UNKNOWN_PREFERENCE: "UNKNOWN_PREFERENCE",
  ALL_ADMIN_POSTS: "ALL_ADMIN_POSTS",
  ONLY_WEEKLY_SUMMARY: "ONLY_WEEKLY_SUMMARY",
  NONE: "NONE",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var MuxAsset_MuxAssetStatus = {
  UNKNOWN: "UNKNOWN",
  UPLOADING: "UPLOADING",
  CREATED: "CREATED",
  READY: "READY",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var PostReactionCount_ReactionType = {
  UNKNOWN: "UNKNOWN",
  LIKE: "LIKE",
  EMOJI: "EMOJI",
  VIEW: "VIEW",
  VOTE: "VOTE",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var FeedForumPost_ForumPostType = {
  UNKNOWN_TYPE: "UNKNOWN_TYPE",
  REGULAR: "REGULAR",
  AUTOMATED: "AUTOMATED",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var GoFetchNotifications_NotifyingEntityType = {
  UNKNOWN: "UNKNOWN",
  GENERIC: "GENERIC",
  EXPERIENCE: "EXPERIENCE",
  COMPANY: "COMPANY",
  COMPANY_TEAM: "COMPANY_TEAM",
  ACCESS_PASS: "ACCESS_PASS",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var ProductSurface_ViewContext = {
  VIEW_CTX_UNKNOWN: "VIEW_CTX_UNKNOWN",
  VIEW_CTX_WHOP: "VIEW_CTX_WHOP",
  VIEW_CTX_HOME_FEED: "VIEW_CTX_HOME_FEED",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var ProductSurface_DiscoverSection = {
  DISCOVER_UNKNOWN: "DISCOVER_UNKNOWN",
  DISCOVER_LEADERBOARDS: "DISCOVER_LEADERBOARDS",
  DISCOVER_FOR_YOU: "DISCOVER_FOR_YOU",
  DISCOVER_EXPLORE: "DISCOVER_EXPLORE",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var ProductSurface_FeedTab = {
  FEED_TAB_UNKNOWN: "FEED_TAB_UNKNOWN",
  FEED_TAB_HOME: "FEED_TAB_HOME",
  FEED_TAB_EARN: "FEED_TAB_EARN",
  FEED_TAB_CHAT: "FEED_TAB_CHAT",
  FEED_TAB_LEARN: "FEED_TAB_LEARN",
  FEED_TAB_CALENDAR: "FEED_TAB_CALENDAR",
  FEED_TAB_PLAY: "FEED_TAB_PLAY",
  FEED_TAB_INTEGRATIONS: "FEED_TAB_INTEGRATIONS",
  FEED_TAB_TOOLS: "FEED_TAB_TOOLS",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var ProductSurface_SurfaceType = {
  UNKNOWN: "UNKNOWN",
  EXPERIENCE: "EXPERIENCE",
  WHOP: "WHOP",
  CREATOR_DASHBOARD: "CREATOR_DASHBOARD",
  AFFILIATE_DASHBOARD: "AFFILIATE_DASHBOARD",
  DISCOVER: "DISCOVER",
  HOME_FEED: "HOME_FEED",
  MESSAGES: "MESSAGES",
  PROFILE: "PROFILE",
  NOTIFICATIONS: "NOTIFICATIONS",
  USER_SETTINGS: "USER_SETTINGS",
  CHECKOUT: "CHECKOUT",
  AUTH: "AUTH",
  OTHER: "OTHER",
  USER_ONBOARDING: "USER_ONBOARDING",
  LEADERBOARD: "LEADERBOARD",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var ActiveUserBucket_UserBucketType = {
  UNKNOWN: "UNKNOWN",
  EXPERIENCE: "EXPERIENCE",
  WHOP: "WHOP",
  STORE_PAGE: "STORE_PAGE",
  MESSAGES: "MESSAGES",
  HOME_FEED: "HOME_FEED",
  DISCOVER: "DISCOVER",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var GetTopExperiencesByActiveUsersRequest_AppFilter = {
  ALL: "ALL",
  LIVESTREAMS: "LIVESTREAMS",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var ResourceType = {
  RESOURCE_UNKNOWN: "RESOURCE_UNKNOWN",
  RESOURCE_BOT: "RESOURCE_BOT",
  RESOURCE_ACCESS_PASS: "RESOURCE_ACCESS_PASS",
  RESOURCE_EXPERIENCE: "RESOURCE_EXPERIENCE",
  RESOURCE_USER: "RESOURCE_USER",
  RESOURCE_EXPERIENCE_PREVIEW_CONTENT: "RESOURCE_EXPERIENCE_PREVIEW_CONTENT",
  RESOURCE_APP: "RESOURCE_APP",
  RESOURCE_FORUM_FEED: "RESOURCE_FORUM_FEED",
  RESOURCE_UNIVERSAL_POST: "RESOURCE_UNIVERSAL_POST",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var index_google_exports = {};
__export(index_google_exports, {
  protobuf: () => index_google_protobuf_exports
});
var index_google_protobuf_exports = {};
__export(index_google_protobuf_exports, {
  NullValue: () => NullValue
});
var NullValue = {
  NULL_VALUE: "NULL_VALUE",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var index_calendar_bookings_app_exports = {};
var index_bounties_app_exports = {};
__export(index_bounties_app_exports, {
  BountySubmission_BountySubmissionStatus: () => BountySubmission_BountySubmissionStatus,
  Bounty_BountyRewardUnit: () => Bounty_BountyRewardUnit,
  Bounty_BountyStatus: () => Bounty_BountyStatus
});
var Bounty_BountyStatus = {
  UNKNOWN_STATUS: "UNKNOWN_STATUS",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var Bounty_BountyRewardUnit = {
  UNKNOWN_REWARD_UNIT: "UNKNOWN_REWARD_UNIT",
  PER_SUBMISSION: "PER_SUBMISSION",
  PER_VIEW: "PER_VIEW",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var BountySubmission_BountySubmissionStatus = {
  UNKNOWN_STATUS: "UNKNOWN_STATUS",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  DENIED: "DENIED",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var index_content_app_exports = {};
var index_content_rewards_app_exports = {};
__export(index_content_rewards_app_exports, {
  ContentPlatform: () => ContentPlatform,
  ContentRewardsCampaign_Category: () => ContentRewardsCampaign_Category,
  ContentRewardsCampaign_ContentType: () => ContentRewardsCampaign_ContentType,
  ContentRewardsCampaign_Status: () => ContentRewardsCampaign_Status,
  ContentRewardsSubmission_Status: () => ContentRewardsSubmission_Status
});
var ContentPlatform = {
  UNKNOWN_PLATFORM: "UNKNOWN_PLATFORM",
  INSTAGRAM: "INSTAGRAM",
  TIKTOK: "TIKTOK",
  X: "X",
  YOUTUBE: "YOUTUBE",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var ContentRewardsCampaign_Status = {
  UNKNOWN: "UNKNOWN",
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
  EXPIRED: "EXPIRED",
  ARCHIVED: "ARCHIVED",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var ContentRewardsCampaign_ContentType = {
  UNKNOWN_CONTENT_TYPE: "UNKNOWN_CONTENT_TYPE",
  UGC: "UGC",
  CLIPPING: "CLIPPING",
  FACELESS: "FACELESS",
  OTHER_CONTENT_TYPE: "OTHER_CONTENT_TYPE",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var ContentRewardsCampaign_Category = {
  UNKNOWN_CATEGORY: "UNKNOWN_CATEGORY",
  CREATOR: "CREATOR",
  BRAND: "BRAND",
  INFLUENCER: "INFLUENCER",
  STREAMER: "STREAMER",
  MUSICIAN: "MUSICIAN",
  OTHER: "OTHER",
  ECOMMERCE: "ECOMMERCE",
  LOGO: "LOGO",
  MUSIC: "MUSIC",
  PODCAST: "PODCAST",
  SOFTWARE: "SOFTWARE",
  STREAM: "STREAM",
  ENTERTAINMENT: "ENTERTAINMENT",
  PRODUCTS: "PRODUCTS",
  PERSONAL_BRAND: "PERSONAL_BRAND",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var ContentRewardsSubmission_Status = {
  UNKNOWN: "UNKNOWN",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  FLAGGED: "FLAGGED",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var index_courses_app_exports = {};
var index_events_app_exports = {};
__export(index_events_app_exports, {
  Event_LocationType: () => Event_LocationType,
  Event_RecurringRule: () => Event_RecurringRule
});
var Event_LocationType = {
  UNKNOWN_LOCATION_TYPE: "UNKNOWN_LOCATION_TYPE",
  OFFLINE: "OFFLINE",
  ONLINE: "ONLINE",
  ZOOM: "ZOOM",
  GOOGLE_MEET: "GOOGLE_MEET",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var Event_RecurringRule = {
  UNKNOWN_RECURRING_RULE: "UNKNOWN_RECURRING_RULE",
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var index_wheel_app_exports = {};
__export(index_wheel_app_exports, {
  Spin_SpinStatus: () => Spin_SpinStatus
});
var Spin_SpinStatus = {
  UNKNOWN_SPIN_STATUS: "UNKNOWN_SPIN_STATUS",
  WON: "WON",
  LOST: "LOST",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var index_experience_exports = {};
var index_games_exports = {};
__export(index_games_exports, {
  quizzes: () => index_games_quizzes_exports
});
var index_games_quizzes_exports = {};
__export(index_games_quizzes_exports, {
  HostCommand_StatusCommand: () => HostCommand_StatusCommand,
  QuizStatus: () => QuizStatus
});
var QuizStatus = {
  UNKNOWN: "UNKNOWN",
  WAITING_FOR_PLAYERS: "WAITING_FOR_PLAYERS",
  SHOW_QUESTION: "SHOW_QUESTION",
  ANSWER_QUESTION: "ANSWER_QUESTION",
  QUESTION_RESULT: "QUESTION_RESULT",
  QUESTION_LEADERBOARD: "QUESTION_LEADERBOARD",
  GAME_RESULT: "GAME_RESULT",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var HostCommand_StatusCommand = {
  UNKNOWN: "UNKNOWN",
  NEXT: "NEXT",
  END_GAME: "END_GAME",
  GO_BACK_TO_LOBBY: "GO_BACK_TO_LOBBY",
  SKIP_TO_END_RESULTS: "SKIP_TO_END_RESULTS",
  UNRECOGNIZED: "UNRECOGNIZED"
};
var RetryError = class extends Error {
  constructor(message2, errors, maxRetries) {
    super(message2);
    this.errors = errors;
    this.maxRetries = maxRetries;
    this.name = "RetryError";
  }
};
async function retry(fn, maxRetries, signal, ...args) {
  let tries = 0;
  const errors = [];
  while (tries < maxRetries) {
    signal?.throwIfAborted();
    try {
      const res = await fn(...args);
      return res;
    } catch (error) {
      errors.push(error);
      tries++;
    }
  }
  for (const error of errors) {
    console.error(error);
  }
  throw new RetryError("Failed to retry", errors, maxRetries);
}
var uploadTasks = [];
var workerCount = 0;
var maxWorkers = 10;
async function uploadWorker(uploadPart) {
  if (workerCount >= maxWorkers) {
    return;
  }
  workerCount++;
  while (uploadTasks.length > 0) {
    const task = uploadTasks.shift();
    if (!task) {
      continue;
    }
    try {
      const etag = await retry(uploadPart, 10, task.task.signal, task.task);
      task.resolve({ etag, partNumber: task.task.partNumber });
    } catch (e) {
      task.reject(e);
    }
  }
  workerCount--;
}
function uploadParts(tasks, uploadPart, priority = false) {
  const promises = tasks.map((task) => {
    return new Promise((resolve, reject) => {
      if (priority) {
        uploadTasks.unshift({ task, resolve, reject });
      } else {
        uploadTasks.push({ task, resolve, reject });
      }
    });
  });
  for (let i = 0;i < Math.min(tasks.length, maxWorkers); i++) {
    uploadWorker(uploadPart);
  }
  return Promise.all(promises);
}
function sum(...args) {
  return args.reduce((acc, curr) => acc + curr, 0);
}
async function handleUpload({ data, ...preparedFile }, {
  onProgress,
  signal,
  uploadPart
}) {
  if (preparedFile.multipart) {
    const loaded = Array(preparedFile.multipartUploadUrls.length).fill(0);
    const result = await uploadParts(preparedFile.multipartUploadUrls.map((part, index) => ({
      ...part,
      fullData: data,
      onProgress: (event) => {
        loaded[index] = event.loaded;
        const total = sum(...loaded);
        onProgress?.(Math.round(total / data.size * 100));
      },
      signal
    })), uploadPart);
    return result;
  }
  await uploadParts([
    {
      url: preparedFile.uploadUrl,
      fullData: data,
      partNumber: 1,
      headers: preparedFile.headers,
      onProgress: (event) => {
        onProgress?.(Math.round(event.loaded / data.size * 100));
      },
      signal
    }
  ], uploadPart, true);
  return [];
}
function getMediaType(data) {
  switch (true) {
    case data.type.startsWith("image/"):
      return "image";
    case data.type.startsWith("video/"):
      return "video";
    case data.type.startsWith("audio/"):
      return "audio";
    default:
      return "other";
  }
}
function makeUploadAttachmentFunction({
  uploadPart
}) {
  return async function uploadAttachment(input, { onProgress, signal } = {}) {
    const preparedAttachment = "record" in input && "file" in input ? await this.prepareAttachmentForUpload(input.file, input.record) : await input;
    const result = await handleUpload(preparedAttachment, {
      onProgress,
      signal,
      uploadPart
    });
    const mediaType = getMediaType(preparedAttachment.data);
    if (preparedAttachment.multipart) {
      await this.attachments.processAttachment({
        directUploadId: preparedAttachment.id,
        mediaType,
        multipartUploadId: preparedAttachment.multipartUploadId,
        multipartParts: result
      });
    } else {
      await this.attachments.processAttachment({
        directUploadId: preparedAttachment.id,
        mediaType
      });
    }
    const attachment = await this.analyzeAttachment(preparedAttachment.id, {
      signal
    });
    if (!attachment) {
      throw new Error("Failed to analyze Attachment");
    }
    return {
      directUploadId: preparedAttachment.id,
      record: preparedAttachment.record,
      attachment
    };
  };
}
async function analyzeAttachment(signedId, opts) {
  while (!opts?.signal?.aborted) {
    const attachment = await this.attachments.getAttachment({ id: signedId }, { signal: opts?.signal }).catch(() => null);
    if (attachment) {
      return attachment;
    }
  }
}
var MULTIPART_UPLOAD_CHUNK_SIZE = 5 * 1024 * 1024;
var withAwaitableParams = (fn) => {
  return (...args) => {
    const casted = args;
    const hasPromises = casted.some((arg) => arg instanceof Promise);
    if (hasPromises) {
      return new Promise((resolve, reject) => {
        return Promise.all(casted).then((args2) => {
          return fn(...args2);
        }).then(resolve).catch(reject);
      });
    }
    return fn(...args);
  };
};
var encodings = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function b64Raw(arrayBuffer) {
  let base64 = "";
  const bytes = new Uint8Array(arrayBuffer);
  const byteLength = bytes.byteLength;
  const byteRemainder = byteLength % 3;
  const mainLength = byteLength - byteRemainder;
  let a;
  let b;
  let c;
  let d;
  let chunk;
  for (let i = 0;i < mainLength; i = i + 3) {
    chunk = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
    a = (chunk & 16515072) >> 18;
    b = (chunk & 258048) >> 12;
    c = (chunk & 4032) >> 6;
    d = chunk & 63;
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
  }
  if (byteRemainder === 1) {
    chunk = bytes[mainLength];
    a = (chunk & 252) >> 2;
    b = (chunk & 3) << 4;
    base64 += `${encodings[a]}${encodings[b]}==`;
  } else if (byteRemainder === 2) {
    chunk = bytes[mainLength] << 8 | bytes[mainLength + 1];
    a = (chunk & 64512) >> 10;
    b = (chunk & 1008) >> 4;
    c = (chunk & 15) << 2;
    base64 += `${encodings[a]}${encodings[b]}${encodings[c]}=`;
  }
  return base64;
}
var b64 = withAwaitableParams(b64Raw);
async function md5(stream) {
  const hasher = import_js_md5.md5.create();
  await stream.pipeTo(new WritableStream({
    write(chunk) {
      hasher.update(chunk);
    }
  }));
  return hasher.arrayBuffer();
}
async function prepareAttachmentForUpload(data, record) {
  const isMultipart = data.size > MULTIPART_UPLOAD_CHUNK_SIZE;
  const mediaDirectUpload = await this.attachments.uploadMedia({
    byteSizeV2: data.size.toString(),
    record,
    filename: data instanceof File ? data.name : crypto.randomUUID(),
    contentType: data.type,
    checksum: await b64(md5(data.stream())),
    multipart: isMultipart
  });
  if (isMultipart) {
    if (!mediaDirectUpload?.multipartUploadId || !mediaDirectUpload.multipartUploadUrls) {
      throw new Error("Failed to prepare file");
    }
    return {
      data,
      id: mediaDirectUpload.id,
      multipartUploadUrls: mediaDirectUpload.multipartUploadUrls,
      multipartUploadId: mediaDirectUpload.multipartUploadId,
      record,
      multipart: true
    };
  }
  if (!mediaDirectUpload?.id || !mediaDirectUpload.uploadUrl) {
    throw new Error("Failed to prepare file");
  }
  return {
    data,
    id: mediaDirectUpload.id,
    uploadUrl: mediaDirectUpload.uploadUrl,
    headers: mediaDirectUpload.headers,
    record,
    multipart: false
  };
}
function partialFileSdkExtensions(baseSdk) {
  const prepareAttachmentForUpload2 = prepareAttachmentForUpload.bind(baseSdk);
  const analyzeAttachment2 = analyzeAttachment.bind(baseSdk);
  return {
    prepareAttachmentForUpload: prepareAttachmentForUpload2,
    analyzeAttachment: analyzeAttachment2
  };
}
function fileSdkExtensions(baseSdk, uploadAttachmentFn) {
  const partial = partialFileSdkExtensions(baseSdk);
  const uploadAttachment = uploadAttachmentFn.bind({
    ...baseSdk,
    ...partial
  });
  return {
    ...partial,
    uploadAttachment
  };
}
function getSdk(requester) {
  return {
    accessPasses: {
      getAccessPass(variables, options) {
        return requester("whop-sdk-ts-client/sha256:daea5c9cf3e5e30ef0fd9eaad8ea852ffdbd0e0088ff3ad05aacb6a761b7c6f9", "getAccessPass", "query", variables, options).then((res) => res.accessPass);
      }
    },
    attachments: {
      getAttachment(variables, options) {
        return requester("whop-sdk-ts-client/sha256:07f48fb0c1292fda5a8dd5f54b5d1b637635a87b6012769819ebcf7795a045ba", "getAttachment", "query", variables, options).then((res) => res.attachment);
      },
      processAttachment(variables, options) {
        return requester("whop-sdk-ts-client/sha256:396c5803051b3c9bcedd3ce310505a4f57a6b94bc190e7142e897d9aa5036ece", "processAttachment", "mutation", { input: variables }, options).then((res) => res.mediaAnalyzeAttachment);
      },
      uploadMedia(variables, options) {
        return requester("whop-sdk-ts-client/sha256:a3d06ed16e52126d96aae83cad3400471246f37fc275e4c8f4836c98bf8e9d59", "uploadMedia", "mutation", { input: variables }, options).then((res) => res.mediaDirectUpload);
      }
    },
    courses: {
      getCourse(variables, options) {
        return requester("whop-sdk-ts-client/sha256:a70e69bec7574d2b4498d2bee86bd97adb87480599cbceeca8f63135078fd5c9", "getCourse", "query", variables, options).then((res) => res.course);
      }
    },
    experiences: {
      getExperience(variables, options) {
        return requester("whop-sdk-ts-client/sha256:114eb7b7c8403ffbe75a0c74a26ac50b5367e183a16ba64eebf4a43d5466bb4e", "getExperience", "query", variables, options).then((res) => res.experience);
      },
      listUsersForExperience(variables, options) {
        return requester("whop-sdk-ts-client/sha256:85c827d8660dc2a97e8b930e213b83493ae132c00988e0f03e02c5dc99559a5a", "listUsersForExperience", "query", variables, options).then((res) => res.publicExperience);
      }
    },
    forums: {
      listForumPostsFromForum(variables, options) {
        return requester("whop-sdk-ts-client/sha256:97a7d797f3a5f6f83bf4628cc7c586d529b90e54c0a8e193493a55b4ad05df46", "listForumPostsFromForum", "query", variables, options).then((res) => res.feedPosts);
      }
    },
    messages: {
      listMessagesFromChat(variables, options) {
        return requester("whop-sdk-ts-client/sha256:5fdbf50fe489888e5b0a98e9fe6170584bf47ab38f87d1e0b7fce8f523513894", "listMessagesFromChat", "query", variables, options).then((res) => res.feedPosts);
      }
    },
    users: {
      getCurrentUser(variables, options) {
        return requester("whop-sdk-ts-client/sha256:9f7cc9ff353a2778e55b674cfd5737a7dcaff19be9ac13d6f79aabd5d8ef69ff", "getCurrentUser", "query", variables, options).then((res) => res.viewer);
      },
      getUserLedgerAccount(variables, options) {
        return requester("whop-sdk-ts-client/sha256:d7eeaf0a388395edb82220877e72a7fc91d1f06a6d89f1cfa5e56bb400d2aa49", "getUserLedgerAccount", "query", variables, options).then((res) => res.viewer);
      },
      getUser(variables, options) {
        return requester("whop-sdk-ts-client/sha256:d8022374c6b0eb0445781342a14c9bffafd776cee4e282cb76e31af8c017d33e", "getUser", "query", variables, options).then((res) => res.publicUser);
      }
    }
  };
}
var DEFAULT_API_ORIGIN = "https://api.whop.com";
var GQLNetworkError = class extends Error {
  constructor(e) {
    const message2 = e instanceof Error ? e.message : typeof e === "string" ? e : "Unknown network error";
    super(message2);
    if (e instanceof Error)
      this.stack = e.stack;
  }
};
var GQLRequestError = class extends Error {
  statusCode;
  constructor(statusCode, message2) {
    super(message2);
    this.statusCode = statusCode;
  }
  isUnauthorized() {
    return this.statusCode === 401;
  }
  isForbidden() {
    return this.statusCode === 403;
  }
  isNotFound() {
    return this.statusCode === 404;
  }
  isServerError() {
    return this.statusCode >= 500;
  }
};
var GQLError = class extends Error {
  errors;
  constructor(errors) {
    super(errors[0].message);
    this.errors = errors;
  }
};
async function graphqlFetch(url, operationId, operationName, operationType, variables, headersInit = {}) {
  try {
    const body = {
      operationId,
      operationType,
      operationName,
      variables
    };
    const headers = new Headers(headersInit);
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");
    const urlObject = addOperationNameToUrl(url, operationName, operationId, operationType);
    const response = await fetch(urlObject, {
      method: "POST",
      body: JSON.stringify(body),
      headers
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new GQLRequestError(response.status, errorMessage);
    }
    const data = await response.json();
    if (data.errors) {
      throw new GQLError(data.errors);
    }
    return data.data;
  } catch (e) {
    throw new GQLNetworkError(e);
  }
}
function addOperationNameToUrl(url, name, operationId, operationType) {
  const urlObject = new URL(url);
  let pathname = urlObject.pathname;
  if (pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }
  pathname += `/${name}`;
  urlObject.pathname = pathname;
  const [clientName, opId] = operationId.split("/");
  urlObject.searchParams.set("id", opId);
  urlObject.searchParams.set("client", clientName);
  urlObject.searchParams.set("type", operationType);
  return urlObject;
}
var WhopWebsocketClientBase = class extends import_tiny_typed_emitter.TypedEmitter {
  websocket = null;
  failedConnectionAttempts = 0;
  status = "disconnected";
  wantsToBeConnected = false;
  makeWebsocket() {
    throw new Error("Not implemented in base class");
  }
  connect() {
    if (this.websocket) {
      this.disconnect();
    }
    this.wantsToBeConnected = true;
    this.setStatus("connecting");
    const websocket = this.makeWebsocket();
    this.websocket = websocket;
    websocket.onopen = () => {
      this.setStatus("connected");
    };
    websocket.onmessage = (event) => {
      try {
        const message2 = JSON.parse(event.data);
        this.emit("message", message2);
        if (message2.appMessage) {
          this.emit("appMessage", message2.appMessage);
        }
      } catch (error) {
        console.error("[WhopWebsocketClient] Error parsing message", event.data);
      }
    };
    websocket.onerror = (event) => {
      console.error("[WhopWebsocketClient] Websocket error", event);
      this.setStatus("disconnected");
    };
    websocket.onclose = (event) => {
      this.setStatus("disconnected");
    };
    return () => {
      this.disconnect();
    };
  }
  disconnect() {
    if (this.websocket) {
      this.websocket.onopen = null;
      this.websocket.onmessage = null;
      this.websocket.onerror = null;
      this.websocket.onclose = null;
      this.websocket.close();
      this.websocket = null;
    }
    this.wantsToBeConnected = false;
  }
  send(message2) {
    if (!this.websocket) {
      throw new Error("Websocket not connected");
    }
    this.websocket.send(JSON.stringify(message2));
  }
  broadcast({
    message: message2,
    target
  }) {
    this.send({
      broadcastAppMessage: {
        channel: convertBroadcastTargetToProtoChannel(target),
        json: message2
      }
    });
  }
  setStatus(status) {
    if (status === this.status)
      return;
    this.status = status;
    if (status === "disconnected") {
      const backoff = this.calculateBackoff();
      this.failedConnectionAttempts++;
      setTimeout(() => {
        if (this.wantsToBeConnected) {
          this.connect();
        }
      }, backoff);
      this.emit("disconnect");
    }
    if (status === "connected") {
      this.failedConnectionAttempts = 0;
      this.emit("connect");
    }
    this.emit("connectionStatus", status);
  }
  calculateBackoff() {
    return Math.min(50 * 2 ** this.failedConnectionAttempts, 1000 * 60);
  }
};
function convertBroadcastTargetToProtoChannel(target) {
  if (target === "everyone") {
    return {
      type: "APP",
      id: "[app_id]"
    };
  }
  if ("experienceId" in target) {
    return {
      type: "APP",
      id: `[app_id]_${target.experienceId}`
    };
  }
  if ("customId" in target) {
    return {
      type: "APP",
      id: `[app_id]_c_${target.customId}`
    };
  }
  throw new Error("Invalid broadcast target");
}
var WhopWebsocketClientBrowser = class extends WhopWebsocketClientBase {
  options;
  constructor(options) {
    super();
    this.options = options;
  }
  makeWebsocket() {
    const path = "/_whop/ws/v1/websockets/connect";
    const searchParams = new URLSearchParams;
    addChannelIds(searchParams, "join_experience", this.options.joinExperience);
    addChannelIds(searchParams, "join_custom", this.options.joinCustom);
    addChannelIds(searchParams, "join_public", this.options.joinPublic);
    const url = new URL(path, window.location.origin);
    url.protocol = url.protocol.replace("http", "ws");
    url.search = searchParams.toString();
    return new WebSocket(url.toString());
  }
};
function addChannelIds(searchParams, key, channels) {
  if (!channels) {
    return;
  }
  if (typeof channels === "string" && channels.length > 0) {
    searchParams.set(key, channels);
    return;
  }
  for (const channel of channels) {
    searchParams.append(key, channel);
  }
}
function makeConnectToWebsocketFunction() {
  return function connectToWebsocket(options) {
    return new WhopWebsocketClientBrowser(options);
  };
}
function makeWhopClientSdk({
  uploadFile
}) {
  return function WhopClientSdk(options) {
    const baseSdk = getSdk(makeRequester({
      apiPath: "/_whop/public-graphql",
      ...options
    }));
    const fileSdk = fileSdkExtensions(baseSdk, uploadFile);
    const websocketClient = makeConnectToWebsocketFunction();
    const sdk = {
      ...baseSdk,
      attachments: {
        ...baseSdk.attachments,
        ...fileSdk
      },
      websockets: {
        client: websocketClient
      }
    };
    return sdk;
  };
}
function makeRequester(apiOptions) {
  const endpoint = getEndpoint(apiOptions);
  return async function fetcher(operationId, operationName, operationType, vars, options) {
    const headers = new Headers(options?.headers);
    return graphqlFetch(endpoint, operationId, operationName, operationType, vars, headers);
  };
}
function getEndpoint(apiOptions) {
  if (typeof document === "undefined") {
    throw new Error("WhopApi.client() is only available in the browser");
  }
  const url = new URL(apiOptions.apiPath ?? "/public-graphql", apiOptions.apiOrigin ?? window.location.origin);
  return url.href;
}
function getSdk2(requester) {
  return {
    accessPasses: {
      getAccessPass(variables, options) {
        return requester("whop-sdk-ts-server/sha256:daea5c9cf3e5e30ef0fd9eaad8ea852ffdbd0e0088ff3ad05aacb6a761b7c6f9", "getAccessPass", "query", variables, options).then((res) => res.accessPass);
      }
    },
    access: {
      checkIfUserHasAccessToAccessPass(variables, options) {
        return requester("whop-sdk-ts-server/sha256:a5ee1715113ab68b87dcfd5b578b6c20d1ca1fe50d8c0e2ec43e462a9b86632d", "checkIfUserHasAccessToAccessPass", "query", variables, options).then((res) => res.hasAccessToAccessPass);
      },
      checkIfUserHasAccessToCompany(variables, options) {
        return requester("whop-sdk-ts-server/sha256:b894321dc004894f993e91f5e7451554b0ae8af7da950a5c84ac69180599edc2", "checkIfUserHasAccessToCompany", "query", variables, options).then((res) => res.hasAccessToCompany);
      },
      checkIfUserHasAccessToExperience(variables, options) {
        return requester("whop-sdk-ts-server/sha256:b16d7fe717171fb936dfb6de679558e149f5070bbe25ade44e38af83c330ad71", "checkIfUserHasAccessToExperience", "query", variables, options).then((res) => res.hasAccessToExperience);
      }
    },
    apps: {
      createAppBuild(variables, options) {
        return requester("whop-sdk-ts-server/sha256:221275dcd40898079c1e7bc1510b364a487581d6cdfc1a9524da74f2f82689cc", "createAppBuild", "mutation", { input: variables }, options).then((res) => res.createAppBuild);
      }
    },
    attachments: {
      getAttachment(variables, options) {
        return requester("whop-sdk-ts-server/sha256:07f48fb0c1292fda5a8dd5f54b5d1b637635a87b6012769819ebcf7795a045ba", "getAttachment", "query", variables, options).then((res) => res.attachment);
      },
      processAttachment(variables, options) {
        return requester("whop-sdk-ts-server/sha256:396c5803051b3c9bcedd3ce310505a4f57a6b94bc190e7142e897d9aa5036ece", "processAttachment", "mutation", { input: variables }, options).then((res) => res.mediaAnalyzeAttachment);
      },
      uploadMedia(variables, options) {
        return requester("whop-sdk-ts-server/sha256:a3d06ed16e52126d96aae83cad3400471246f37fc275e4c8f4836c98bf8e9d59", "uploadMedia", "mutation", { input: variables }, options).then((res) => res.mediaDirectUpload);
      }
    },
    companies: {
      getCompanyLedgerAccount(variables, options) {
        return requester("whop-sdk-ts-server/sha256:38c83c1105b29a010208830b29d38af3d87a885b9c54a3da65d6dd2749128773", "getCompanyLedgerAccount", "query", variables, options).then((res) => res.company);
      },
      getWaitlistEntriesForCompany(variables, options) {
        return requester("whop-sdk-ts-server/sha256:5ad1e4c5932d68eda92af2d709ecf6ad0afc8fb29e1ef2bd1448f61650b637d3", "getWaitlistEntriesForCompany", "query", variables, options).then((res) => res.company);
      }
    },
    courses: {
      getCourse(variables, options) {
        return requester("whop-sdk-ts-server/sha256:a70e69bec7574d2b4498d2bee86bd97adb87480599cbceeca8f63135078fd5c9", "getCourse", "query", variables, options).then((res) => res.course);
      }
    },
    experiences: {
      getExperience(variables, options) {
        return requester("whop-sdk-ts-server/sha256:114eb7b7c8403ffbe75a0c74a26ac50b5367e183a16ba64eebf4a43d5466bb4e", "getExperience", "query", variables, options).then((res) => res.experience);
      },
      listAccessPassesForExperience(variables, options) {
        return requester("whop-sdk-ts-server/sha256:699621f62be7675bfaf9fc49cb6d7abfe244bf691aee274cb492036f0b59bddc", "listAccessPassesForExperience", "query", variables, options).then((res) => res.experience);
      },
      listExperiences(variables, options) {
        return requester("whop-sdk-ts-server/sha256:6ca8515118d4710204bb2e32ea020bb98de8ea1cada4929ecfe7cae606cf6e79", "listExperiences", "query", variables, options).then((res) => res.company);
      },
      listUsersForExperience(variables, options) {
        return requester("whop-sdk-ts-server/sha256:85c827d8660dc2a97e8b930e213b83493ae132c00988e0f03e02c5dc99559a5a", "listUsersForExperience", "query", variables, options).then((res) => res.publicExperience);
      }
    },
    forums: {
      createForumPost(variables, options) {
        return requester("whop-sdk-ts-server/sha256:e6253ed15def017eef4bc2e2f8b01ecd9cf480b5c54fffed439d0afe01a864f2", "createForumPost", "mutation", { input: variables }, options).then((res) => res.createForumPost);
      },
      findOrCreateForum(variables, options) {
        return requester("whop-sdk-ts-server/sha256:5219219796ebdeb29023d098bd9498cf8c64b3536dc9d42cbc4e19708e0b317d", "findOrCreateForum", "mutation", { input: variables }, options).then((res) => res.createForum);
      },
      listForumPostsFromForum(variables, options) {
        return requester("whop-sdk-ts-server/sha256:97a7d797f3a5f6f83bf4628cc7c586d529b90e54c0a8e193493a55b4ad05df46", "listForumPostsFromForum", "query", variables, options).then((res) => res.feedPosts);
      }
    },
    messages: {
      findOrCreateChat(variables, options) {
        return requester("whop-sdk-ts-server/sha256:f69684c08f79192b7a4722a3c24a347fd0074e04e1c940517e54b52a9c27f40c", "findOrCreateChat", "mutation", { input: variables }, options).then((res) => res.createChat);
      },
      listDirectMessageConversations(variables, options) {
        return requester("whop-sdk-ts-server/sha256:ea4457aace3d29d8c376dd9de3629cee00d4a76ff0fc9b9d51b6ffeab1cc6ead", "listDirectMessageConversations", "query", variables, options).then((res) => res.myDmsChannelsV2);
      },
      listMessagesFromChat(variables, options) {
        return requester("whop-sdk-ts-server/sha256:5fdbf50fe489888e5b0a98e9fe6170584bf47ab38f87d1e0b7fce8f523513894", "listMessagesFromChat", "query", variables, options).then((res) => res.feedPosts);
      },
      sendDirectMessageToUser(variables, options) {
        return requester("whop-sdk-ts-server/sha256:b1b27b67e3c776813439ace71cb979587cd16c221155a303fcf8e4c7ad8beafa", "sendDirectMessageToUser", "mutation", variables, options).then((res) => res.sendMessage);
      },
      sendMessageToChat(variables, options) {
        return requester("whop-sdk-ts-server/sha256:a3b2e7765662a63fb57a7e61da5081b719fb75ba60560b9059ba4fe856499ac3", "sendMessageToChat", "mutation", variables, options).then((res) => res.sendMessage);
      }
    },
    notifications: {
      sendPushNotification(variables, options) {
        return requester("whop-sdk-ts-server/sha256:6239cbdb659f0698ed81ca9533740337b4d2d44e25e22297188d7d1e1a7037d2", "sendPushNotification", "mutation", { input: variables }, options).then((res) => res.sendNotification);
      }
    },
    payments: {
      chargeUser(variables, options) {
        return requester("whop-sdk-ts-server/sha256:2392cef9bb6e08d243f102a52c4a6a6e6bd9371e2fced2ad598b2dc14685af81", "chargeUser", "mutation", { input: variables }, options).then((res) => res.chargeUser);
      },
      createCheckoutSession(variables, options) {
        return requester("whop-sdk-ts-server/sha256:498eba2f4b9b6b8fe4ed5f93423af054ea1c4995bf2f3258089c40b68a4919e8", "createCheckoutSession", "mutation", { input: variables }, options).then((res) => res.createCheckoutSession);
      },
      payUser(variables, options) {
        return requester("whop-sdk-ts-server/sha256:d8cbac8b275a7c41e05ab4daa01084b0e54c31c6b5375261f8aee241e5f6c794", "payUser", "mutation", { input: variables }, options).then((res) => res.transferFunds);
      }
    },
    users: {
      getCurrentUser(variables, options) {
        return requester("whop-sdk-ts-server/sha256:9f7cc9ff353a2778e55b674cfd5737a7dcaff19be9ac13d6f79aabd5d8ef69ff", "getCurrentUser", "query", variables, options).then((res) => res.viewer);
      },
      getUserLedgerAccount(variables, options) {
        return requester("whop-sdk-ts-server/sha256:d7eeaf0a388395edb82220877e72a7fc91d1f06a6d89f1cfa5e56bb400d2aa49", "getUserLedgerAccount", "query", variables, options).then((res) => res.viewer);
      },
      getUser(variables, options) {
        return requester("whop-sdk-ts-server/sha256:d8022374c6b0eb0445781342a14c9bffafd776cee4e282cb76e31af8c017d33e", "getUser", "query", variables, options).then((res) => res.publicUser);
      }
    }
  };
}
var WhopOAuth = class _WhopOAuth {
  constructor(appId, appApiKey, apiOrigin = "https://api.whop.com") {
    this.appId = appId;
    this.appApiKey = appApiKey;
    this.apiOrigin = apiOrigin;
  }
  static OAUTH_URL = "https://whop.com/oauth/";
  getAuthorizationUrl({
    state = crypto.randomUUID(),
    redirectUri,
    scope = ["read_user"]
  }) {
    const oAuthUrl = new URL(_WhopOAuth.OAUTH_URL);
    oAuthUrl.searchParams.set("client_id", this.appId);
    oAuthUrl.searchParams.set("response_type", "code");
    oAuthUrl.searchParams.set("scope", scope.join(" "));
    oAuthUrl.searchParams.set("state", state);
    if (redirectUri instanceof URL) {
      oAuthUrl.searchParams.set("redirect_uri", redirectUri.toString());
    } else {
      oAuthUrl.searchParams.set("redirect_uri", redirectUri);
    }
    return {
      url: oAuthUrl.toString(),
      state
    };
  }
  async exchangeCode({
    code,
    redirectUri
  }) {
    const resolvedRedirectUri = redirectUri instanceof URL ? redirectUri.toString() : redirectUri;
    const tokensEndpoint = new URL("/api/oauth/token", this.apiOrigin);
    const tokensResponse = await fetch(tokensEndpoint, {
      method: "POST",
      body: JSON.stringify({
        code,
        client_id: this.appId,
        client_secret: this.appApiKey,
        grant_type: "authorization_code",
        redirect_uri: resolvedRedirectUri
      }),
      headers: {
        "content-type": "application/json",
        "cache-control": "no-cache",
        pragma: "no-cache"
      },
      cache: "no-store"
    });
    if (!tokensResponse.ok) {
      return {
        ok: false,
        code: tokensResponse.status,
        raw: tokensResponse
      };
    }
    const tokens = await tokensResponse.json();
    return {
      ok: true,
      tokens
    };
  }
};
var DEFAULT_WEBSOCKET_ORIGIN = "https://ws-prod.whop.com";
function sendWebsocketMessageFunction(apiOptions) {
  const origin = apiOptions.websocketOrigin ?? DEFAULT_WEBSOCKET_ORIGIN;
  const path = "/v1/websockets/send";
  const url = new URL(path, origin);
  const headers = new Headers;
  headers.set("Content-Type", "application/json");
  headers.set("Authorization", `Bearer ${apiOptions.appApiKey}`);
  return async function SendWebsocketMessage(input) {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(input),
      headers
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to send websocket message. Code: ${response.status}. Message: ${error}`);
    }
    const data = await response.json();
    if (!data.ok) {
      throw new Error("Failed to send websocket message");
    }
  };
}
var WhopWebsocketClientServer = class extends WhopWebsocketClientBase {
  keys;
  constructor(keys) {
    super();
    this.keys = keys;
  }
  makeWebsocket() {
    const path = "/v1/websockets/connect";
    const origin = this.keys.websocketOrigin ?? DEFAULT_WEBSOCKET_ORIGIN;
    const url = new URL(path, origin);
    url.protocol = url.protocol.replace("http", "ws");
    const headers = {
      Authorization: `Bearer ${this.keys.appApiKey}`,
      "x-on-behalf-of": this.keys.onBehalfOfUserId
    };
    return new WebSocket(url, { headers });
  }
};
function makeConnectToWebsocketFunction2(options) {
  return function connectToWebsocket() {
    return new WhopWebsocketClientServer(options);
  };
}
function BaseWhopServerSdk(options, uploadFile) {
  const baseSdk = getSdk2(makeRequester2(options));
  const sendWebsocketMessage = sendWebsocketMessageFunction(options);
  const websocketClient = makeConnectToWebsocketFunction2(options);
  const fileSdk = fileSdkExtensions(baseSdk, uploadFile);
  const oauth = new WhopOAuth(options.appId, options.appApiKey, options.apiOrigin);
  const verifyUserToken2 = makeUserTokenVerifier({
    appId: options.appId,
    dontThrow: false
  });
  return {
    ...baseSdk,
    attachments: {
      ...baseSdk.attachments,
      ...fileSdk
    },
    websockets: {
      sendMessage: sendWebsocketMessage,
      client: websocketClient
    },
    oauth,
    verifyUserToken: verifyUserToken2
  };
}
function makeWhopServerSdk({
  uploadFile
}) {
  return function WhopServerSdk(options) {
    const baseSdk = BaseWhopServerSdk(options, uploadFile);
    return {
      ...baseSdk,
      withUser: (userId) => WhopServerSdk({ ...options, onBehalfOfUserId: userId }),
      withCompany: (companyId) => WhopServerSdk({ ...options, companyId })
    };
  };
}
function makeRequester2(apiOptions) {
  const endpoint = getEndpoint2(apiOptions);
  const headers = getHeaders(apiOptions);
  return async function fetcher(operationId, operationName, operationType, vars, options) {
    const customHeaders = new Headers(options?.headers);
    const actualHeaders = new Headers(headers);
    for (const [key, value] of customHeaders.entries()) {
      actualHeaders.set(key, value);
    }
    return graphqlFetch(endpoint, operationId, operationName, operationType, vars, actualHeaders);
  };
}
function getEndpoint2(apiOptions) {
  const url = new URL(apiOptions.apiPath ?? "/public-graphql", apiOptions.apiOrigin ?? DEFAULT_API_ORIGIN);
  return url.href;
}
function getHeaders(options) {
  const headers = new Headers;
  headers.set("Authorization", `Bearer ${options.appApiKey}`);
  if (options.onBehalfOfUserId)
    headers.set("x-on-behalf-of", options.onBehalfOfUserId);
  if (options.companyId)
    headers.set("x-company-id", options.companyId);
  return headers;
}

// ../../node_modules/@whop/api/dist/index.node.mjs
import { request } from "https";
import { Readable } from "stream";
async function uploadPartImpl({
  url,
  fullData,
  partNumber,
  headers,
  onProgress,
  signal
}) {
  const offset = (partNumber - 1) * MULTIPART_UPLOAD_CHUNK_SIZE;
  const data = fullData.slice(offset, Math.min(offset + MULTIPART_UPLOAD_CHUNK_SIZE, fullData.size));
  signal?.throwIfAborted();
  return new Promise((resolve, reject) => {
    const fullURL = new URL(url);
    const req = request(fullURL, {
      method: "PUT",
      headers: {
        ...headers,
        host: fullURL.host,
        "content-length": data.size.toString()
      },
      signal
    });
    let uploadedBytes = 0;
    req.on("response", async (res) => {
      const statusCode = res.statusCode ?? 0;
      if (statusCode >= 200 && statusCode < 300) {
        const etag = res.headers.etag;
        if (!etag) {
          reject(new Error("Missing etag on upload response"));
          return;
        }
        resolve(etag.slice(1, -1));
      } else {
        let chunks = "";
        for await (const chunk of res) {
          chunks += chunk.toString();
        }
        reject(new Error(`Failed to upload part with ${statusCode}: ${res.statusMessage}`, { cause: chunks }));
      }
    });
    req.on("error", (error) => {
      reject(error);
    });
    req.on("drain", () => {
      onProgress?.({
        total: data.size,
        loaded: uploadedBytes
      });
    });
    Readable.fromWeb(data.stream()).on("data", (chunk) => {
      uploadedBytes += chunk.length;
      onProgress?.({
        total: data.size,
        loaded: uploadedBytes
      });
    }).pipe(req);
    onProgress?.({ total: data.size, loaded: 0 });
  });
}
var uploadFile = makeUploadAttachmentFunction({ uploadPart: uploadPartImpl });
var sdk = makeWhopClientSdk({ uploadFile });
var uploadFile2 = makeUploadAttachmentFunction({ uploadPart: uploadPartImpl });
var sdk2 = makeWhopServerSdk({ uploadFile: uploadFile2 });

// src/context/experience.ts
import { AsyncLocalStorage } from "async_hooks";
var asyncLocalStorage = new AsyncLocalStorage;
async function withExperience(options) {
  const { sdk: sdk3, experienceId, view, userId, experience } = options;
  let finalExperience = experience;
  if (!finalExperience) {
    const fetchedExperience = await sdk3.experiences.getExperience({
      experienceId
    });
    if (!fetchedExperience) {
      throw new Error(`Experience with ID ${experienceId} not found`);
    }
    finalExperience = fetchedExperience;
  }
  if (!finalExperience) {
    throw new Error(`Experience is required but not provided for experienceId: ${experienceId}`);
  }
  const context = {
    experienceId,
    userId,
    experience: finalExperience
  };
  return asyncLocalStorage.run(context, () => view(finalExperience));
}
function getExperienceId() {
  const context = asyncLocalStorage.getStore();
  if (!context?.experienceId) {
    throw new Error("experienceId not found in context. Make sure you are calling this within withExperienceContext.");
  }
  return context.experienceId;
}
function getUserId() {
  const context = asyncLocalStorage.getStore();
  return context?.userId;
}
function getCachedExperience() {
  const context = asyncLocalStorage.getStore();
  return context?.experience;
}
function setCachedExperience(experience) {
  const context = asyncLocalStorage.getStore();
  if (!context) {
    throw new Error("No context found. Make sure you are calling this within withExperienceContext.");
  }
  context.experience = experience;
}
async function getOrFetchExperience(fetcher) {
  const cached = getCachedExperience();
  if (cached) {
    return cached;
  }
  const experienceId = getExperienceId();
  const experience = await fetcher(experienceId);
  if (!experience) {
    throw new Error(`Experience with ID ${experienceId} not found`);
  }
  setCachedExperience(experience);
  return experience;
}
function getContext() {
  return asyncLocalStorage.getStore();
}
function hasExperienceContext() {
  const context = asyncLocalStorage.getStore();
  return !!context?.experienceId;
}
function getExperience() {
  const experience = getCachedExperience();
  if (!experience) {
    throw new Error("Experience not found in context. Make sure the experience has been fetched and cached in the layout.");
  }
  return experience;
}

// src/context/credentials.ts
import { headers } from "next/headers";
function createAuthenticationFunction(config) {
  return function(options, wrapped) {
    return async (rawProps) => {
      const props = rawProps || {};
      let experienceId = props.experienceId;
      if (!experienceId) {
        experienceId = getExperienceId();
      }
      const headersList = await headers();
      if (config.preUserAuth) {
        const preAuthResult = await config.preUserAuth(headersList);
        if (preAuthResult) {
          return wrapped({
            ...props,
            ...preAuthResult,
            experienceId
          });
        }
      }
      const user = await verifyUserToken(headersList);
      if (!user) {
        throw new Error("Unauthorized");
      }
      const hasAccess = await config.sdk.access.checkIfUserHasAccessToExperience({
        userId: user.userId,
        experienceId
      });
      const userStatus = config.getUserStatus({
        userId: user.userId,
        accessLevel: hasAccess.accessLevel
      });
      if (!userStatus) {
        throw new Error("Unauthorized");
      }
      if (options?.requiredUserStatus && userStatus !== options.requiredUserStatus) {
        throw new Error("Unauthorized");
      }
      return wrapped({
        ...props,
        userData: {
          userId: user.userId,
          userStatus,
          userAccessLevel: hasAccess.accessLevel
        },
        experienceId
      });
    };
  };
}
// src/context/auth-cache.ts
import { cache as cache2 } from "react";
import { headers as headers2 } from "next/headers";
var getCachedUserToken = cache2(async () => {
  const headersList = await headers2();
  return verifyUserToken(headersList);
});
var getCachedUserAccess = cache2(async (sdk3, userId, experienceId) => {
  return sdk3.access.checkIfUserHasAccessToExperience({
    userId,
    experienceId
  });
});
var getCachedUserAuthentication = cache2(async (sdk3, experienceId, getUserStatus, preUserAuth) => {
  const headersList = await headers2();
  if (preUserAuth) {
    const preAuthResult = await preUserAuth(headersList);
    if (preAuthResult) {
      return preAuthResult.userData;
    }
  }
  const user = await getCachedUserToken();
  if (!user) {
    return null;
  }
  const hasAccess = await getCachedUserAccess(sdk3, user.userId, experienceId);
  const userStatus = getUserStatus({
    userId: user.userId,
    accessLevel: hasAccess.accessLevel
  });
  if (!userStatus) {
    return null;
  }
  return {
    userId: user.userId,
    userStatus,
    userAccessLevel: hasAccess.accessLevel
  };
});
export {
  withExperience,
  setCachedExperience,
  hasExperienceContext,
  getUserId,
  getOrFetchExperience,
  getExperienceId,
  getExperience,
  getContext,
  getCachedUserToken,
  getCachedUserAuthentication,
  getCachedUserAccess,
  getCachedExperience,
  createAuthenticationFunction
};
