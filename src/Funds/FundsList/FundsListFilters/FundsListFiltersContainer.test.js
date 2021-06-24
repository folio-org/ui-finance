import React from 'react';
import { render } from '@testing-library/react';

import FundsListFiltersContainer from './FundsListFiltersContainer';

jest.mock('./FundsListFilters', () => jest.fn().mockReturnValue('FundsListFilters'));

const defaultProps = {
  activeFilters: {},
  applyFilters: jest.fn(),
  resources: {},
};

const renderFundsListFiltersContainer = (props = defaultProps) => (render(
  <FundsListFiltersContainer
    {...props}
  />,
));

describe('FundsListFiltersContainer component', () => {
  it('should display fund list filters', () => {
    const { getByText } = renderFundsListFiltersContainer();

    expect(getByText('FundsListFilters')).toBeDefined();
  });
});
