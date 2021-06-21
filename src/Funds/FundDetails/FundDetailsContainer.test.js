import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { FundDetailsContainer } from './FundDetailsContainer';

jest.mock('./FundDetails', () => jest.fn().mockReturnValue('FundDetails'));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useAcqRestrictions: jest.fn().mockReturnValue({ restrictions: {} }),
}));
jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
  expandAllSections: jest.fn(),
  collapseAllSections: jest.fn(),
}));

const historyMock = {
  push: jest.fn(),
  action: 'PUSH',
  block: jest.fn(),
};
const mutatorMock = {
  fund: {
    GET: jest.fn().mockReturnValue(Promise.resolve({ fund: { ledgerId: 'ledgerId', name: 'name', code: 'code' } })),
    DELETE: jest.fn(),
  },
  fundCurrentFY: {
    GET: jest.fn().mockReturnValue(Promise.resolve()),
  },
  currentBudget: {
    GET: jest.fn(),
  },
};
const defaultProps = {
  mutator: mutatorMock,
  match: { params: { id: 'fundId' }, path: 'path', url: 'url' },
  history: historyMock,
  location: { hash: 'hash' },
  stripes: { hasPerm: jest.fn() },
};
const renderFundDetailsContainer = (props = defaultProps) => render(
  <FundDetailsContainer {...props} />,
  { wrapper: MemoryRouter },
);

describe('FundDetailsContainer', () => {
  beforeEach(() => {
    historyMock.push.mockClear();
  });
  it('should display FundDetails', async () => {
    renderFundDetailsContainer();

    await screen.findByText('FundDetails');

    expect(screen.getByText('FundDetails')).toBeDefined();
  });
});
