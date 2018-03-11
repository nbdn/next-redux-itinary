/* eslint-env jest */

import React from 'react';
import renderer from 'react-test-renderer';

import Maps from '../maps.js';

describe('Snapshot Testing', () => {
  it('Maps mount without crashing', () => {
    const mockUrl = { query: '' };
    const component = renderer.create(<Maps url={mockUrl} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
