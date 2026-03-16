import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    width: 100%;
    line-height: 1.5;
    -webkit-tap-highlight-color: transparent;
    -webkit-text-size-adjust: none;
    touch-action: manipulation;
    background: #000000;
    overflow-x: hidden;
  }

  body, textarea, input, button, select {
    font-family: -apple-system, "SF Pro Display", "SF Pro Text", system-ui, sans-serif;
    color: #f5f5f7;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    height: 100%;
    width: 100%;
  }

  button, input, textarea, select {
    outline: none;
    border: none;
    border-radius: 0;
    background: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  input:focus, textarea:focus {
    outline: none;
  }

  button {
    cursor: pointer;
    user-select: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ::selection {
    background: rgba(255, 255, 255, 0.15);
  }
`;
