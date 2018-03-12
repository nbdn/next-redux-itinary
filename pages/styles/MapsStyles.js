import { injectGlobal } from 'styled-components';

injectGlobal`
  * { 
    box-sizing: border-box; 
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }
  html,
  body {
    margin: 0;
    font-family: 'Roboto';
  }
  `;
