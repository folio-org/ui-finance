import { FieldArray } from 'react-final-form-arrays';
import { MemoryRouter } from 'react-router-dom';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import stripesFinalForm from '@folio/stripes/final-form';

import { FundLocationsList } from './FundLocationsList';

const locations = [
  { id: 'location-1', name: 'Loc 1', code: 'l1' },
  { id: 'location-2', name: 'Loc 2', code: 'l2' },
  { id: 'location-3', name: 'Loc 3', code: 'l3' },
];
const assignedLocations = locations.map(({ id }) => ({ locationId: id }));

const defaultProps = {
  locations,
};

const Form = stripesFinalForm({})(({ children }) => (
  <form>
    {children}
  </form>
));

const renderFundLocationsList = (props = {}, formProps = {}) => render(
  <Form
    onSubmit={jest.fn()}
    initialValues={{ locations: assignedLocations }}
    {...formProps}
  >
    <FieldArray
      component={FundLocationsList}
      name="locations"
      {...defaultProps}
      {...props}
    />
  </Form>,
  { wrapper: MemoryRouter },
);

describe('FundLocationsList', () => {
  it('should render the list of locations', () => {
    renderFundLocationsList();

    locations.forEach(({ code, name }) => {
      expect(screen.getByText(`${name} (${code})`)).toBeInTheDocument();
    });
  });

  it('should remove an item from the list when \'X\' icon button clicked', async () => {
    renderFundLocationsList();

    const { code, name } = locations[0];
    const locationLabel = `${name} (${code})`;

    await user.click(screen.getByLabelText(`ui-finance.fund.information.locations.action.remove: ${locationLabel}`));

    expect(screen.queryByText(locationLabel)).not.toBeInTheDocument();
  });
});
