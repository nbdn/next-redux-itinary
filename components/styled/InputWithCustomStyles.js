import styled from 'styled-components';
import { Input } from 'rebass';

const InputWithCustomStyles = styled(Input)`
  margin: 7px 0px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid ${props => (props.isvalid ? 'black' : 'red')};
  font-weight: 1;
  font-size: 0.9rem;
  width: 100%;
`;

export default InputWithCustomStyles;
