import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Drawer } from 'rebass';

const DrawerWithCustomStyles = styled(Drawer)`
  box-shadow: 0px 2px 6px rgba(7, 7, 7, 0.4);
  overflow-y: scroll;
  z-index: 1;
  min-width: 30vw;
  padding: 0px;
`;

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
