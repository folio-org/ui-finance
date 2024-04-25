import { MemoryRouter } from 'react-router-dom';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  checkIfUserInCentralTenant,
  useStripes,
} from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';
import {
  ConsortiumLocationsContext,
  FindLocation,
  LocationsContext,
} from '@folio/stripes-acq-components';

import { FundLocations } from './FundLocations';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  checkIfUserInCentralTenant: jest.fn(() => false),
  useStripes: jest.fn(),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  FindLocation: jest.fn(() => 'FindLocation'),
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

const extraLocationRecord = {
  id: 'location-4',
  name: 'Loc 4',
  code: 'l4',
  tenantId: 'tenant-2',
};

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

const buildLocationsContext = (Context, _value = {}) => ({ children }) => {
  const value = {
    isLoading: false,
    locations: [...locations, extraLocationRecord],
    ..._value,
  };

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};
const ContextProviderMock = jest.fn(buildLocationsContext(LocationsContext));

const initAssignedLocations = locations.map(({ id }) => ({ locationId: id }));

const defaultProps = {
  assignedLocations: initAssignedLocations,
  name: 'locations',
};

const Form = stripesFinalForm({})(({ children }) => (
  <form>
    {children}
  </form>
));

const renderFundLocations = (props = {}, formProps = {}) => render(
  <Form
    initialValues={{ locations: initAssignedLocations }}
    onSubmit={jest.fn()}
    {...formProps}
  >
    <ContextProviderMock>
      <FundLocations
        {...defaultProps}
        {...props}
      />
    </ContextProviderMock>
  </Form>,
  { wrapper: MemoryRouter },
);

describe('FundLocations', () => {
  beforeEach(() => {
    checkIfUserInCentralTenant.mockClear();
    ContextProviderMock.mockClear();
    FindLocation.mockClear();
    useStripes
      .mockClear()
      .mockReturnValue(stripes);
  });

  it('should render fund location components (list and action buttons)', () => {
    renderFundLocations();

    locations.forEach(({ code, name }) => {
      expect(screen.getByText(`${name} (${code})`)).toBeInTheDocument();
    });
  });

  it('should assign more locations for the fund', () => {
    renderFundLocations();

    act(() => {
      FindLocation.mock.calls[0][0].onRecordsSelect([
        ...locations,
        extraLocationRecord,
      ]);
    });

    locations.forEach(({ code, name }) => {
      expect(screen.getByText(`${name} (${code})`)).toBeInTheDocument();
    });
    expect(screen.getByText(`${extraLocationRecord.name} (${extraLocationRecord.code})`)).toBeInTheDocument();
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

  describe('ECS mode enabled', () => {
    beforeEach(() => {
      ContextProviderMock
        .mockClear()
        .mockImplementation(buildLocationsContext(ConsortiumLocationsContext));
    });

    it('should render restricted locations grouped by affiliations (tenants) in the central tenant', () => {
      checkIfUserInCentralTenant
        .mockClear()
        .mockReturnValue(true);

      renderFundLocations();

      stripes.user.user.tenants.forEach(({ name }) => {
        expect(screen.getByText(name)).toBeInTheDocument();
      });
    });
  });
});
