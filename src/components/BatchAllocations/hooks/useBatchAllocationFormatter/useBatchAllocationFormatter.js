import get from 'lodash/get';
import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Icon,
  MultiSelection,
  NoValue,
  Row,
  Select,
  TextField,
  Tooltip,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FieldTags,
  filterArrayValues,
} from '@folio/stripes-acq-components';
import {
  Field,
  useFormEngine,
} from '@folio/stripes-acq-components/experimental';

import { composeValidators } from '../../../../common/utils';
import { FUND_STATUSES_OPTIONS } from '../../../../Funds/constants';
import { BUDGET_STATUSES_OPTIONS } from '../../../Budget/constants';
import { getFormattedOptions } from '../../BatchAllocationsForm/utils';
import {
  BATCH_ALLOCATION_FIELDS,
  BATCH_ALLOCATION_FORM_SPECIAL_FIELDS,
} from '../../constants';
import { parseNumberOrInitial } from '../../utils';
import {
  validateAllocationAfterField,
  validateNotNegative,
  validateNumericValue,
} from './validators';

import css from './styles.css';

const {
  calculatedFinanceData: CALCULATED_FINANCE_DATA,
  fyFinanceData: FINANCE_DATA,
  index: INDEX,
  _isMissed: IS_MISSED,
} = BATCH_ALLOCATION_FORM_SPECIAL_FIELDS;

const checkIfUnchanged = ({ isBudgetChanged, isFundChanged } = {}) => {
  return (isBudgetChanged !== undefined && isFundChanged !== undefined) && !(isFundChanged || isBudgetChanged);
};

const itemToString = (item) => item;

const renderTag = ({ filterValue, exactMatch }) => {
  if (exactMatch || !filterValue) {
    return null;
  } else {
    return (
      <FormattedMessage
        id="stripes-acq-components.addTagFor"
        values={{ filterValue }}
      />
    );
  }
};

const onBlurDefault = e => { e.preventDefault(); };

const FieldTagsComponent = ({
  allTags,
  engine,
  fullWidth,
  labelless = false,
  marginBottom0,
  name,
  onAdd,
  ...props
}) => {
  const addTag = useCallback(({ inputValue }) => {
    const formValues = engine.getFormState()?.values;
    const tag = inputValue.replace(/\s|\|/g, '').toLowerCase();
    const updatedTags = get(formValues, name, []).concat(tag).filter(Boolean);

    if (tag) {
      engine.set(name, updatedTags);
      onAdd(tag);
    }
  }, [engine, name, onAdd]);

  const addAction = useMemo(() => ({ onSelect: addTag, render: renderTag }), [addTag]);
  const actions = useMemo(() => [addAction], [addAction]);

  const dataOptions = useMemo(() => allTags.map(tag => tag.label.toLowerCase()).sort(), [allTags]);

  const formatter = useCallback(({ option }) => {
    const item = allTags.filter(tag => tag.label.toLowerCase() === option)[0];

    if (!item) return option;

    return item.label;
  }, [allTags]);

  return (
    <Field
      actions={actions}
      component={MultiSelection}
      dataOptions={dataOptions}
      emptyMessage=" "
      filter={filterArrayValues}
      formatter={formatter}
      fullWidth={fullWidth}
      itemToString={itemToString}
      label={!labelless && <FormattedMessage id="stripes-acq-components.label.tags" />}
      marginBottom0={marginBottom0}
      name={name}
      onBlur={onBlurDefault}
      {...props}
    />
  );
};

