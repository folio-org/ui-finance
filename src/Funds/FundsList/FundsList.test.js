import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import FundsList from './FundsList';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  // eslint-disable-next-line react/prop-types
  PersistedPaneset: (props) => <div>{props.children}</div>,
}));
jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('@folio/stripes-acq-components', () => {
  return {
    ...jest.requireActual('@folio/stripes-acq-components'),
    useFiltersToogle: jest.fn().mockReturnValue({ isFiltersOpened: true, toggleFilters: jest.fn() }),
    ResetButton: () => <span>ResetButton</span>,
    SingleSearchForm: () => <span>SingleSearchForm</span>,
  };
});

jest.mock('../FundDetails', () => ({
  FundDetailsContainer: jest.fn().mockReturnValue('FundDetailsContainer'),
}));
jest.mock('./FundsListFilters', () => ({
  FundsListFiltersContainer: jest.fn().mockReturnValue('FundsListFiltersContainer'),
}));

const defaultProps = {
  onNeedMoreData: jest.fn(),
  resetData: jest.fn(),
  refreshList: jest.fn(),
  fundsCount: 1,
  funds: [{}],
  isLoading: false,
  history: {},
  location: {},
};

const renderFundsList = (props = defaultProps) => (render(
  <FundsList {...props} />,
  { wrapper: MemoryRouter },
));

describe('FundsList', () => {
  it('should display search control', () => {
    const { getByText } = renderFundsList();

    expect(getByText('SingleSearchForm')).toBeDefined();
  });

  it('should display reset filters control', () => {
    const { getByText } = renderFundsList();

    expect(getByText('ResetButton')).toBeDefined();
  });

  it('should display fund list filters', () => {
    const { getByText } = renderFundsList();

    expect(getByText('FundsListFiltersContainer')).toBeDefined();
  });
});
