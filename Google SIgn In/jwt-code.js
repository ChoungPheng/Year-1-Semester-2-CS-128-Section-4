(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
    /**
     * The code was extracted from:
     * https://github.com/davidchambers/Base64.js
     */
    
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    
    function InvalidCharacterError(message) {
      this.message = message;
    }
    
    InvalidCharacterError.prototype = new Error();
    InvalidCharacterError.prototype.name = 'InvalidCharacterError';
    
    function polyfill (input) {
      var str = String(input).replace(/=+$/, '');
      if (str.length % 4 == 1) {
        throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
      }
      for (
        // initialize result and counters
        var bc = 0, bs, buffer, idx = 0, output = '';
        // get next character
        buffer = str.charAt(idx++);
        // character found in table? initialize bit storage and add its ascii value;
        ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
          // and if not first of each 4 characters,
          // convert the first 8 bits to one ascii character
          bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
      ) {
        // try to find character in table (0-63, not found => -1)
        buffer = chars.indexOf(buffer);
      }
      return output;
    }
    
    
    module.exports = typeof window !== 'undefined' && window.atob && window.atob.bind(window) || polyfill;
    
    },{}],2:[function(require,module,exports){
    var atob = require('./atob');
    
    function b64DecodeUnicode(str) {
      return decodeURIComponent(atob(str).replace(/(.)/g, function (m, p) {
        var code = p.charCodeAt(0).toString(16).toUpperCase();
        if (code.length < 2) {
          code = '0' + code;
        }
        return '%' + code;
      }));
    }
    
    module.exports = function(str) {
      var output = str.replace(/-/g, "+").replace(/_/g, "/");
      switch (output.length % 4) {
        case 0:
          break;
        case 2:
          output += "==";
          break;
        case 3:
          output += "=";
          break;
        default:
          throw "Illegal base64url string!";
      }
    
      try{
        return b64DecodeUnicode(output);
      } catch (err) {
        return atob(output);
      }
    };
    
    },{"./atob":1}],3:[function(require,module,exports){
    'use strict';
    
    var base64_url_decode = require('./base64_url_decode');
    
    function InvalidTokenError(message) {
      this.message = message;
    }
    
    InvalidTokenError.prototype = new Error();
    InvalidTokenError.prototype.name = 'InvalidTokenError';
    
    module.exports = function (token,options) {
      if (typeof token !== 'string') {
        throw new InvalidTokenError('Invalid token specified');
      }
    
      options = options || {};
      var pos = options.header === true ? 0 : 1;
      try {
        return JSON.parse(base64_url_decode(token.split('.')[pos]));
      } catch (e) {
        throw new InvalidTokenError('Invalid token specified: ' + e.message);
      }
    };
    
    module.exports.InvalidTokenError = InvalidTokenError;
    
    },{"./base64_url_decode":2}],4:[function(require,module,exports){
    (function (global){
    /*
     *
     * This is used to build the bundle with browserify.
     *
     * The bundle is used by people who doesn't use browserify.
     * Those who use browserify will install with npm and require the module,
     * the package.json file points to index.js.
     */
    var jwt_decode = require('./lib/index');
    
    //use amd or just throught to window object.
    if (typeof global.window.define == 'function' && global.window.define.amd) {
      global.window.define('jwt_decode', function () { return jwt_decode; });
    } else if (global.window) {
      global.window.jwt_decode = jwt_decode;
    }
    }).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    
    },{"./lib/index":3}]},{},[4])