import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DrawerWithCustomStyles from './styled/DrawerWithCustomStyles';

class CustomDrawer extends Component {
  state = {
    drawer: true
  };

  toggleDrawer = () => {
    const { drawer } = this.state;
    this.setState({ drawer: !drawer });
  };

  render() {
    const { children } = this.props;
    const { drawer } = this.state;

    return (
      <DrawerWithCustomStyles
        open={drawer}
        position="left"
        p={3}
        color="black"
        bg="white"
      >
        {children}
      </DrawerWithCustomStyles>
    );
  }
}

CustomDrawer.propTypes = {
  children: PropTypes.array
};

export default CustomDrawer;
