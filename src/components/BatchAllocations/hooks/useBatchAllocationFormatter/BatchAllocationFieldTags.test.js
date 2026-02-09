import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { Form } from '@folio/stripes-acq-components/experimental';

import { BATCH_ALLOCATION_FORM_SPECIAL_FIELDS } from '../../constants';
import { BatchAllocationFieldTags } from './BatchAllocationFieldTags';

// Mock Field component to simplify testing
jest.mock('@folio/stripes-acq-components/experimental', () => ({
  ...jest.requireActual('@folio/stripes-acq-components/experimental'),
  Field: jest.fn(({ name, dataOptions, actions, showLoading, disabled, ...props }) => (
    <div data-testid="field-mock">
      <input
        data-testid="field-input"
        name={name}
        disabled={disabled}
        data-show-loading={showLoading}
        {...props}
      />
      <div data-testid="field-options" data-options={JSON.stringify(dataOptions || [])} />
      <div data-testid="field-actions" data-actions-count={actions?.length || 0} />
    </div>
  )),
  seTags: jest.fn(() => ({ tags: [], refetch: jest.fn() })),
  useTagsConfigs: jest.fn(() => ({ configs: [{ value: 'true' }] })),
  useTagsMutation: jest.fn(() => ({ createTag: jest.fn() })),
}));

const mockEngine = {
  getFormState: jest.fn(() => ({
    values: {
      fyFinanceData: [
        {
          transactionTag: { tagList: [] },
        },
      ],
    },
  })),
  set: jest.fn(),
  get: jest.fn(() => []),
};

const defaultProps = {
  allTags: [
    { label: 'Tag1', value: 'tag1' },
    { label: 'Tag2', value: 'tag2' },
    { label: 'Tag3', value: 'tag3' },
  ],
  engine: mockEngine,
  field: {
    [BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.index]: 0,
    name: 'fyFinanceData[0]',
  },
  isLoading: false,
  onAdd: jest.fn(),
};

const wrapper = ({ children }) => (
  <MemoryRouter>
    <Form
      initialValues={{
        fyFinanceData: [
          {
            transactionTag: { tagList: [] },
          },
        ],
      }}
      onSubmit={jest.fn()}
    >
      {children}
    </Form>
  </MemoryRouter>
);

const renderComponent = (props = {}) => render(
  <BatchAllocationFieldTags
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('BatchAllocationFieldTags', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render Field component', () => {
    renderComponent();

    expect(screen.getByTestId('field-mock')).toBeInTheDocument();
    expect(screen.getByTestId('field-input')).toBeInTheDocument();
  });

  it('should render tags field in a div wrapper', () => {
    const { container } = renderComponent();

    expect(container.querySelector('div[class*="tagsField"]')).toBeInTheDocument();
  });

  it('should pass loading state to Field', () => {
    renderComponent({ isLoading: true });

    const input = screen.getByTestId('field-input');

    expect(input).toHaveAttribute('data-show-loading', 'true');
  });

  it('should pass disabled state to Field', () => {
    renderComponent({ disabled: true });

    const input = screen.getByTestId('field-input');

    expect(input).toHaveAttribute('disabled');
  });

  it('should pass sorted dataOptions to Field', () => {
    renderComponent();

    const optionsElement = screen.getByTestId('field-options');
    const dataOptions = JSON.parse(optionsElement.dataset.options);

    expect(dataOptions).toEqual(['tag1', 'tag2', 'tag3']);
  });

  it('should handle empty allTags array', () => {
    renderComponent({ allTags: [] });

    const optionsElement = screen.getByTestId('field-options');
    const dataOptions = JSON.parse(optionsElement.dataset.options);

    expect(dataOptions).toEqual([]);
  });

  it('should sort dataOptions alphabetically', () => {
    const unsortedTags = [
      { label: 'Zebra', value: 'zebra' },
      { label: 'Apple', value: 'apple' },
      { label: 'Mango', value: 'mango' },
    ];

    renderComponent({ allTags: unsortedTags });

    const optionsElement = screen.getByTestId('field-options');
    const dataOptions = JSON.parse(optionsElement.dataset.options);

    expect(dataOptions).toEqual(['apple', 'mango', 'zebra']);
  });

  it('should pass actions array to Field', () => {
    renderComponent();

    const actionsElement = screen.getByTestId('field-actions');
    const actionsCount = Number(actionsElement.dataset.actionsCount);

    expect(actionsCount).toBe(1);
  });

  it('should pass custom allTags correctly', () => {
    const customTags = [
      { label: 'Custom1', value: 'custom1' },
      { label: 'Custom2', value: 'custom2' },
    ];

    renderComponent({ allTags: customTags });

    const optionsElement = screen.getByTestId('field-options');
    const dataOptions = JSON.parse(optionsElement.dataset.options);

    expect(dataOptions).toEqual(['custom1', 'custom2']);
  });
});
