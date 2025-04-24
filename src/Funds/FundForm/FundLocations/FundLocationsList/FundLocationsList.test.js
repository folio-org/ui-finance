import { FieldArray } from 'react-final-form-arrays';
import { MemoryRouter } from 'react-router-dom';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import {
  checkIfUserInCentralTenant,
  useStripes,
} from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';

import { FundLocationsList } from './FundLocationsList';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn(() => {}),
  checkIfUserInCentralTenant: jest.fn(() => false),
}));

const locations = [
  {
    id: 'location-1',
    name: 'Loc 1',
    code: 'l1',
    tenantId: 'tenant-1',
  },
  {
    id: 'location-2',
    name: 'Loc 2',
    code: 'l2',
    tenantId: 'tenant-1',
  },
  {
    id: 'location-3',
    name: 'Loc 3',
    code: 'l3',
    tenantId: 'tenant-2',
  },
];
const assignedLocations = locations.map(({ id }) => ({ locationId: id }));

const stripes = {
  user: {
    user: {
      tenants: [
        { id: 'tenant-1', name: 'Tenant 1 name' },
        { id: 'tenant-2', name: 'Tenant 2 name' },
      ],
    },
  },
};

const defaultProps = {
  locations,
  tenants: stripes.user.user.tenants,
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
  beforeEach(() => {
    checkIfUserInCentralTenant.mockClear();
    useStripes
      .mockClear()
      .mockReturnValue(stripes);
  });

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

  describe('ECS mode enabled', () => {
    beforeEach(() => {
      checkIfUserInCentralTenant
        .mockClear()
        .mockReturnValue(true);
    });

    it('should render the message indicating the location emptiness', () => {
      renderFundLocationsList(null, { initialValues: { locations: [] } });

      expect(screen.getByText('ui-finance.fund.information.locations.empty')).toBeInTheDocument();
    });

    it('should render restricted locations grouped by affiliations (tenants) in the central tenant', () => {
      renderFundLocationsList({ centralOrdering: true });

      stripes.user.user.tenants.forEach(({ name }) => {
        expect(screen.getByText(name)).toBeInTheDocument();
      });
    });
  });
});
