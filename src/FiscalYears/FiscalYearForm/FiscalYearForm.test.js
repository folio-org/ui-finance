import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Form } from 'react-final-form';
import { render } from '@testing-library/react';
import user from '@testing-library/user-event';

import FiscalYearForm from './FiscalYearForm';

jest.mock('@folio/stripes-acq-components/lib/AcqUnits/AcqUnitsField', () => {
  return () => <span>AcqUnitsField</span>;
});

const renderFiscalYearForm = (
  initialValues = {},
  onCancel = jest.fn(),
) => (render(
  <MemoryRouter>
    <Form
      onSubmit={jest.fn}
      render={() => (
        <FiscalYearForm
          form={{}}
          onSubmit={jest.fn}
          onCancel={onCancel}
          initialValues={initialValues}
          pristine={false}
          submitting={false}
        />
      )}
    />
  </MemoryRouter>,
));

describe('FiscalYearForm component', () => {
  it('should display title for new fiscal year', () => {
    const { getByText } = renderFiscalYearForm();

    expect(getByText('ui-finance.fiscalYear.form.title.create')).toBeDefined();
  });

  it('should display title for editing fiscal year', () => {
    const { getByText } = renderFiscalYearForm({ id: 'fiscalYearId' });

    expect(getByText('ui-finance.fiscalYear.form.title.edit')).toBeDefined();
  });

  it('should display pane footer', () => {
    const { getByText } = renderFiscalYearForm();

    expect(getByText('stripes-acq-components.FormFooter.cancel')).toBeDefined();
    expect(getByText('ui-finance.saveAndClose')).toBeDefined();
  });

  describe('Close form', () => {
    it('should close the fiscal year form', () => {
      const onCancel = jest.fn();

      const { getByText } = renderFiscalYearForm({}, onCancel);

      user.click(getByText('stripes-acq-components.FormFooter.cancel'));

      expect(onCancel).toHaveBeenCalled();
    });
  });
});
