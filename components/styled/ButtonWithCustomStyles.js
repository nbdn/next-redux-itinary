import styled from 'styled-components';
import { Button } from 'rebass';


const ButtonWithCustomStyles = styled(Button) `
  :hover {
    opacity: 0.6
  }
`;

export default ButtonWithCustomStyles;