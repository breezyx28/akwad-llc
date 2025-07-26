// src/theme/theme.d.ts
import { PaletteColor, SimplePaletteColorOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    green: PaletteColor;
  }

  interface PaletteOptions {
    green?: SimplePaletteColorOptions;
  }
}
