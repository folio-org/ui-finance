import { useMemo } from 'react';

import { TextField } from '@folio/stripes/components';
import { TagsForm } from '@folio/stripes/smart-components';
import { FieldSelectFinal } from '@folio/stripes-acq-components';
import { Field } from 'react-final-form';

import { getFormattedOptions } from '../BatchAllocationsForm/utils';
import { BARCH_ALLOCATION_STATUS_OPTIONS } from '../constants';
import { BUDGET_STATUSES_OPTIONS } from '../../Budget/constants';

export const useBatchAllocationColumnValues = (budgetsFunds, intl) => {
  const fundStatusOptions = useMemo(() => getFormattedOptions(intl, BARCH_ALLOCATION_STATUS_OPTIONS), [intl]);
  const budgetStatusOptions = useMemo(() => getFormattedOptions(intl, BUDGET_STATUSES_OPTIONS), [intl]);

  return budgetsFunds.map(({
    fundName,
    budgetName,
    budgetInitialAllocation,
  }, index) => ({
    fundName,
    fundStatus: <FieldSelectFinal
      dataOptions={fundStatusOptions}
      fullWidth
      name={`index-${index}.fundStatus`}
                />,
    budgetName,
    budgetInitialAllocation,
    budgetStatus: <FieldSelectFinal
      dataOptions={budgetStatusOptions}
      fullWidth
      name={`index-${index}.budgetStatus`}
                  />,
    allocationIncreaseDecrease:
  <Field
    component={TextField}
    name={`index-${index}.allocationIncreaseDecrease`}
    type="number"
    required
    placeholder="0.00"
  />,
    totalAllocatedAfter:
  <Field
    component={TextField}
    name={`index-${index}.totalAllocatedAfter`}
    type="number"
    required
    placeholder="0.00"
    disabled
  />,
    budgetAllowableEncumbrance:
  <Field
    component={TextField}
    name={`index-${index}.budgetAllowableEncumbrance`}
    type="number"
    required
    placeholder="0.00"
  />,
    budgetAllowableExpenditure:
  <Field
    component={TextField}
    name={`index-${index}.budgetAllowableExpenditure`}
    type="number"
    required
    placeholder="0.00"
  />,
    transactionDescription:
  <Field
    component={TextField}
    name={`index-${index}.transactionDescription`}
    type="text"
    required
    placeholder="Description"
  />,
    fundTags: "Tags"
  // <TagsForm
  //   onRemove={() => {}}
  //   onAdd={() => {}}
  //   entityTags={[]}
  //   name={`index-${index}.fundTags.tagList`}
  // />,
  }));
};
