import { MemoryRouter } from 'react-router-dom';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import { act, render, screen } from '@folio/jest-config-stripes/testing-library/react';
import stripesFinalForm from '@folio/stripes/final-form';
import {
  FindLocation,
  useLocations,
} from '@folio/stripes-acq-components';

import { FundLocations } from './FundLocations';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  FindLocation: jest.fn(() => 'FindLocation'),
  useLocations: jest.fn(),
}));

const locations = [
  { id: 'location-1', name: 'Loc 1', code: 'l1' },
  { id: 'location-2', name: 'Loc 2', code: 'l2' },
  { id: 'location-3', name: 'Loc 3', code: 'l3' },
];
const locationIds = locations.map(({ id }) => id);

const defaultProps = {
  assignedLocations: locationIds,
  name: 'locationIds',
};

const Form = stripesFinalForm({})(({ children }) => (
  <form>
    {children}
  </form>
));

const renderFundLocations = (props = {}, formProps = {}) => render(
  <Form
    initialValues={{ locationIds }}
    onSubmit={jest.fn()}
    {...formProps}
  >
    <FundLocations
      {...defaultProps}
      {...props}
    />
  </Form>,
  { wrapper: MemoryRouter },
);

describe('FundLocations', () => {
  beforeEach(() => {
    FindLocation.mockClear();
    useLocations
      .mockClear()
      .mockReturnValue({
        isLoading: false,
        locations,
      });
  });

  it('should render fund location components (list and action buttons)', () => {
    renderFundLocations();

    locations.forEach(({ code, name }) => {
      expect(screen.getByText(`${name} (${code})`)).toBeInTheDocument();
    });
  });

  it('should assign more locations for the fund', () => {
    const extraRecord = { id: 'location-4', name: 'Loc 4', code: 'l4' };

    useLocations.mockReturnValue({ locations: [...locations, extraRecord] });

    renderFundLocations();

    act(() => {
      FindLocation.mock.calls[0][0].onRecordsSelect([
        ...locations,
        extraRecord,
      ]);
    });

    locations.forEach(({ code, name }) => {
      expect(screen.getByText(`${name} (${code})`)).toBeInTheDocument();
    });
    expect(screen.getByText(`${extraRecord.name} (${extraRecord.code})`)).toBeInTheDocument();
  });

  it('should unassign location from the fund', () => {
    renderFundLocations();

    const selected = locations.slice(0, 2);

    act(() => {
      FindLocation.mock.calls[0][0].onRecordsSelect(selected);
    });

    selected.forEach(({ code, name }) => {
      expect(screen.getByText(`${name} (${code})`)).toBeInTheDocument();
    });
    expect(screen.queryByText(locations[2].name)).not.toBeInTheDocument();
  });

  it('should unassign all the locations from the fund', async () => {
    renderFundLocations();

    await user.click(screen.getByRole('button', { name: 'ui-finance.fund.information.locations.action.removeAll' }));
    await user.click(screen.getByRole('button', { name: 'stripes-components.submit' }));

    expect(screen.getByText('ui-finance.fund.information.locations.empty')).toBeInTheDocument();
  });
});
