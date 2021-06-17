import React from 'react';
import { act, render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import LedgerGroups from './LedgerGroups';

const renderLedgerGroups = ({
  funds = [],
  currency = 'USD',
  mutator,
  ledgerId = 'ledgerId',
  fiscalYearId = 'fyId',
}) => (render(
  <MemoryRouter>
    <LedgerGroups
      history={{}}
      mutator={mutator}
      fiscalYearId={fiscalYearId}
      ledgerId={ledgerId}
      currency={currency}
      funds={funds}
    />
  </MemoryRouter>,
));

describe('LedgerGroups', () => {
  let mutator;

  beforeEach(() => {
    mutator = {
      groupFundFYByFundId: {
        GET: jest.fn(),
      },
      groups: {
        GET: jest.fn(),
      },
      ledgerGroupSummaries: {
        GET: jest.fn(),
      },
    };
  });

  afterEach(cleanup);

  it('should load all data', async () => {
    mutator.groupFundFYByFundId.GET.mockReturnValue(Promise.resolve({}));
    mutator.groups.GET.mockReturnValue(Promise.resolve([]));
    mutator.ledgerGroupSummaries.GET.mockReturnValue(Promise.resolve({}));

    await act(async () => {
      renderLedgerGroups({ mutator, funds: [{ id: 'fundId' }] });
    });

    expect(mutator.groupFundFYByFundId.GET).toHaveBeenCalled();
    expect(mutator.groups.GET).toHaveBeenCalled();
    expect(mutator.ledgerGroupSummaries.GET).toHaveBeenCalled();
  });

  it('should not load data', async () => {
    await act(async () => {
      renderLedgerGroups({ mutator });
    });

    expect(mutator.groupFundFYByFundId.GET).not.toHaveBeenCalled();
    expect(mutator.groups.GET).not.toHaveBeenCalled();
    expect(mutator.ledgerGroupSummaries.GET).not.toHaveBeenCalled();
  });
});
