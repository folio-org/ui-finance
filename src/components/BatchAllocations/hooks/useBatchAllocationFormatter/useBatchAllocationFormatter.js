import { useMemo } from 'react';
import { Field } from 'react-final-form';

import {
  Col,
  Icon,
  Row,
  TextField,
  Tooltip,
} from '@folio/stripes/components';
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
    [BATCH_ALLOCATION_FIELDS.fundName]: (item) => {
      return (
        <Row>
          <Col xs>{item.fundName}</Col>
          {item._isMissed && (
            <Tooltip
              text={intl.formatMessage({ id: 'ui-finance.allocation.batch.form.validation.error.missedFund' })}
              id="fund-missed-tooltip"
            >
              {({ ref, ariaIds }) => (
                <Icon
                  ref={ref}
                  aria-labelledby={ariaIds.text}
                  icon="exclamation-circle"
                  status="error"
                />
              )}
            </Tooltip>
          )}
        </Row>
      );
    },
    [BATCH_ALLOCATION_FIELDS.fundStatus]: (item) => {
      return (
        <FieldSelectFinal
          aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.fundStatus.toLocaleLowerCase()}`}
          dataOptions={fundStatusOptions}
          disabled={item._isMissed}
          fullWidth
          marginBottom0
          name={`budgetsFunds.${item.rowIndex}.${BATCH_ALLOCATION_FIELDS.fundStatus}`}
        />
      );
    },
    [BATCH_ALLOCATION_FIELDS.budgetStatus]: (item) => {
      return (
        <FieldSelectFinal
          aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.budgetStatus.toLocaleLowerCase()}`}
          dataOptions={budgetStatusOptions}
          disabled={item._isMissed}
          fullWidth
          marginBottom0
          name={`budgetsFunds.${item.rowIndex}.${BATCH_ALLOCATION_FIELDS.budgetStatus}`}
        />
      );
    },
    [BATCH_ALLOCATION_FIELDS.budgetAllocationChange]: (item) => {
      return (
        <Field
          aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.budgetAllocationChange.toLocaleLowerCase()}`}
          fullWidth
          component={TextField}
          disabled={item._isMissed}
          marginBottom0
          name={`budgetsFunds.${item.rowIndex}.${BATCH_ALLOCATION_FIELDS.budgetAllocationChange}`}
          placeholder="0.00"
          required
          type="number"
        />
      );
    },
    [BATCH_ALLOCATION_FIELDS.totalAllocatedAfter]: (item) => {
      return (
        <Field
          aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.totalAllocatedAfter.toLocaleLowerCase()}`}
          component={TextField}
          disabled
          fullWidth
          marginBottom0
          name={`budgetsFunds.${item.rowIndex}.${BATCH_ALLOCATION_FIELDS.totalAllocatedAfter}`}
          required
        />
      );
    },
    [BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance]: (item) => {
      return (
        <Field
          aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance.toLocaleLowerCase()}`}
          component={TextField}
          disabled={item._isMissed}
          fullWidth
          marginBottom0
          name={`budgetsFunds.${item.rowIndex}.${BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance}`}
          placeholder="0.00"
          required
          type="number"
        />
      );
    },
    [BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure]: (item) => {
      return (
        <Field
          aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure.toLocaleLowerCase()}`}
          component={TextField}
          disabled={item._isMissed}
          fullWidth
          marginBottom0
          name={`budgetsFunds.${item.rowIndex}.${BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure}`}
          placeholder="0.00"
          required
          type="number"
        />
      );
    },
    [BATCH_ALLOCATION_FIELDS.transactionDescription]: (item) => {
      return (
        <Field
          aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.transactionDescription.toLocaleLowerCase()}`}
          component={TextField}
          disabled={item._isMissed}
          fullWidth
          marginBottom0
          name={`budgetsFunds.${item.rowIndex}.${BATCH_ALLOCATION_FIELDS.transactionDescription}`}
          placeholder="Description"
          required
          type="text"
        />
      );
    },
    [BATCH_ALLOCATION_FIELDS.transactionTag]: (item) => {
      return (
        <FieldTags
          aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.transactionTag.toLocaleLowerCase()}`}
          disabled={item._isMissed}
          fullWidth
          labelless
          marginBottom0
          name={`budgetsFunds.${item.rowIndex}.transactionTag.tagList`}
        />
      );
    },
  };
};
