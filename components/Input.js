import PropTypes from 'prop-types';
import { Absolute, Flex, Label, Relative, Text } from 'rebass';


import InputWithCustomStyles from './styled/InputWithCustomStyles';

const CustomInput = ({
  forceError,
  input: { onChange, value } = {},
  input,
  id,
  isValid,
  label,
  meta: { pristine, visited },
  placeholder = '',
  required,
  showLabel = true
}) => {
  return (
    <Flex flexDirection={'column'} flex={1}>
      {showLabel && (
        <Label mt={10}>
          <Text>{label ? label : placeholder}</Text>
          {required && (
            <Relative top={7}>
              <Absolute left={5} bottom={0}>
                *
              </Absolute>
            </Relative>
          )}
        </Label>
      )}
      <Flex>
        <InputWithCustomStyles
          id={id}
          {...input}
          isvalid={
            (pristine && !visited && !forceError) || isValid ? 'isvalid' : ''
          }
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          value={value}
          required={required}
        />
      </Flex>
    </Flex>
  );
};

CustomInput.propTypes = {
  forceError: PropTypes.string,
  id: PropTypes.string,
  input: PropTypes.object,
  isValid: PropTypes.bool,
  label: PropTypes.string,
  meta: PropTypes.object,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  showLabel: PropTypes.bool
};

CustomInput.defaultProps = {
  placeholder: ''
};

export default CustomInput;
