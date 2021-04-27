interface Palette {
  [shade: number]: string;
}

interface Color {
  [color: string]: Palette | string;
}

export const colors: Color = {
  blue: {
    50: "#f6f7ff",
    100: "#eef0ff",
    200: "#d4d9ff",
    300: "#bbc3ff",
    400: "#8795ff",
    500: "#5468ff",
    600: "#4c5ee6",
    700: "#3f4ebf",
    800: "#323e99",
    900: "#29337d",
  },
  "pacific-blue": {
    50: "#f5fbfc",
    100: "#ebf7f8",
    200: "#ceecef",
    300: "#b0e0e5",
    400: "#75c9d1",
    500: "#3ab2bd",
    600: "#34a0aa",
    700: "#2c868e",
    800: "#236b71",
    900: "#1c575d",
  },
  "wild-watermelon": {
    50: "#fef7f8",
    100: "#fdeff0",
    200: "#fbd6da",
    300: "#f8bdc3",
    400: "#f28c97",
    500: "#ed5a6a",
    600: "#d5515f",
    700: "#b24450",
    800: "#8e3640",
    900: "#742c34",
  },
  "red-violet": {
    50: "#fbf5f9",
    100: "#f7ecf3",
    200: "#ebcfe1",
    300: "#dfb2cf",
    400: "#c678ac",
    500: "#ae3e88",
    600: "#9d387a",
    700: "#832f66",
    800: "#682552",
    900: "#551e43",
  },
};
