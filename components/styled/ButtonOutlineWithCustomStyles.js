import styled from 'styled-components';
import { ButtonOutline } from 'rebass';

import Colors from '../../theme/Colors';

const ButtonOutlineWithCustomStyles = styled(ButtonOutline)`
  :hover {
    border-color: ${Colors.primary};
    color: ${Colors.primary};
    opacity: 0.6;
  }
`;

export default ButtonOutlineWithCustomStyles;
