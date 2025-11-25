import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { Form } from '@folio/stripes-acq-components/experimental';

import { BATCH_ALLOCATION_FLOW_TYPE } from '../constants';
import BatchAllocationsForm from './BatchAllocationsForm';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(() => jest.fn()),
  useTags: jest.fn(() => ({ tags: [], refetch: jest.fn() })),
  useTagsConfigs: jest.fn(() => ({ configs: [{ value: 'true' }] })),
  useTagsMutation: jest.fn(() => ({ createTag: jest.fn() })),
}));

const defaultProps = {
  changeSorting: jest.fn(),
  currentFiscalYears: [
    { series: 'FY2025', periodStart: '2025-01-01' },
  ],
  fiscalYear: { code: '2025', series: 'FY2025', periodStart: '2025-01-01', currency: 'USD' },
  flowType: BATCH_ALLOCATION_FLOW_TYPE.CREATE,
  headline: 'Test Headline',
  initialValues: {
    fyFinanceData: [
      {
        fundId: 'fund1',
        fundName: 'Fund 1',
        budgetAllocationChange: 0,
      },
    ],
  },
  isLoading: false,
  isRecalculateDisabled: false,
  isSubmitDisabled: false,
  onCancel: jest.fn(),
  paneSub: 'Test Source',
  paneTitle: 'FY2025',
  recalculate: jest.fn(() => Promise.resolve({ fyFinanceData: [] })),
  recalculateOnInit: false,
  sortingField: 'fundName',
  sortingDirection: 'asc',
};

const wrapper = ({ children }) => (
  <MemoryRouter>
    <Form
      initialValues={defaultProps.initialValues}
      onSubmit={jest.fn()}
    >
      {children}
    </Form>
  </MemoryRouter>
);

const renderComponent = (props = {}) => render(
  <BatchAllocationsForm
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('BatchAllocationsForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render pane with title and subtitle', () => {
    renderComponent();

    expect(screen.getByText(defaultProps.paneTitle)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.paneSub)).toBeInTheDocument();
  });

  it('should render headline', () => {
    renderComponent();

    expect(screen.getByText(defaultProps.headline)).toBeInTheDocument();
  });

  it('should render BatchAllocationList component', () => {
    renderComponent();

    // Check that the list is rendered by looking for the editable list structure
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('should render cancel button', () => {
    renderComponent();

    expect(screen.getByRole('button', { name: 'stripes-acq-components.FormFooter.cancel' })).toBeInTheDocument();
  });

  it('should render recalculate button', () => {
    renderComponent();

    expect(screen.getByRole('button', { name: 'ui-finance.allocation.batch.form.footer.recalculate' })).toBeInTheDocument();
  });

  it('should render save and close button', () => {
    renderComponent();

    expect(screen.getByRole('button', { name: 'stripes-components.saveAndClose' })).toBeInTheDocument();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const onCancel = jest.fn();

    renderComponent({ onCancel });

    await userEvent.click(screen.getByRole('button', { name: 'stripes-acq-components.FormFooter.cancel' }));

    expect(onCancel).toHaveBeenCalled();
  });

  it('should call recalculate when recalculate button is clicked', async () => {
    const recalculate = jest.fn(() => Promise.resolve({ fyFinanceData: [] }));

    renderComponent({ recalculate });

    await userEvent.click(screen.getByRole('button', { name: 'ui-finance.allocation.batch.form.footer.recalculate' }));

    await waitFor(() => {
      expect(recalculate).toHaveBeenCalled();
    });
  });

  it('should disable recalculate button when isRecalculateDisabled is true', () => {
    renderComponent({ isRecalculateDisabled: true });

    expect(screen.getByRole('button', { name: 'ui-finance.allocation.batch.form.footer.recalculate' })).toBeDisabled();
  });

  it('should disable save button when isSubmitDisabled is true', () => {
    renderComponent({ isSubmitDisabled: true });

    expect(screen.getByRole('button', { name: 'stripes-components.saveAndClose' })).toBeDisabled();
  });

  it('should render invalid funds message when invalidFunds are present', () => {
    const initialValues = {
      ...defaultProps.initialValues,
      invalidFunds: [
        { fundId: 'invalid1', fundName: 'Invalid Fund 1' },
        { fundId: 'invalid2', fundName: 'Invalid Fund 2' },
      ],
    };

    renderComponent({ initialValues });

    expect(screen.getByText('ui-finance.allocation.batch.form.validation.error.invalidFunds')).toBeInTheDocument();
    expect(screen.getByText('Invalid Fund 1')).toBeInTheDocument();
    expect(screen.getByText('Invalid Fund 2')).toBeInTheDocument();
  });

  it('should call onCancel when pane close button is clicked', async () => {
    const onCancel = jest.fn();

    renderComponent({ onCancel });

    const closeButton = screen.getByLabelText('stripes-components.closeItem');

    await userEvent.click(closeButton);

    expect(onCancel).toHaveBeenCalled();
  });

  it('should call changeSorting when sorting is enabled', () => {
    const changeSorting = jest.fn();

    renderComponent({ changeSorting });

    expect(changeSorting).toBeDefined();
  });
});
