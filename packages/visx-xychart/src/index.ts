// components
export { default as XYChart } from './components/XYChart';
export { default as Axis } from './components/axis/Axis';
export { default as AnimatedAxis } from './components/axis/AnimatedAxis';
export { default as Grid } from './components/grid/Grid';
export { default as AnimatedGrid } from './components/grid/AnimatedGrid';

// series components
export { default as BarSeries } from './components/series/BarSeries';
export { default as LineSeries } from './components/series/LineSeries';

// context
export { default as ThemeContext } from './context/ThemeContext';
export { default as DataContext } from './context/DataContext';

// providers
export { default as ThemeProvider } from './providers/ThemeProvider';
export { default as DataProvider } from './providers/DataProvider';

// themes
export { default as lightTheme } from './theme/themes/light';
export { default as darkTheme } from './theme/themes/dark';
export { default as buildChartTheme } from './theme/buildChartTheme';
export { allColors, grayColors, defaultColors } from './theme/colors';

// types
export * from './types';
