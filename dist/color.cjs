"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Color = void 0;
/*
import { isBrowser, isJsDom } from 'browser-or-node';
import * as mod from 'module';
import * as path from 'path';
let internalRequire = null;
if(typeof require !== 'undefined') internalRequire = require;
const ensureRequire = ()=> (!internalRequire) && (internalRequire = mod.createRequire(import.meta.url));
//*/

/**
 * A JSON object
 * @typedef { object } JSON
 */

function rgb2hsv(r, g, b) {
  let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
  rabs = r / 255;
  gabs = g / 255;
  babs = b / 255;
  v = Math.max(rabs, gabs, babs), diff = v - Math.min(rabs, gabs, babs);
  diffc = c => (v - c) / 6 / diff + 1 / 2;
  percentRoundFn = num => Math.round(num * 100) / 100;
  if (diff == 0) {
    h = s = 0;
  } else {
    s = diff / v;
    rr = diffc(rabs);
    gg = diffc(gabs);
    bb = diffc(babs);
    if (rabs === v) {
      h = bb - gg;
    } else if (gabs === v) {
      h = 1 / 3 + rr - bb;
    } else if (babs === v) {
      h = 2 / 3 + gg - rr;
    }
    if (h < 0) {
      h += 1;
    } else if (h > 1) {
      h -= 1;
    }
  }
  return [Math.round(h * 360), percentRoundFn(s * 100), percentRoundFn(v * 100)];
}

/*
const hsv2rgb = (hue, saturation, value)=>{
    let chroma = value * saturation;
    let hue1 = hue / 60;
    let x = chroma * (1- Math.abs((hue1 % 2) - 1));
    let r1, g1, b1;
    if (hue1 >= 0 && hue1 <= 1) {
        ([r1, g1, b1] = [chroma, x, 0]);
    } else if (hue1 >= 1 && hue1 <= 2) {
        ([r1, g1, b1] = [x, chroma, 0]);
    } else if (hue1 >= 2 && hue1 <= 3) {
        ([r1, g1, b1] = [0, chroma, x]);
    } else if (hue1 >= 3 && hue1 <= 4) {
        ([r1, g1, b1] = [0, x, chroma]);
    } else if (hue1 >= 4 && hue1 <= 5) {
        ([r1, g1, b1] = [x, 0, chroma]);
    } else if (hue1 >= 5 && hue1 <= 6) {
        ([r1, g1, b1] = [chroma, 0, x]);
    }
    
    let m = value - chroma;
    let [r,g,b] = [r1+m, g1+m, b1+m];
    
    // Change r,g,b values from [0,1] to [0,255]
    return [255*r,255*g,255*b];
};
//*/

const hexFormatExpression = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
const hexToRgb = hex => {
  var result = hexFormatExpression.exec(hex);
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
};
const componentToHex = c => {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
};
const rgbToHex = (r, g, b) => {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};
class Color {
  constructor(value) {
    this.set(value);
  }
  set(value) {
    this._raw = Color.from(value);
  }
  hex() {
    const result = rgbToHex(this._raw.r, this._raw.g, this._raw.b);
    return result;
  }
  hsl() {
    const result = rgb2hsv(this._raw.r, this._raw.g, this._raw.b);
    result.toString = () => `hsl(${result[0]}, ${result[1]}, ${result[2]})`;
    return result;
  }
  hsv() {
    const result = rgb2hsv(this._raw.r, this._raw.g, this._raw.b);
    result.toString = () => `hsl(${result[0]}, ${result[1]}, ${result[2]})`;
    return result;
  }
  rgb() {
    const result = [this._raw.r, this._raw.g, this._raw.b];
    result.toString = () => `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
    return result;
  }
  rgba() {
    const result = [this._raw.r, this._raw.g, this._raw.b, this._raw.a];
    result.toString = () => `rgba(${result[0]}, ${result[1]}, ${result[2]}, ${result[3]})`;
    return result;
  }
  static from(value) {
    if (typeof value === 'string') {
      if (value.match(hexFormatExpression)) {
        const [r, g, b] = hexToRgb(value);
        return {
          r,
          g,
          b,
          a: 1.0
        };
      }
    }
  }
}
exports.Color = Color;