import styled from 'styled-components';
import { Button } from 'rebass';


const ButtonWithCustomStyles = styled(Button)`
  margin: 7px 0px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid ${props => (props.isvalid ? 'black' : 'red')};
  font-weight: 1;
  font-size: 0.9rem;
  width: 100%;
`;

export default ButtonWithCustomStyles;