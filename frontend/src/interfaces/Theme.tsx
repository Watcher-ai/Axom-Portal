export interface ThemeColors {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    contrastA500: string;
    contrastA600: string;
  }
  
  export interface Theme {
    isDarkMode: boolean;
    colors: ThemeColors;
  }