export const useBatchAllocationFormatter = (intl, fiscalYear, isLoading) => {
  const engine = useFormEngine();

  const fundStatusOptions = useMemo(() => getFormattedOptions(intl, FUND_STATUSES_OPTIONS), [intl]);
  const budgetStatusOptions = useMemo(() => getFormattedOptions(intl, BUDGET_STATUSES_OPTIONS), [intl]);

  const formatter = useMemo(() => {
    const { values } = engine.getFormState();

    return ({
      [BATCH_ALLOCATION_FIELDS.fundName]: (field) => {
        const item = get(values, field.name);

        const isIconVisible = (
          (item[IS_MISSED] || Boolean(values[CALCULATED_FINANCE_DATA]))
          && checkIfUnchanged(values[CALCULATED_FINANCE_DATA]?.[field[INDEX]])
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
      [BATCH_ALLOCATION_FIELDS.fundStatus]: (field) => {
        return (
          <Field
            aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.fundStatus.toLocaleLowerCase()}`}
            component={Select}
            dataOptions={fundStatusOptions}
            disabled={isLoading}
            fullWidth
            marginBottom0
            name={`${FINANCE_DATA}.${field[INDEX]}.${BATCH_ALLOCATION_FIELDS.fundStatus}`}
          />
        );
      },
      [BATCH_ALLOCATION_FIELDS.budgetName]: (field) => {
        const item = get(values, field.name);

        return item[BATCH_ALLOCATION_FIELDS.budgetName] || <NoValue />;
      },
      [BATCH_ALLOCATION_FIELDS.budgetCurrentAllocation]: (field) => {
        const item = get(values, field.name);

        return (
          <AmountWithCurrencyField
            amount={item[BATCH_ALLOCATION_FIELDS.budgetCurrentAllocation]}
            currency={fiscalYear?.currency}
            showBrackets={item[BATCH_ALLOCATION_FIELDS.budgetCurrentAllocation] < 0}
          />
        );
      },
      [BATCH_ALLOCATION_FIELDS.budgetStatus]: (field) => {
        return (
          <Field
            aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.budgetStatus.toLocaleLowerCase()}`}
            component={Select}
            dataOptions={budgetStatusOptions}
            disabled={isLoading}
            fullWidth
            marginBottom0
            name={`${FINANCE_DATA}.${field[INDEX]}.${BATCH_ALLOCATION_FIELDS.budgetStatus}`}
          />
        );
      },
      [BATCH_ALLOCATION_FIELDS.budgetAllocationChange]: (field) => {
        return (
          <Field
            aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.budgetAllocationChange.toLocaleLowerCase()}`}
            component={TextField}
            disabled={isLoading}
            fullWidth
            marginBottom0
            name={`${FINANCE_DATA}.${field[INDEX]}.${BATCH_ALLOCATION_FIELDS.budgetAllocationChange}`}
            parse={parseNumberOrInitial}
            type="number"
            validate={composeValidators(
              validateNumericValue(intl),
            )}
          />
        );
      },
      [BATCH_ALLOCATION_FIELDS.budgetAfterAllocation]: (field) => {
        return (
          <Field
            aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.budgetAfterAllocation.toLocaleLowerCase()}`}
            component={TextField}
            disabled
            fullWidth
            marginBottom0
            name={`${CALCULATED_FINANCE_DATA}.${field[INDEX]}.${BATCH_ALLOCATION_FIELDS.budgetAfterAllocation}`}
            type="number"
            validate={validateAllocationAfterField(intl, field[INDEX])}
          />
        );
      },
      [BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance]: (field) => {
        return (
          <Field
            aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance.toLocaleLowerCase()}`}
            component={TextField}
            disabled={isLoading}
            fullWidth
            marginBottom0
            name={`${FINANCE_DATA}.${field[INDEX]}.${BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance}`}
            parse={parseNumberOrInitial}
            type="number"
            validate={composeValidators(
              validateNumericValue(intl),
              validateNotNegative(intl),
            )}
          />
        );
      },
      [BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure]: (field) => {
        return (
          <Field
            aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure.toLocaleLowerCase()}`}
            component={TextField}
            disabled={isLoading}
            fullWidth
            marginBottom0
            name={`${FINANCE_DATA}.${field[INDEX]}.${BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure}`}
            parse={parseNumberOrInitial}
            type="number"
            validate={composeValidators(
              validateNumericValue(intl),
              validateNotNegative(intl),
            )}
          />
        );
      },
      [BATCH_ALLOCATION_FIELDS.transactionDescription]: (field) => {
        return (
          <Field
            aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.transactionDescription.toLocaleLowerCase()}`}
            component={TextField}
            disabled={isLoading}
            fullWidth
            marginBottom0
            name={`${FINANCE_DATA}.${field[INDEX]}.${BATCH_ALLOCATION_FIELDS.transactionDescription}`}
            placeholder="Description"
            type="text"
          />
        );
      },
      [BATCH_ALLOCATION_FIELDS.transactionTag]: (field) => {
        return 123;
        // return (
        //   <div className={css.tagsField}>
        //     <FieldTags
        //       aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.transactionTag.toLocaleLowerCase()}`}
        //       engine={engine}
        //       component={FieldTagsComponent}
        //       disabled={isLoading}
        //       fullWidth
        //       labelless
        //       marginBottom0
        //       name={`${FINANCE_DATA}.${field[INDEX]}.${BATCH_ALLOCATION_FIELDS.transactionTag}.tagList`}
        //     />
        //   </div>
        // );
      },
    });
  }, [
    budgetStatusOptions,
    engine,
    fiscalYear?.currency,
    fundStatusOptions,
    intl,
    isLoading,
  ]);

  return formatter;
};
