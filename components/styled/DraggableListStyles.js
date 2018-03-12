import { injectGlobal } from 'styled-components';

import Colors from '../../theme/Colors';

injectGlobal`

.draggable {
  height: 400px;
}

.draggable-item {
  position: absolute;
  overflow: visible;
  width: 90%;
  padding: 5px;
  pointer-events: auto;
  transform-origin: 50% 50% 0px;
  border-radius: 4px;
  font-weight: 400;
  background-color: ${Colors.transparent};
  box-sizing: border-box;
  -webkit-box-sizing: border-box;

  &:hover {
    cursor: grab;
  }
}

  `;
