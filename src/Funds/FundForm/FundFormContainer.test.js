import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import FundForm from './FundForm';
import FundFormContainer from './FundFormContainer';

jest.mock('./FundForm', () => jest.fn().mockReturnValue('FundForm'));

const mutatorMock = {
  fundFormFund: {
    GET: jest.fn().mockReturnValue(Promise.resolve({})),
    POST: jest.fn(),
  },
  fundFormFunds: {
    GET: jest.fn().mockReturnValue(Promise.resolve([])),
  },
  fundFormFundTypes: {
    GET: jest.fn().mockReturnValue(Promise.resolve([])),
  },
  fundFormLedgers: {
    GET: jest.fn().mockReturnValue(Promise.resolve([])),
  },
};

const defaultProps = {
  match: { params: {} },
  mutator: mutatorMock,
  onCancel: jest.fn(),
  stripes: { hasPerm: jest.fn() },
};

const renderFundFormContainer = (props = defaultProps) => render(
  <FundFormContainer
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('FundFormContainer', () => {
  beforeEach(() => {
    FundForm.mockClear();
  });
  it('should load data for creation new fund', async () => {
    await act(async () => renderFundFormContainer());

    expect(defaultProps.mutator.fundFormLedgers.GET).toHaveBeenCalled();
    expect(defaultProps.mutator.fundFormFundTypes.GET).toHaveBeenCalled();
    expect(defaultProps.mutator.fundFormFunds.GET).toHaveBeenCalled();
    expect(defaultProps.mutator.fundFormFund.GET).not.toHaveBeenCalled();
  });

  it('should close fund form', () => {
    renderFundFormContainer();

    FundForm.mock.calls[0][0].onCancel();

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });
});
