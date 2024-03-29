import React from 'react';
import { act, render, cleanup } from '@folio/jest-config-stripes/testing-library/react';

import FundTypeContainer from './FundTypeContainer';

const renderFundTypeContainer = ({
  mutator,
  fundTypeId,
}) => (render(
  <FundTypeContainer
    fundTypeId={fundTypeId}
    mutator={mutator}
  />,
));

describe('FundTypeContainer', () => {
  let mutator;

  beforeEach(() => {
    mutator = {
      fundType: {
        GET: jest.fn(),
      },
    };
  });

  afterEach(cleanup);

  it('should load fund', async () => {
    mutator.fundType.GET.mockReturnValue(Promise.resolve({}));

    await act(async () => {
      renderFundTypeContainer({ mutator, fundTypeId: 'fundId' });
    });

    expect(mutator.fundType.GET).toHaveBeenCalled();
  });

  it('should not load fund', async () => {
    await act(async () => {
      renderFundTypeContainer({ mutator });
    });

    expect(mutator.fundType.GET).not.toHaveBeenCalled();
  });

  it('should handle error when fetching data', async () => {
    mutator.fundType.GET.mockClear().mockReturnValue(Promise.reject());

    await act(async () => {
      renderFundTypeContainer({ mutator, fundTypeId: 'fundId' });
    });

    expect(mutator.fundType.GET).toHaveBeenCalled();
  });
});
