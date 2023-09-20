import React from 'react';
import { render } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import TransactionsList from './TransactionsList';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  // eslint-disable-next-line react/prop-types
  PersistedPaneset: (props) => <div>{props.children}</div>,
}));

jest.mock('@folio/stripes-acq-components', () => {
  return {
    ...jest.requireActual('@folio/stripes-acq-components'),
    useFiltersToogle: jest.fn().mockReturnValue({ isFiltersOpened: true, toggleFilters: jest.fn() }),
    ResetButton: () => <span>ResetButton</span>,
    SingleSearchForm: () => <span>SingleSearchForm</span>,
    useItemToView: jest.fn().mockReturnValue({}),
  };
});

jest.mock('../TransactionDetails', () => ({
  TransactionDetailsContainer: jest.fn().mockReturnValue('TransactionDetailsContainer'),
}));
jest.mock('./TransactionsFilters', () => jest.fn().mockReturnValue('TransactionsFilters'));

const defaultProps = {
  onNeedMoreData: jest.fn(),
  resetData: jest.fn(),
  refreshList: jest.fn(),
  transactionsCount: 1,
  transactions: [{}],
  isLoadingTransactions: false,
  funds: [],
  fundId: 'fundId',
  pagination: {},
};
const renderTransactionsList = (props = defaultProps) => (render(
  <TransactionsList {...props} />,
  { wrapper: MemoryRouter },
));

describe('TransactionsList', () => {
  describe('transaction filters', () => {
    it('should display search control', () => {
      const { getByText } = renderTransactionsList();

      expect(getByText('SingleSearchForm')).toBeDefined();
    });

    it('should display reset filters control', () => {
      const { getByText } = renderTransactionsList();

      expect(getByText('ResetButton')).toBeDefined();
    });

    it('should display filters', () => {
      const { getByText } = renderTransactionsList();

      expect(getByText('TransactionsFilters')).toBeDefined();
    });
  });
});
