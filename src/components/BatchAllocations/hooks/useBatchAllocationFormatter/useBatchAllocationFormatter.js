import { useMemo } from 'react';
import { Field } from 'react-final-form';

import {
  Col,
  Icon,
  NoValue,
  Row,
  TextField,
  Tooltip,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FieldSelectFinal,
  FieldTags,
} from '@folio/stripes-acq-components';

import { FUND_STATUSES_OPTIONS } from '../../../../Funds/constants';
import { BUDGET_STATUSES_OPTIONS } from '../../../Budget/constants';
import { BATCH_ALLOCATION_FIELDS } from '../../constants';
import { getFormattedOptions } from '../../BatchAllocationsForm/utils';
import {
  validateAllocationAfterField,
  validateBudgetStatus,
  validateFundStatus,
  validateNumericValue,
} from './validators';

export const useBatchAllocationFormatter = (intl, fiscalYear) => {
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
          name={`fyFinanceData.${item.rowIndex}.${BATCH_ALLOCATION_FIELDS.fundStatus}`}
          validate={validateFundStatus(intl)}
        />
      );
    },
    [BATCH_ALLOCATION_FIELDS.budgetName]: (item) => {
      return item[BATCH_ALLOCATION_FIELDS.budgetName] || <NoValue />;
    },
    [BATCH_ALLOCATION_FIELDS.budgetCurrentAllocation]: (item) => {
      return (
        <AmountWithCurrencyField
          amount={item[BATCH_ALLOCATION_FIELDS.budgetCurrentAllocation]}
          currency={fiscalYear.currency}
          showBrackets={item[BATCH_ALLOCATION_FIELDS.budgetCurrentAllocation] < 0}
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
          name={`fyFinanceData.${item.rowIndex}.${BATCH_ALLOCATION_FIELDS.budgetStatus}`}
          validate={validateBudgetStatus(intl)}
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
          name={`fyFinanceData.${item.rowIndex}.${BATCH_ALLOCATION_FIELDS.budgetAllocationChange}`}
          parse={Number}
          placeholder="0.00"
          required
          type="number"
          validate={validateNumericValue(intl)}
        />
      );
    },
    [BATCH_ALLOCATION_FIELDS.budgetAfterAllocation]: (item) => {
      return (
        <Field
          aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.budgetAfterAllocation.toLocaleLowerCase()}`}
          component={TextField}
          disabled
          fullWidth
          marginBottom0
          name={`calculatedFinanceData.${item.rowIndex}.${BATCH_ALLOCATION_FIELDS.budgetAfterAllocation}`}
          parse={Number}
          required
          validate={validateAllocationAfterField(intl, item.rowIndex)}
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
          name={`fyFinanceData.${item.rowIndex}.${BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance}`}
          placeholder="0.00"
          required
          type="number"
          validate={validateNumericValue(intl)}
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
          name={`fyFinanceData.${item.rowIndex}.${BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure}`}
          placeholder="0.00"
          required
          type="number"
          validate={validateNumericValue(intl)}
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
          name={`fyFinanceData.${item.rowIndex}.${BATCH_ALLOCATION_FIELDS.transactionDescription}`}
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
          name={`fyFinanceData.${item.rowIndex}.transactionTag.tagList`}
        />
      );
    },
  };
};
