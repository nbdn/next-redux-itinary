import styled from 'styled-components';
import { ButtonOutline } from 'rebass';


const ButtonOutlineWithCustomStyles = styled(ButtonOutline) `
  :hover {
    border-color: #19b5fe;
    color: #19b5fe;
    opacity: 0.6
  }
`;

export default ButtonOutlineWithCustomStyles;