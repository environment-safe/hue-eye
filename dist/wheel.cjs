"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColorWheel = void 0;
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
const componentToHex = c => {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
};
const rgbToHex = (r, g, b) => {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};
class ColorWheel extends _elements.HTMLElement {
  constructor() {
    super();
    this.height = parseInt(this.getAttribute('height')) || 300;
    this.width = parseInt(this.getAttribute('width')) || 300;
    this.color = new _color.Color(this.getAttribute('color') || '#000000');
    this.attachShadow({
      mode: 'open'
    });
    //load the CSS into the shadow DOM
    this._canvas = document.createElement('canvas');
    this._selector = document.createElement('div');
    this._styles = document.createElement('style');
    this._styles.innerHTML = `
        .selector{
            display:block;
            position: absolute;
            border: 1px solid white;
            border-radius: 3px 3px;
            box-shadow: 3px black;
            height: 2px;
            width: 2px;
        }`;
    this._selector.setAttribute('class', 'selector');
    this._canvas.setAttribute('height', this.height);
    this._canvas.setAttribute('width', this.width);
    this.shadowRoot.appendChild(this._canvas);
    this.shadowRoot.appendChild(this._styles);
    this.shadowRoot.appendChild(this._selector);
    this._canvas.addEventListener('mousedown', event => {
      const x = event.pageX;
      const y = event.pageY;
      const [r, g, b] = this.pixelAt(x, y);
      this._selector.style.top = y + 'px';
      this._selector.style.left = x + 'px';
      const hex = rgbToHex(r, g, b);
      this.color.set(hex);
      this.setAttribute('hex', hex);
    });
  }
  pixelAt(x, y) {
    const context = this._canvas.getContext('2d');
    const pixels = context.getImageData(0, 0, this.width, this.height);
    const yoffset = this.width * y * 4;
    const offset = yoffset + x * 4;
    return [pixels.data[offset + 0], pixels.data[offset + 1], pixels.data[offset + 2], 255 / pixels.data[offset + 3]];
  }
  pixelWith(rgb) {
    const context = this._canvas.getContext('2d');
    const pixels = context.getImageData(0, 0, this.width, this.height);
    let match = null;
    //const yoffset = (this.width * 4);
    let yoffset = 0;
    let xoffset = 0;
    let offset = 0;
    for (let y = 0; y < this.height; y++) {
      yoffset = y * this.width * 4;
      for (let x = 0; x < this.width; x++) {
        xoffset = x * 4;
        offset = yoffset + xoffset;
        if (rgb[0] === pixels.data[offset + 0] && rgb[1] === pixels.data[offset + 1] && rgb[2] === pixels.data[offset + 2] && pixels.data[offset + 3] && !match) {
          match = {
            x,
            y
          };
        }
      }
    }
    /*for(let lcv=0; lcv < pixels.data.length && !match; lcv+=4){
        //console.log('1');
        if(pixels.data[lcv+3]) console.log('@@@', pixels.data.length, rgb, pixels.data.slice(lcv, 4))
        if(
            rgb[0] === pixels.data[lcv+0] &&
            rgb[1] === pixels.data[lcv+1] &&
            rgb[2] === pixels.data[lcv+2] &&
            pixels.data[lcv+3]
        ){
            console.log('$$', pixels.data.length, rgb, pixels.data.slice(lcv, 4), yoffset, lcv)
            match = {
                y: Math.floor(lcv / yoffset),
                x: lcv % yoffset
            };
        }
    }*/
    return match;
  }
  connectedCallback() {
    this.render();
    this.display();
  }
  static formats = ['hex', 'rgb', 'hsl', 'rgba'];
  static get observedAttributes() {
    return [].concat(ColorWheel.formats);
  }
  markClean(attr) {
    const dirtyIndex = this.dirty.indexOf(attr);
    if (dirtyIndex === -1) {
      throw new Error('dirty index not found');
    }
    this.dirty.splice(dirtyIndex, 1);
    if (this.dirty.length === 0) this.dirty = null;
  }

  // We reflect attribute changes into property changes
  attributeChangedCallback(attr, oldVal, newVal) {
    if (oldVal !== newVal) {
      this[attr] = newVal;
      if (!this.dirty) {
        this.dirty = ColorWheel.formats.slice();
        this.markClean(attr);
        this.dirty.forEach(format => {
          if (format !== attr) {
            if (this.color) {
              setTimeout(() => {
                this.setAttribute(format, this.color[format]());
              });
            }
          }
        });
      } else {
        this.markClean(attr);
      }
    } else {
      this.markClean(attr);
    }
  }
  render() {
    const context = this._canvas.getContext('2d');
    const pixels = context.getImageData(0, 0, this.width, this.height);
    this.drawWheel(pixels);
    context.putImageData(pixels, 0, 0);
  }
  drawWheel(image) {
    var radius = Math.floor(Math.min(image.width, image.height) / 2);
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
        deg = rad2deg(phi);
        // Figure out the starting index of this pixel in the image data array.
        rowLength = 2 * radius;
        adjustedX = x + radius;
        adjustedY = y + radius;
        pixelWidth = 4;
        index = (adjustedX + adjustedY * rowLength) * pixelWidth;
        hue = deg;
        //saturation = 1.0;
        //value = 1.0;
        //console.log(radius/r)
        saturation = r / radius;
        value = 1 - r / radius;
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
  display() {
    const location = this.pixelWith(this.color.rgb());
    if (location.x && location.y) {
      this._selector.style.top = location.y + 'px';
      this._selector.style.left = location.x + 'px';
    }
    console.log('>>>', location);
  }
}
exports.ColorWheel = ColorWheel;
_elements.customElements.define('color-wheel', ColorWheel);