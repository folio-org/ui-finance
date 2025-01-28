import { useMemo } from 'react';

import { TextField } from '@folio/stripes/components';
import {
  FieldSelectFinal,
  FieldTags,
} from '@folio/stripes-acq-components';
import { Field } from 'react-final-form';

import { getFormattedOptions } from '../BatchAllocationsForm/utils';
import { BARCH_ALLOCATION_STATUS_OPTIONS } from '../constants';
import { BUDGET_STATUSES_OPTIONS } from '../../Budget/constants';

export const useBatchAllocationColumnValues = (intl) => {
  const fundStatusOptions = useMemo(() => getFormattedOptions(intl, BARCH_ALLOCATION_STATUS_OPTIONS), [intl]);
  const budgetStatusOptions = useMemo(() => getFormattedOptions(intl, BUDGET_STATUSES_OPTIONS), [intl]);

  return {
    fundStatus: ({ rowIndex }) => {
      return (
        <FieldSelectFinal
          dataOptions={fundStatusOptions}
          fullWidth
          name={`budgetsFunds.${rowIndex}.fundStatus`}
        />
      );
    },
    budgetStatus: ({ rowIndex }) => {
      return (
        <FieldSelectFinal
          dataOptions={budgetStatusOptions}
          fullWidth
          name={`budgetsFunds.${rowIndex}.budgetStatus`}
        />
      );
    },
    allocationIncreaseDecrease: ({ rowIndex }) => {
      return (
        <Field
          component={TextField}
          name={`budgetsFunds.${rowIndex}.allocationIncreaseDecrease`}
          type="number"
          required
          placeholder="0.00"
        />
      );
    },
    totalAllocatedAfter: ({ rowIndex }) => {
      return (
        <Field
          component={TextField}
          name={`budgetsFunds.${rowIndex}.totalAllocatedAfter`}
          type="number"
          required
          placeholder="0.00"
          disabled
        />
      );
    },
    budgetAllowableEncumbrance: ({ rowIndex }) => {
      return (
        <Field
          component={TextField}
          name={`budgetsFunds.${rowIndex}.budgetAllowableEncumbrance`}
          type="number"
          required
          placeholder="0.00"
        />
      );
    },
    budgetAllowableExpenditure: ({ rowIndex }) => {
      return (
        <Field
          component={TextField}
          name={`budgetsFunds.${rowIndex}.budgetAllowableExpenditure`}
          type="number"
          required
          placeholder="0.00"
        />
      );
    },
    transactionDescription: ({ rowIndex }) => {
      return (
        <Field
          component={TextField}
          name={`budgetsFunds.${rowIndex}.transactionDescription`}
          type="text"
          required
          placeholder="Description"
        />
      );
    },
    fundTags: ({ rowIndex }) => {
      return (
        <FieldTags name={`budgetsFunds.${rowIndex}.fundTags.tagList`} />
      );
    },
  };
};
