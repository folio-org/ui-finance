import React from 'react';
import { render } from '@testing-library/react';

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

const stripes = { hasPerm: () => true };
const renderExpenseClassSettings = () => render(<ExpenseClassSettings stripes={stripes} />);

describe('ExpenseClassSettings component', () => {
  it('should display helper message', () => {
    const { getByText } = renderExpenseClassSettings();

    expect(getByText('ui-finance.expenseClass.helper')).toBeDefined();
  });
});
