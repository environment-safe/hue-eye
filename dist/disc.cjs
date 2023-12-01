"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColorDisc = void 0;
var _color = require("./color.cjs");
var _elements = require("@environment-safe/elements");
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

const xy2polar = (x, y) => {
  return [Math.sqrt(x * x + y * y),
  //r
  Math.atan2(y, x) //phi
  ];
};
const hsv2rgb = (hue, saturation, value) => {
  let chroma = value * saturation;
  let hue1 = hue / 60;
  let x = chroma * (1 - Math.abs(hue1 % 2 - 1));
  let r1, g1, b1;
  if (hue1 >= 0 && hue1 <= 1) {
    [r1, g1, b1] = [chroma, x, 0];
  } else if (hue1 >= 1 && hue1 <= 2) {
    [r1, g1, b1] = [x, chroma, 0];
  } else if (hue1 >= 2 && hue1 <= 3) {
    [r1, g1, b1] = [0, chroma, x];
  } else if (hue1 >= 3 && hue1 <= 4) {
    [r1, g1, b1] = [0, x, chroma];
  } else if (hue1 >= 4 && hue1 <= 5) {
    [r1, g1, b1] = [x, 0, chroma];
  } else if (hue1 >= 5 && hue1 <= 6) {
    [r1, g1, b1] = [chroma, 0, x];
  }
  let m = value - chroma;
  let [r, g, b] = [r1 + m, g1 + m, b1 + m];

  // Change r,g,b values from [0,1] to [0,255]
  return [255 * r, 255 * g, 255 * b];
};

// rad in [-π, π] range
// return degree in [0, 360] range
const rad2deg = rad => (rad + Math.PI) / (2 * Math.PI) * 360;
class ColorDisc extends _elements.HTMLElement {
  constructor() {
    super();
    this.height = parseInt(this.getAttribute('height')) || 300;
    this.width = parseInt(this.getAttribute('width')) || 300;
    this.color = new _color.Color(this.getAttribute('hex') || '#000000');
    this.attachShadow({
      mode: 'open'
    });
    //load the CSS into the shadow DOM
    this._canvas = document.createElement('canvas');
    this._canvas.setAttribute('height', this.height);
    this._canvas.setAttribute('width', this.width);
    this.shadowRoot.appendChild(this._canvas);
  }
  connectedCallback() {
    this.render();
    this.display();
  }
  static get observedAttributes() {
    return ['hex', 'rgb', 'hsl', 'rgba'];
  }

  // We reflect attribute changes into property changes
  attributeChangedCallback(attr, oldVal, newVal) {
    if (oldVal !== newVal) {
      this[attr] = newVal;
    }
  }
  render() {
    const context = this._canvas.getContext('2d');
    const pixels = context.getImageData(0, 0, this.width, this.height);
    this.drawSpectrumRing(pixels);
    this.drawSphereSelector(pixels, this.color.hex());
    this.drawMonoSphere(pixels);
    this.drawSphereSelector(pixels, this.color.hex());
    context.putImageData(pixels, 0, 0);
  }
  drawSpectrumRing(image) {
    var radius = Math.floor(Math.min(image.width, image.height) / 2);
    var ringSize = radius / 4;
    var data = image.data;
    var x = null;
    var y = null;
    var deg = null;
    var rowLength = null;
    var adjustedX = null;
    var adjustedY = null;
    var pixelWidth = null;
    var index = null;
    var hue = null;
    var saturation = null;
    var value = null;
    var alpha = null;
    for (x = -radius; x < radius; x++) {
      for (y = -radius; y < radius; y++) {
        var [r, phi] = xy2polar(x, y);
        if (r > radius) continue;
        if (r < radius - ringSize) continue;
        deg = rad2deg(phi);
        // Figure out the starting index of this pixel in the image data array.
        rowLength = 2 * radius;
        adjustedX = x + radius; // convert x from [-50, 50] to [0, 100] (the coordinates of the image data array)
        adjustedY = y + radius; // convert y from [-50, 50] to [0, 100] (the coordinates of the image data array)
        pixelWidth = 4; // each pixel requires 4 slots in the data array
        index = (adjustedX + adjustedY * rowLength) * pixelWidth;
        hue = deg;
        saturation = 1.0;
        value = 1.0;
        var [red, green, blue] = hsv2rgb(hue, saturation, value);
        alpha = 255;
        data[index] = red;
        data[index + 1] = green;
        data[index + 2] = blue;
        data[index + 3] = alpha;
      }
    }
  }
  drawSphereSelector(pixels) {}
  drawMonoSphere(image, color) {
    var radius = Math.floor(Math.min(image.width, image.height) / 2);
    var ringSize = radius / 4;
    var gap = radius / 16;
    var data = image.data;
    var x = null;
    var y = null;
    var deg = null;
    var rowLength = null;
    var adjustedX = null;
    var adjustedY = null;
    var pixelWidth = null;
    var index = null;
    var hue = null;
    var saturation = null;
    var value = null;
    var alpha = null;
    for (x = -radius; x < radius; x++) {
      for (y = -radius; y < radius; y++) {
        var [r, phi] = xy2polar(x, y);
        if (r > radius - ringSize - gap) continue;
        deg = rad2deg(phi);
        // Figure out the starting index of this pixel in the image data array.
        rowLength = 2 * radius;
        adjustedX = x + radius; // convert x from [-50, 50] to [0, 100] (the coordinates of the image data array)
        adjustedY = y + radius; // convert y from [-50, 50] to [0, 100] (the coordinates of the image data array)
        pixelWidth = 4; // each pixel requires 4 slots in the data array
        index = (adjustedX + adjustedY * rowLength) * pixelWidth;
        hue = deg;
        //saturation = 1.0;
        //value = 1.0;
        //console.log(radius/r)
        saturation = 0;
        value = 1 - r / radius * 1.5;
        //value = radius/Math.abs(radius/2 - (adjustedX + adjustedY)*2)
        //value = (radius/(adjustedX + adjustedY)/2;
        //value = radius/r;

        var [red, green, blue] = hsv2rgb(hue, saturation, value);
        alpha = 255;
        data[index] = red;
        data[index + 1] = green;
        data[index + 2] = blue;
        data[index + 3] = alpha;
      }
    }
  }
  display() {}
}
exports.ColorDisc = ColorDisc;
_elements.customElements.define('color-disc', ColorDisc);