import identity from 'lodash/identity';
import { useMemo } from 'react';
import {
  Field,
  useForm,
} from 'react-final-form';

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
  validateRequiredNotNegative,
} from '@folio/stripes-acq-components';

import { composeValidators } from '../../../../common/utils';
import { FUND_STATUSES_OPTIONS } from '../../../../Funds/constants';
import { BUDGET_STATUSES_OPTIONS } from '../../../Budget/constants';
import { getFormattedOptions } from '../../BatchAllocationsForm/utils';
import {
  BATCH_ALLOCATION_FIELDS,
  BATCH_ALLOCATION_FORM_SPECIAL_FIELDS,
} from '../../constants';
import {
  validateAllocationAfterField,
  validateBudgetStatus,
  validateFundStatus,
  validateNumericValue,
} from './validators';

import css from './styles.css';

const {
  calculatedFinanceData: CALCULATED_FINANCE_DATA,
  fyFinanceData: FINANCE_DATA,
  rowIndex: ROW_INDEX,
  _isMissed: IS_MISSED,
} = BATCH_ALLOCATION_FORM_SPECIAL_FIELDS;

const checkIfUnchanged = ({ isBudgetChanged, isFundChanged }) => {
  return (isBudgetChanged !== undefined && isFundChanged !== undefined) && !(isFundChanged || isBudgetChanged);
};

export const useBatchAllocationFormatter = (intl, fiscalYear) => {
  const form = useForm();

  const fundStatusOptions = useMemo(() => getFormattedOptions(intl, FUND_STATUSES_OPTIONS), [intl]);
  const budgetStatusOptions = useMemo(() => getFormattedOptions(intl, BUDGET_STATUSES_OPTIONS), [intl]);

  const formatter = useMemo(() => ({
    [BATCH_ALLOCATION_FIELDS.fundName]: (item) => {
      const { values } = form.getState();
      const isIconVisible = (
        (item[IS_MISSED] || Boolean(values[CALCULATED_FINANCE_DATA]))
        && checkIfUnchanged(values[CALCULATED_FINANCE_DATA][item[ROW_INDEX]])
      );

      return (
        <Row>
          <Col xs>{item.fundName}</Col>
          {isIconVisible && (
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
          fullWidth
          marginBottom0
          name={`${FINANCE_DATA}.${item[ROW_INDEX]}.${BATCH_ALLOCATION_FIELDS.fundStatus}`}
          validate={validateFundStatus(intl)}
          validateFields={[]}
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
          currency={fiscalYear?.currency}
          showBrackets={item[BATCH_ALLOCATION_FIELDS.budgetCurrentAllocation] < 0}
        />
      );
    },
    [BATCH_ALLOCATION_FIELDS.budgetStatus]: (item) => {
      return (
        <FieldSelectFinal
          aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.budgetStatus.toLocaleLowerCase()}`}
          dataOptions={budgetStatusOptions}
          fullWidth
          marginBottom0
          name={`${FINANCE_DATA}.${item[ROW_INDEX]}.${BATCH_ALLOCATION_FIELDS.budgetStatus}`}
          validate={validateBudgetStatus(intl)}
          validateFields={[]}
        />
      );
    },
    [BATCH_ALLOCATION_FIELDS.budgetAllocationChange]: (item) => {
      return (
        <Field
          aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.budgetAllocationChange.toLocaleLowerCase()}`}
          fullWidth
          component={TextField}
          marginBottom0
          name={`${FINANCE_DATA}.${item[ROW_INDEX]}.${BATCH_ALLOCATION_FIELDS.budgetAllocationChange}`}
          required
          type="number"
          validate={validateNumericValue(intl)}
          validateFields={[]}
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
          name={`${CALCULATED_FINANCE_DATA}.${item[ROW_INDEX]}.${BATCH_ALLOCATION_FIELDS.budgetAfterAllocation}`}
          required
          validate={validateAllocationAfterField(intl, item[ROW_INDEX])}
          validateFields={[]}
        />
      );
    },
    [BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance]: (item) => {
      return (
        <Field
          aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance.toLocaleLowerCase()}`}
          component={TextField}
          fullWidth
          marginBottom0
          name={`${FINANCE_DATA}.${item[ROW_INDEX]}.${BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance}`}
          required
          type="number"
          validate={composeValidators(validateNumericValue(intl), validateRequiredNotNegative)}
          validateFields={[]}
        />
      );
    },
    [BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure]: (item) => {
      return (
        <Field
          aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure.toLocaleLowerCase()}`}
          component={TextField}
          fullWidth
          marginBottom0
          name={`${FINANCE_DATA}.${item[ROW_INDEX]}.${BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure}`}
          required
          type="number"
          validate={composeValidators(validateNumericValue(intl), validateRequiredNotNegative)}
          validateFields={[]}
        />
      );
    },
    [BATCH_ALLOCATION_FIELDS.transactionDescription]: (item) => {
      return (
        <Field
          aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.transactionDescription.toLocaleLowerCase()}`}
          component={TextField}
          fullWidth
          marginBottom0
          name={`${FINANCE_DATA}.${item[ROW_INDEX]}.${BATCH_ALLOCATION_FIELDS.transactionDescription}`}
          parse={identity}
          placeholder="Description"
          type="text"
          validateFields={[]}
        />
      );
    },
    [BATCH_ALLOCATION_FIELDS.transactionTag]: (item) => {
      return (
        <div className={css.tagsField}>
          <FieldTags
            aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.transactionTag.toLocaleLowerCase()}`}
            formValues={form.getState().values}
            fullWidth
            labelless
            marginBottom0
            name={`${FINANCE_DATA}.${item[ROW_INDEX]}.transactionTag.tagList`}
          />
        </div>
      );
    },
  }), [form, intl, fundStatusOptions, fiscalYear?.currency, budgetStatusOptions]);

  return formatter;
};
