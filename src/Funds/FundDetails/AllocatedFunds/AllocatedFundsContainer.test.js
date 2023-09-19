import React from 'react';
import { act, render, cleanup } from '@folio/jest-config-stripes/testing-library/react';

import AllocatedFundsContainer from './AllocatedFundsContainer';

const renderAllocatedFundsContainer = ({
  mutator,
  fundIds = [],
  labelId = 'allocatedFundsLabelId',
}) => (render(
  <AllocatedFundsContainer
    fundIds={fundIds}
    labelId={labelId}
    mutator={mutator}
  />,
));

describe('AllocatedFundsContainer', () => {
  let mutator;

  beforeEach(() => {
    mutator = {
      allocatedFunds: {
        GET: jest.fn(),
      },
    };
  });

  afterEach(cleanup);

  it('should load allocated funds', async () => {
    mutator.allocatedFunds.GET.mockReturnValue(Promise.resolve([]));

    await act(async () => {
      renderAllocatedFundsContainer({ mutator, fundIds: ['1', '2'] });
    });

    expect(mutator.allocatedFunds.GET).toHaveBeenCalled();
  });

  it('should not load allocated funds', async () => {
    await act(async () => {
      renderAllocatedFundsContainer({ mutator });
    });

    expect(mutator.allocatedFunds.GET).not.toHaveBeenCalled();
  });
});
