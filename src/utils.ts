import namer from "color-namer";

const RGB_MAX: any = 255;
const HUE_MAX: any = 360;
const SV_MAX: any = 100;

export const hexToRgb = (hex: any) => {
  const match = hex.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
  if (!match) {
    return [0, 0, 0];
  }

  let colorString = match[0];

  if (match[0].length === 3) {
    colorString = colorString
      .split("")
      .map((char: string) => {
        return char + char;
      })
      .join("");
  }

  const integer = parseInt(colorString, 16);
  const r = (integer >> 16) & 0xff;
  const g = (integer >> 8) & 0xff;
  const b = integer & 0xff;

  return [r, g, b];
};

export const rgbToHex = (rgb: Array<number>) => {
  const [r, g, b] = rgb;
  const toHex = (c: number) => `0${c.toString(16)}`.slice(-2);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const rgbToHsl = (rgb: number[]) => {
  let [r, g, b] = rgb;
  // It converts [0,255] format, to [0,1]
  r = r === RGB_MAX ? 1 : (r % RGB_MAX) / parseFloat(RGB_MAX);
  g = g === RGB_MAX ? 1 : (g % RGB_MAX) / parseFloat(RGB_MAX);
  b = b === RGB_MAX ? 1 : (b % RGB_MAX) / parseFloat(RGB_MAX);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [
    Math.round(h * HUE_MAX),
    Math.round(s * SV_MAX),
    Math.round(l * SV_MAX),
  ];
};

export const rgbToHsv = (rgb: number[]) => {
  let [r, g, b] = rgb;

  // It converts [0,255] format, to [0,1]
  r = r === RGB_MAX ? 1 : (r % RGB_MAX) / parseFloat(RGB_MAX);
  g = g === RGB_MAX ? 1 : (g % RGB_MAX) / parseFloat(RGB_MAX);
  b = b === RGB_MAX ? 1 : (b % RGB_MAX) / parseFloat(RGB_MAX);

  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h: any,
    s,
    v = max;

  var d = max - min;

  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [
    Math.round(h * HUE_MAX),
    Math.round(s * SV_MAX),
    Math.round(v * SV_MAX),
  ];
};

const normalizeAngle = (degrees: number) => ((degrees % 360) + 360) % 360;
const hue2Rgb = (p: number, q: number, t: number) => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
};

const hslToRgb = (hsl: number[]) => {
  let [h, s, l] = hsl;

  var r, g, b;

  h = normalizeAngle(h);
  h = h === HUE_MAX ? 1 : (h % HUE_MAX) / parseFloat(HUE_MAX);
  s = s === SV_MAX ? 1 : (s % SV_MAX) / parseFloat(SV_MAX);
  l = l === SV_MAX ? 1 : (l % SV_MAX) / parseFloat(SV_MAX);

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2Rgb(p, q, h + 1 / 3);
    g = hue2Rgb(p, q, h);
    b = hue2Rgb(p, q, h - 1 / 3);
  }

  return [
    Math.round(r * RGB_MAX),
    Math.round(g * RGB_MAX),
    Math.round(b * RGB_MAX),
  ];
};

const hsvToRgb = (hsv: number[]) => {
  let [h, s, v] = hsv;

  h = normalizeAngle(h);
  h = h === HUE_MAX ? 1 : ((h % HUE_MAX) / parseFloat(HUE_MAX)) * 6;
  s = s === SV_MAX ? 1 : (s % SV_MAX) / parseFloat(SV_MAX);
  v = v === SV_MAX ? 1 : (v % SV_MAX) / parseFloat(SV_MAX);

  var i = Math.floor(h);
  var f = h - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);
  var mod = i % 6;
  var r = [v, q, p, p, t, v][mod];
  var g = [t, v, v, q, p, p][mod];
  var b = [p, p, t, v, v, q][mod];

  return [
    Math.floor(r * RGB_MAX),
    Math.floor(g * RGB_MAX),
    Math.floor(b * RGB_MAX),
  ];
};

export const hslToHex = (hsl: number[]) => {
  const rgb = hslToRgb(hsl);
  const hex = rgbToHex(rgb);
  return hex;
};

export const hsvToHex = (hsv: number[]) => {
  const rgb = hsvToRgb(hsv);
  const hex = rgbToHex(rgb);
  return hex;
};

export const hexToHsl = (hex: any) => {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb);
  return hsl;
};

export const hexToHsv = (hex: any) => {
  const rgb = hexToRgb(hex);
  const hsv = rgbToHsv(rgb);
  return hsv;
};

export const hexToLightness = (hex: any) => {
  const rgb = hexToRgb(hex);
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const lightness = ((min + max) / 2) * 100;
  return lightness;
};

export const hexArrToPalette = (hexArr: any) => {
  const keys = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  const entries = keys.map((value, index) => [value, hexArr[index]]);
  const base = hexArr[5];
  const name = namer(base).pantone[0].name.toLowerCase().replace(/\s/g, "-");
  const hsl = hexArr.map((value: any) => hexToHsl(value));
  const hsv = hexArr.map((value: any) => hexToHsv(value));
  return {
    name: name,
    base: base,
    values: hexArr,
    palette: {
      [name]: Object.fromEntries(entries),
    },
    hsl: hsl,
    hsv: hsv,
  };
};
