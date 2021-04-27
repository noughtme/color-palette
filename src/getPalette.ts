import namer from "color-namer";

import { hexToHsl, hslToHex, hexToRgb, rgbToHex, hexToHsv } from "./utils";

const incrLightness = (hex: string, intensity: number) => {
  let [h, s, l] = hexToHsl(hex);
  l = Math.round(l + (100 - l) * intensity);
  return hslToHex([h, s, l]);
};

const decLightness = (hex: string, intensity: number) => {
  let [h, s, l] = hexToHsl(hex);
  l = Math.round(l * intensity);
  return hslToHex([h, s, l]);
};

const lighten = (hex: string, intensity: number) => {
  const color = hexToRgb(hex);
  const r = Math.round(color[0] + (255 - color[0]) * intensity);
  const g = Math.round(color[1] + (255 - color[1]) * intensity);
  const b = Math.round(color[2] + (255 - color[2]) * intensity);
  return rgbToHex([r, g, b]);
};

const darken = (hex: string, intensity: number) => {
  const color = hexToRgb(hex);
  const r = Math.round(color[0] * intensity);
  const g = Math.round(color[1] * intensity);
  const b = Math.round(color[2] * intensity);

  return rgbToHex([r, g, b]);
};

interface Options {
  colorSpace?: string;
  intensityMap?: number[];
}

export const getPalette = (hex: string, options?: Options) => {
  const base = "#" + hex;
  const name = namer(base).pantone[0].name.toLowerCase().replace(/\s/g, "-");

  let intensityMap: {
    [key: number]: number;
  };

  const defaultMap: {
    [key: number]: number;
  } = {
    50: 0.95,
    100: 0.9,
    200: 0.75,
    300: 0.6,
    400: 0.3,
    500: 1,
    600: 0.9,
    700: 0.75,
    800: 0.6,
    900: 0.49,
  };

  if (options?.intensityMap && options.intensityMap.length === 9) {
    const mapKeys = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    const values = options.intensityMap;
    const entries = mapKeys.map((key, index) => [key, values[index]]);
    const customMap = Object.fromEntries(entries);
    intensityMap = customMap;
  } else {
    intensityMap = defaultMap;
  }

  let lighter;
  let darker;
  switch (options?.colorSpace) {
    case "hsl":
      lighter = [50, 100, 200, 300, 400].map((level) =>
        incrLightness(base, intensityMap[level])
      );
      darker = [600, 700, 800, 900].map((level) =>
        decLightness(base, intensityMap[level])
      );
      break;
    default:
      lighter = [50, 100, 200, 300, 400].map((level) =>
        lighten(base, intensityMap[level])
      );
      darker = [600, 700, 800, 900].map((level) =>
        darken(base, intensityMap[level])
      );
  }

  const keys = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

  const toPalette = (keys: any, values: any, name: string) => {
    const entries = keys.map((entry: any, index: any) => [
      entry,
      values[index],
    ]);
    return {
      [name]: Object.fromEntries(entries),
    };
  };

  const values = [...lighter, base, ...darker];
  const palette = toPalette(keys, values, name);
  const hsl = values.map((value) => hexToHsl(value));
  const hsv = values.map((value) => hexToHsv(value));

  return {
    name: name,
    base: base,
    values: values,
    palette: palette,
    hsl: hsl,
    hsv: hsv,
  };
};
