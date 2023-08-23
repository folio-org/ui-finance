import React from 'react';
import { render } from '@testing-library/react';

import { ControlledVocab } from '@folio/stripes/smart-components';
import '@folio/stripes-acq-components/test/jest/__mock__';

import ExpenseClassSettings from './ExpenseClassSettings';

jest.mock('@folio/stripes-smart-components/lib/ControlledVocab', () => {
  const MockComponent = jest.fn(({ rowFilter }) => (
    <>
      {rowFilter}
    </>
  ));

  MockComponent.manifest = {};

  return MockComponent;
});

const stripesMock = { hasPerm: jest.fn(() => true) };
const renderExpenseClassSettings = () => render(<ExpenseClassSettings stripes={stripesMock} />);

describe('ExpenseClassSettings component', () => {
  it('should render component', () => {
    const { getByText } = renderExpenseClassSettings(stripesMock);

    const { actionSuppressor } = ControlledVocab.mock.calls[0][0];

    expect(actionSuppressor.edit()).toBeFalsy();
    expect(actionSuppressor.delete()).toBeFalsy();
    expect(getByText('ui-finance.expenseClass.helper')).toBeDefined();
  });
});
