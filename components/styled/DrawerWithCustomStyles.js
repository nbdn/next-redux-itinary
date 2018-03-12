import styled from 'styled-components';

import { Drawer } from 'rebass';

const DrawerWithCustomStyles = styled(Drawer)`
  box-shadow: 0px 2px 6px rgba(7, 7, 7, 0.4);
  overflow-y: scroll;
  z-index: 1;
  min-width: 30vw;
  padding: 0px;
`;

export default DrawerWithCustomStyles;
