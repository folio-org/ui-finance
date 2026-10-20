import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { useFiscalYears } from '@folio/stripes-acq-components';

import BrowseFiscalYearFilter from './BrowseFiscalYearFilter';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  // eslint-disable-next-line react/prop-types
  Selection: ({ onChange, placeholder }) => (
    <button type="button" onClick={() => onChange('fy1')}>{placeholder}</button>
  ),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useFiscalYears: jest.fn(),
}));

const onChange = jest.fn();

const renderComponent = () => render(
  <BrowseFiscalYearFilter
    id="fiscalYearId"
    name="fiscalYearId"
    labelId="ui-finance.browse.filter.fiscalYear"
    onChange={onChange}
  />,
);

describe('BrowseFiscalYearFilter', () => {
  it('should show the placeholder when no fiscal year is selected', () => {
    useFiscalYears.mockReturnValue({ isLoading: false, fiscalYears: [{ id: 'fy1', code: 'FY2026' }] });

    renderComponent();

    expect(screen.getByText('ui-finance.browse.filter.fiscalYear')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.selectFiscalYear')).toBeInTheDocument();
  });

  it('should not render the selection while fiscal years are loading', () => {
    useFiscalYears.mockReturnValue({ isLoading: true, fiscalYears: [] });

    renderComponent();

    expect(screen.queryByText('ui-finance.selectFiscalYear')).not.toBeInTheDocument();
  });

  it('should report the selected fiscal year', async () => {
    useFiscalYears.mockReturnValue({ isLoading: false, fiscalYears: [{ id: 'fy1', code: 'FY2026' }] });

    renderComponent();
    await userEvent.click(screen.getByText('ui-finance.selectFiscalYear'));

    expect(onChange).toHaveBeenCalledWith({ name: 'fiscalYearId', values: ['fy1'] });
  });
});
