/* Developed collaboratively using AI (Chat GPT) */

import { MemoryRouter } from 'react-router-dom';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { Form } from '@folio/stripes-acq-components/experimental';

import {
  BATCH_ALLOCATION_FIELDS,
  BATCH_ALLOCATION_FORM_SPECIAL_FIELDS,
} from '../../constants';
import { useBatchAllocationFormatter } from './useBatchAllocationFormatter';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useTags: jest.fn(() => ({ tags: [], refetch: jest.fn() })),
  useTagsConfigs: jest.fn(() => ({ configs: [{ value: 'true' }] })),
  useTagsMutation: jest.fn(() => ({ createTag: jest.fn() })),
}));

const wrapper = ({ children }) => (
  <MemoryRouter>
    <Form
      initialValues={{}}
      onSubmit={jest.fn()}
    >
      {children}
    </Form>
  </MemoryRouter>
);

describe('useBatchAllocationFormatter', () => {
  const mockIntl = { formatMessage: jest.fn() };

  it('should return the expected column components', () => {
    const { result } = renderHook(() => useBatchAllocationFormatter(mockIntl), { wrapper });

    expect(result.current).toHaveProperty('fundStatus');
    expect(result.current).toHaveProperty('budgetStatus');
    expect(result.current).toHaveProperty('budgetAfterAllocation');
    expect(result.current).toHaveProperty('budgetAllocationChange');
    expect(result.current).toHaveProperty('budgetAllowableEncumbrance');
    expect(result.current).toHaveProperty('budgetAllowableExpenditure');
    expect(result.current).toHaveProperty('transactionDescription');
    expect(result.current).toHaveProperty('transactionTag');
  });

  it('should return correct field names for budget status', () => {
    const { result } = renderHook(() => useBatchAllocationFormatter(mockIntl), { wrapper });

    const budgetStatusComponent = result.current.budgetStatus({ [BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.index]: 1 });

    expect(budgetStatusComponent.props.name)
      .toBe(`${BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.fyFinanceData}[1].${BATCH_ALLOCATION_FIELDS.budgetStatus}`);
  });

  it('should return correct field names for fund status', () => {
    const { result } = renderHook(() => useBatchAllocationFormatter(mockIntl), { wrapper });

    const fundStatusComponent = result.current.fundStatus({ [BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.index]: 2 });

    expect(fundStatusComponent.props.name)
      .toBe(`${BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.fyFinanceData}[2].${BATCH_ALLOCATION_FIELDS.fundStatus}`);
  });

  it('should return correct field names for transaction description', () => {
    const { result } = renderHook(() => useBatchAllocationFormatter(mockIntl), { wrapper });

    const transactionDescriptionComponent = result.current.transactionDescription({
      [BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.index]: 0,
    });

    expect(transactionDescriptionComponent.props.name)
      .toBe(`${BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.fyFinanceData}[0].${BATCH_ALLOCATION_FIELDS.transactionDescription}`);
  });
});
