import { useMemo } from 'react';
import { Field } from 'react-final-form';

import { TextField } from '@folio/stripes/components';
import {
  FieldSelectFinal,
  FieldTags,
} from '@folio/stripes-acq-components';

import { FUND_STATUSES_OPTIONS } from '../../../../Funds/constants';
import { BUDGET_STATUSES_OPTIONS } from '../../../Budget/constants';
import { getFormattedOptions } from '../../BatchAllocationsForm/utils';
import { BATCH_ALLOCATION_FIELDS } from '../../constants';

export const useBatchAllocationFormatter = (intl) => {
  const fundStatusOptions = useMemo(() => getFormattedOptions(intl, FUND_STATUSES_OPTIONS), [intl]);
  const budgetStatusOptions = useMemo(() => getFormattedOptions(intl, BUDGET_STATUSES_OPTIONS), [intl]);

  return {
    fundStatus: ({ rowIndex }) => {
      return (
        <FieldSelectFinal
          aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.fundStatus.toLocaleLowerCase()}`}
          dataOptions={fundStatusOptions}
          fullWidth
          marginBottom0
          name={`budgetsFunds.${rowIndex}.${BATCH_ALLOCATION_FIELDS.fundStatus}`}
        />
      );
    },
    budgetStatus: ({ rowIndex }) => {
      return (
        <FieldSelectFinal
          aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.budgetStatus.toLocaleLowerCase()}`}
          dataOptions={budgetStatusOptions}
          fullWidth
          marginBottom0
          name={`budgetsFunds.${rowIndex}.${BATCH_ALLOCATION_FIELDS.budgetStatus}`}
        />
      );
    },
    allocationIncreaseDecrease: ({ rowIndex }) => {
      return (
        <Field
          aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.allocationIncreaseDecrease.toLocaleLowerCase()}`}
          fullWidth
          marginBottom0
          component={TextField}
          name={`budgetsFunds.${rowIndex}.${BATCH_ALLOCATION_FIELDS.allocationIncreaseDecrease}`}
          type="number"
          required
          placeholder="0.00"
        />
      );
    },
    totalAllocatedAfter: ({ rowIndex }) => {
      return (
        <Field
          aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.totalAllocatedAfter.toLocaleLowerCase()}`}
          fullWidth
          marginBottom0
          component={TextField}
          name={`budgetsFunds.${rowIndex}.${BATCH_ALLOCATION_FIELDS.totalAllocatedAfter}`}
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
          aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance.toLocaleLowerCase()}`}
          fullWidth
          marginBottom0
          component={TextField}
          name={`budgetsFunds.${rowIndex}.${BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance}`}
          type="number"
          required
          placeholder="0.00"
        />
      );
    },
    budgetAllowableExpenditure: ({ rowIndex }) => {
      return (
        <Field
          aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure.toLocaleLowerCase()}`}
          fullWidth
          marginBottom0
          component={TextField}
          name={`budgetsFunds.${rowIndex}.${BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure}`}
          type="number"
          required
          placeholder="0.00"
        />
      );
    },
    transactionDescription: ({ rowIndex }) => {
      return (
        <Field
          aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.transactionDescription.toLocaleLowerCase()}`}
          fullWidth
          marginBottom0
          component={TextField}
          name={`budgetsFunds.${rowIndex}.${BATCH_ALLOCATION_FIELDS.transactionDescription}`}
          type="text"
          required
          placeholder="Description"
        />
      );
    },
    fundTags: ({ rowIndex }) => {
      return (
        <FieldTags
          aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.fundTags.toLocaleLowerCase()}`}
          fullWidth
          labelless
          marginBottom0
          name={`budgetsFunds.${rowIndex}.fundTags.tagList`}
        />
      );
    },
  };
};
