import { useMemo } from 'react';

import { TextField } from '@folio/stripes/components';
import {
  FieldSelectFinal,
  FieldTags,
} from '@folio/stripes-acq-components';
import { Field } from 'react-final-form';

import { getFormattedOptions } from '../BatchAllocationsForm/utils';
import {
  BARCH_ALLOCATION_STATUS_OPTIONS,
  BATCH_ALLOCATION_FIELDS,
} from '../constants';
import { BUDGET_STATUSES_OPTIONS } from '../../Budget/constants';
import css from '../BatchAllocation.css';

export const useBatchAllocationColumnValues = (intl) => {
  const fundStatusOptions = useMemo(() => getFormattedOptions(intl, BARCH_ALLOCATION_STATUS_OPTIONS), [intl]);
  const budgetStatusOptions = useMemo(() => getFormattedOptions(intl, BUDGET_STATUSES_OPTIONS), [intl]);

  return {
    fundStatus: ({ rowIndex }) => {
      return (
        <div className={css.select}>
          <FieldSelectFinal
            dataOptions={fundStatusOptions}
            fullWidth
            name={`budgetsFunds.${rowIndex}.${BATCH_ALLOCATION_FIELDS.fundStatus}`}
          />
        </div>
      );
    },
    budgetStatus: ({ rowIndex }) => {
      return (
        <div className={css.select}>
          <FieldSelectFinal
            dataOptions={budgetStatusOptions}
            fullWidth
            name={`budgetsFunds.${rowIndex}.${BATCH_ALLOCATION_FIELDS.budgetStatus}`}
          />
        </div>
      );
    },
    allocationIncreaseDecrease: ({ rowIndex }) => {
      return (
        <div className={css.field}>
          <Field
            component={TextField}
            name={`budgetsFunds.${rowIndex}.${BATCH_ALLOCATION_FIELDS.allocationIncreaseDecrease}`}
            type="number"
            required
            placeholder="0.00"
          />
        </div>
      );
    },
    totalAllocatedAfter: ({ rowIndex }) => {
      return (
        <div className={css.field}>
          <Field
            component={TextField}
            name={`budgetsFunds.${rowIndex}.${BATCH_ALLOCATION_FIELDS.totalAllocatedAfter}`}
            type="number"
            required
            placeholder="0.00"
            disabled
          />
        </div>
      );
    },
    budgetAllowableEncumbrance: ({ rowIndex }) => {
      return (
        <div className={css.field}>
          <Field
            component={TextField}
            name={`budgetsFunds.${rowIndex}.${BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance}`}
            type="number"
            required
            placeholder="0.00"
          />
        </div>
      );
    },
    budgetAllowableExpenditure: ({ rowIndex }) => {
      return (
        <div className={css.field}>
          <Field
            component={TextField}
            name={`budgetsFunds.${rowIndex}.${BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure}`}
            type="number"
            required
            placeholder="0.00"
          />
        </div>
      );
    },
    transactionDescription: ({ rowIndex }) => {
      return (
        <div className={css.field}>
          <Field
            component={TextField}
            name={`budgetsFunds.${rowIndex}.${BATCH_ALLOCATION_FIELDS.transactionDescription}`}
            type="text"
            required
            placeholder="Description"
          />
        </div>
      );
    },
    fundTags: ({ rowIndex }) => {
      return (
        <div className={css.tags}>
          <FieldTags
            labelless
            name={`budgetsFunds.${rowIndex}.fundTags.tagList`}
          />
        </div>
      );
    },
  };
};
