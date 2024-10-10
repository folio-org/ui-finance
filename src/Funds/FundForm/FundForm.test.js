import { Form } from 'react-final-form';
import { MemoryRouter } from 'react-router-dom';
import { useHistory } from 'react-router';

import {
  act,
  render,
  screen,
  waitFor,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import {
  HasCommand,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';
import {
  ConsortiumLocationsContext,
  ConsortiumLocationsContextProvider,
  LocationsContext,
  LocationsContextProvider,
  useCentralOrderingSettings,
} from '@folio/stripes-acq-components';

import { FUNDS_ROUTE } from '../../common/const';
import FundForm from './FundForm';

jest.mock('@folio/stripes-acq-components/lib/AcqUnits/AcqUnitsField', () => {
  return () => <span>AcqUnitsField</span>;
});
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  ConsortiumLocationsContextProvider: jest.fn(),
  Donors: jest.fn(() => 'Donors'),
  FindLocation: jest.fn(() => 'FindLocation'),
  LocationsContextProvider: jest.fn(),
  useCentralOrderingSettings: jest.fn(),
  useLocations: jest.fn(() => ({})),
}));
jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
  expandAllSections: jest.fn(),
  collapseAllSections: jest.fn(),
}));
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(),
}));
jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useLedgerCurrentFiscalYear: jest.fn(() => ({ currentFiscalYear: { id: 'fy-id', currency: 'USD' } })),
}));

const buildLocationsContextProvider = (Context, _value = {}) => ({ children }) => {
  const value = {
    isLoading: false,
    locations: [],
    ..._value,
  };

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

const defaultProps = {
  onCancel: jest.fn(),
  form: {},
  onSubmit: jest.fn,
  pristine: false,
  submitting: false,
};

const renderFundForm = (props = {}) => (render(
  <MemoryRouter>
    <Form
      onSubmit={jest.fn}
      render={() => (
        <FundForm
          {...defaultProps}
          {...props}
        />
      )}
    />
  </MemoryRouter>,
));

const funds = [
  { id: 'fund-1', name: 'Foo' },
  { id: 'fund-2', name: 'Bar' },
  { id: 'fund-3', name: 'Baz' },
];

describe('FundForm component', () => {
  beforeEach(() => {
    LocationsContextProvider
      .mockClear()
      .mockImplementation(buildLocationsContextProvider(LocationsContext));
    useCentralOrderingSettings
      .mockClear()
      .mockReturnValue({ enabled: false });
  });

  it('should display title for new fund', () => {
    const { getByText } = renderFundForm();

    expect(getByText('ui-finance.fund.paneTitle.create')).toBeDefined();
  });

  it('should display pane footer', () => {
    const { getByText } = renderFundForm();

    expect(getByText('stripes-acq-components.FormFooter.cancel')).toBeDefined();
    expect(getByText('stripes-components.saveAndClose')).toBeDefined();
  });

  it('should display Donors', () => {
    renderFundForm();

    expect(screen.getByText('Donors')).toBeInTheDocument();
  });

  it('should render locations form for a fund restricted by locations', async () => {
    renderFundForm();

    expect(screen.queryByText('ui-finance.fund.information.locations')).not.toBeInTheDocument();

    await user.click(screen.getByLabelText('ui-finance.fund.information.restrictByLocations'));

    expect(screen.getByText('ui-finance.fund.information.locations')).toBeInTheDocument();
  });

  describe('Close form', () => {
    it('should close the fund form', async () => {
      const { getByText } = renderFundForm();

      await user.click(getByText('stripes-acq-components.FormFooter.cancel'));

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });
  });

  describe('Validate fund code', () => {
    it('should display validate colon error', async () => {
      renderFundForm();

      const field = screen.getByRole('textbox', { name: /code/i });

      await act(() => user.type(field, ':'));
      await user.click(screen.getByText('stripes-components.saveAndClose'));

      await waitFor(() => expect(screen.getByText('ui-finance.validation.mustNotIncludeColon')).toBeInTheDocument());
    });

    it.skip('should display validate required error', async () => {
      renderFundForm();

      const field = screen.getByRole('textbox', { name: /code/i });

      await act(() => user.type(field, ''));
      await user.click(screen.getByText('stripes-components.saveAndClose'));

      await waitFor(() => expect(screen.queryByText('stripes-acq-components.validation.required')).toBeInTheDocument());
    });

    it('should filter funds in the \'Transfer from\' field', async () => {
      renderFundForm({ funds });

      const container = (await screen.findByText('ui-finance.fund.information.transferFrom')).parentNode;
      const label = within(container).getByText('ui-finance.fund.information.transferFrom');

      await user.click(label);

      // Options before filtering
      funds.forEach((async ({ name }) => {
        expect(within(container).getByText(name)).toBeInTheDocument();
      }));

      await user.type(document.activeElement, 'foo');

      // Options after filtering
      expect(within(container).queryByText(funds[0].name)).toBeInTheDocument();
      expect(within(container).queryByText(funds[1].name)).not.toBeInTheDocument();
      expect(within(container).queryByText(funds[2].name)).not.toBeInTheDocument();
    });

    it('should select funds options in the \'Transfer to\' field', async () => {
      renderFundForm({ funds });

      const container = (await screen.findByText('ui-finance.fund.information.transferTo')).parentNode;

      funds.forEach(async ({ name }) => {
        await user.click(within(container).queryByText(name));
      });

      await waitFor(() => expect(within(container).getByText(`${funds.length} items selected`)).toBeInTheDocument());
    });
  });

  describe('Shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
      expandAllSections.mockClear();
      collapseAllSections.mockClear();
    });

    it('should call expandAllSections when expandAllSections shortcut is called', async () => {
      expandAllSections.mockClear();
      renderFundForm();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'expandAllSections').handler();

      expect(expandAllSections).toHaveBeenCalled();
    });

    it('should call collapseAllSections when collapseAllSections shortcut is called', () => {
      collapseAllSections.mockClear();
      renderFundForm();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'collapseAllSections').handler();

      expect(collapseAllSections).toHaveBeenCalled();
    });

    it('should cancel form when cancel shortcut is called', () => {
      const pushMock = jest.fn();

      useHistory.mockClear().mockReturnValue({
        push: pushMock,
      });

      renderFundForm();
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'cancel').handler();

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    it('should navigate to list view when search shortcut is called', () => {
      const pushMock = jest.fn();

      useHistory.mockClear().mockReturnValue({
        push: pushMock,
      });

      renderFundForm();
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'search').handler();

      expect(pushMock).toHaveBeenCalledWith(FUNDS_ROUTE);
    });
  });

  describe('ECS mode', () => {
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

    beforeEach(() => {
      ConsortiumLocationsContextProvider
        .mockClear()
        .mockImplementation(buildLocationsContextProvider(ConsortiumLocationsContext, { locations }));
      useCentralOrderingSettings
        .mockClear()
        .mockReturnValue({ enabled: true });
      useStripes
        .mockClear()
        .mockReturnValue(stripes);
    });

    it('should render restricted locations grouped by affiliations (tenants) in the central tenant', () => {
      renderFundForm({
        initialValues: {
          fund: {
            restrictByLocations: true,
            locations: locations.map(({ id, tenantId }) => ({ locationId: id, tenantId })),
          },
        },
      });

      stripes.user.user.tenants.forEach(({ name }) => {
        expect(screen.getByText(name)).toBeInTheDocument();
      });
    });
  });
});
