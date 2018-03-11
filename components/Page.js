import { Component } from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { loadGetInitialProps } from 'next/dist/lib/utils';
import 'isomorphic-fetch';

import getStore from '../redux/store';

const getInitialState = reduxStore => ({
  ...reduxStore.getState()
});

export default ComposedComponent =>
  class WithData extends Component {
    static propTypes = {
      initialState: PropTypes.object
    };

    static async getInitialProps(ctx) {
      const subProps = await loadGetInitialProps(ComposedComponent, ctx);
      const reduxStore = getStore({});
      const props = { ...subProps };

      return {
        initialState: getInitialState(reduxStore),
        ...props
      };
    }
    constructor(props) {
      super(props);
      const reduxStore = getStore(this.props.initialState);
      this.reduxStore = reduxStore;
    }
    render() {
      return (
        <Provider store={this.reduxStore}>
          <ComposedComponent {...this.props} />
        </Provider>
      );
    }
  };
