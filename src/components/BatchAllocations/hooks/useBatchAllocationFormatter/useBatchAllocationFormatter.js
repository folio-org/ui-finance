import PropTypes from 'prop-types';
import {
  memo,
  useCallback,
  useMemo,
} from 'react';

import {
  Col,
  Icon,
  Loading,
  NoValue,
  Row,
  Select,
  TextField,
  Tooltip,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  useTags,
  useTagsConfigs,
  useTagsMutation,
} from '@folio/stripes-acq-components';
import {
  Field,
  useFormEngine,
  useWatch,
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
import { BatchAllocationFieldTags } from './BatchAllocationFieldTags';
import {
  validateAllocationAfterField,
  validateNotNegative,
  validateNumericValue,
} from './validators';

const {
  calculatedFinanceData: CALCULATED_FINANCE_DATA,
  fyFinanceData: FINANCE_DATA,
  index: INDEX,
  _isMissed: IS_MISSED,
} = BATCH_ALLOCATION_FORM_SPECIAL_FIELDS;

const checkIfUnchanged = ({ isBudgetChanged, isFundChanged } = {}) => {
  return (isBudgetChanged !== undefined && isFundChanged !== undefined) && !(isFundChanged || isBudgetChanged);
};

const FundStatusCell = memo(({ options, isLoading, name }) => (
  <Field
    aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.fundStatus.toLocaleLowerCase()}`}
    component={Select}
    dataOptions={options}
    disabled={isLoading}
    fullWidth
    marginBottom0
    name={name}
  />
));

FundStatusCell.displayName = 'FundStatusCell';
FundStatusCell.propTypes = {
  isLoading: PropTypes.bool,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const BudgetStatusCell = memo(({ options, isLoading, name }) => (
  <Field
    aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.budgetStatus.toLocaleLowerCase()}`}
    component={Select}
    dataOptions={options}
    disabled={isLoading}
    fullWidth
    marginBottom0
    name={name}
  />
));

BudgetStatusCell.displayName = 'BudgetStatusCell';
BudgetStatusCell.propTypes = {
  isLoading: PropTypes.bool,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const BudgetAllocationChangeCell = memo(({ isLoading, intl, name }) => (
  <Field
    aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.budgetAllocationChange.toLocaleLowerCase()}`}
    component={TextField}
    disabled={isLoading}
    fullWidth
    marginBottom0
    name={name}
    parse={parseNumberOrInitial}
    type="number"
    validate={composeValidators(
      validateNumericValue(intl),
    )}
  />
));

BudgetAllocationChangeCell.displayName = 'BudgetAllocationChangeCell';
BudgetAllocationChangeCell.propTypes = {
  intl: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  name: PropTypes.string.isRequired,
};

const BudgetAfterAllocationCell = memo(({ intl, calculatedName, index }) => (
  <Field
    aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.budgetAfterAllocation.toLocaleLowerCase()}`}
    component={TextField}
    disabled
    fullWidth
    marginBottom0
    name={calculatedName}
    type="number"
    validate={validateAllocationAfterField(intl, index)}
  />
));

BudgetAfterAllocationCell.displayName = 'BudgetAfterAllocationCell';
BudgetAfterAllocationCell.propTypes = {
  calculatedName: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  intl: PropTypes.object.isRequired,
};

const BudgetAllowableEncumbranceCell = memo(({ isLoading, intl, name }) => (
  <Field
    aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance.toLocaleLowerCase()}`}
    component={TextField}
    disabled={isLoading}
    fullWidth
    marginBottom0
    name={name}
    parse={parseNumberOrInitial}
    type="number"
    validate={composeValidators(
      validateNumericValue(intl),
      validateNotNegative(intl),
    )}
  />
));

BudgetAllowableEncumbranceCell.displayName = 'BudgetAllowableEncumbranceCell';
BudgetAllowableEncumbranceCell.propTypes = {
  intl: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  name: PropTypes.string.isRequired,
};

const BudgetAllowableExpenditureCell = memo(({ isLoading, intl, name }) => (
  <Field
    aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure.toLocaleLowerCase()}`}
    component={TextField}
    disabled={isLoading}
    fullWidth
    marginBottom0
    name={name}
    parse={parseNumberOrInitial}
    type="number"
    validate={composeValidators(
      validateNumericValue(intl),
      validateNotNegative(intl),
    )}
  />
));

BudgetAllowableExpenditureCell.displayName = 'BudgetAllowableExpenditureCell';
BudgetAllowableExpenditureCell.propTypes = {
  intl: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  name: PropTypes.string.isRequired,
};

const TransactionDescriptionCell = memo(({ isLoading, name }) => (
  <Field
    aria-labelledby={`list-column-${BATCH_ALLOCATION_FIELDS.transactionDescription.toLocaleLowerCase()}`}
    component={TextField}
    disabled={isLoading}
    fullWidth
    marginBottom0
    name={name}
    placeholder="Description"
    type="text"
  />
));

TransactionDescriptionCell.displayName = 'TransactionDescriptionCell';
TransactionDescriptionCell.propTypes = {
  isLoading: PropTypes.bool,
  name: PropTypes.string.isRequired,
};

const FundNameCell = memo(({ fieldName, intl, calculatedFinanceData, index }) => {
  const itemValue = useWatch(fieldName);
  const calculatedItem = calculatedFinanceData?.[index];

  const isIconVisible = (
    (itemValue?.[IS_MISSED] || Boolean(calculatedFinanceData))
    && checkIfUnchanged(calculatedItem)
  );

  return (
    <Row>
      <Col xs>{itemValue?.fundName}</Col>
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
});

FundNameCell.displayName = 'FundNameCell';
FundNameCell.propTypes = {
  calculatedFinanceData: PropTypes.arrayOf(PropTypes.object),
  fieldName: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  intl: PropTypes.object.isRequired,
};

export const useBatchAllocationFormatter = (intl, fiscalYear, isLoading) => {
  const engine = useFormEngine();

  const calculatedFinanceData = useWatch(CALCULATED_FINANCE_DATA);

  const fundStatusOptions = useMemo(() => getFormattedOptions(intl, FUND_STATUSES_OPTIONS), [intl]);
  const budgetStatusOptions = useMemo(() => getFormattedOptions(intl, BUDGET_STATUSES_OPTIONS), [intl]);

  const {
    createTag,
    isLoading: isMutating,
  } = useTagsMutation();

  const {
    configs,
    isFetched,
    isFetching: isTagsConfigFetching,
  } = useTagsConfigs();

  const tagsEnabled = isFetched && (!configs.length || configs[0].value === 'true');

  const {
    isFetching: isTagsFetching,
    refetch,
    tags: allTags,
  } = useTags({ enabled: tagsEnabled });

  const onAdd = useCallback(async (tag) => {
    await createTag({
      data: {
        label: tag,
        description: tag,
      },
    });
    refetch();
  }, [createTag, refetch]);

  const formatter = useMemo(() => {
    return ({
      [BATCH_ALLOCATION_FIELDS.fundName]: (field) => {
        return (
          <FundNameCell
            fieldName={field.name}
            intl={intl}
            calculatedFinanceData={calculatedFinanceData}
            index={field[INDEX]}
          />
        );
      },
      [BATCH_ALLOCATION_FIELDS.fundStatus]: (field) => {
        return (
          <FundStatusCell
            options={fundStatusOptions}
            isLoading={isLoading}
            name={`${FINANCE_DATA}[${field[INDEX]}].${BATCH_ALLOCATION_FIELDS.fundStatus}`}
          />
        );
      },
      [BATCH_ALLOCATION_FIELDS.budgetName]: (field) => {
        const itemValue = engine.get(field.name);

        return itemValue?.[BATCH_ALLOCATION_FIELDS.budgetName] || <NoValue />;
      },
      [BATCH_ALLOCATION_FIELDS.budgetCurrentAllocation]: (field) => {
        const itemValue = engine.get(field.name);

        return (
          <AmountWithCurrencyField
            amount={itemValue?.[BATCH_ALLOCATION_FIELDS.budgetCurrentAllocation]}
            currency={fiscalYear?.currency}
            showBrackets={itemValue?.[BATCH_ALLOCATION_FIELDS.budgetCurrentAllocation] < 0}
          />
        );
      },
      [BATCH_ALLOCATION_FIELDS.budgetStatus]: (field) => {
        return (
          <BudgetStatusCell
            options={budgetStatusOptions}
            isLoading={isLoading}
            name={`${FINANCE_DATA}[${field[INDEX]}].${BATCH_ALLOCATION_FIELDS.budgetStatus}`}
          />
        );
      },
      [BATCH_ALLOCATION_FIELDS.budgetAllocationChange]: (field) => {
        return (
          <BudgetAllocationChangeCell
            isLoading={isLoading}
            intl={intl}
            name={`${FINANCE_DATA}[${field[INDEX]}].${BATCH_ALLOCATION_FIELDS.budgetAllocationChange}`}
          />
        );
      },
      [BATCH_ALLOCATION_FIELDS.budgetAfterAllocation]: (field) => {
        return (
          <BudgetAfterAllocationCell
            intl={intl}
            calculatedName={`${CALCULATED_FINANCE_DATA}[${field[INDEX]}].${BATCH_ALLOCATION_FIELDS.budgetAfterAllocation}`}
            index={field[INDEX]}
          />
        );
      },
      [BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance]: (field) => {
        return (
          <BudgetAllowableEncumbranceCell
            isLoading={isLoading}
            intl={intl}
            name={`${FINANCE_DATA}[${field[INDEX]}].${BATCH_ALLOCATION_FIELDS.budgetAllowableEncumbrance}`}
          />
        );
      },
      [BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure]: (field) => {
        return (
          <BudgetAllowableExpenditureCell
            isLoading={isLoading}
            intl={intl}
            name={`${FINANCE_DATA}[${field[INDEX]}].${BATCH_ALLOCATION_FIELDS.budgetAllowableExpenditure}`}
          />
        );
      },
      [BATCH_ALLOCATION_FIELDS.transactionDescription]: (field) => {
        return (
          <TransactionDescriptionCell
            isLoading={isLoading}
            name={`${FINANCE_DATA}[${field[INDEX]}].${BATCH_ALLOCATION_FIELDS.transactionDescription}`}
          />
        );
      },
      [BATCH_ALLOCATION_FIELDS.transactionTag]: (field) => {
        if (isTagsConfigFetching) return <Loading />;
        if (!tagsEnabled) return null;

        return (
          <BatchAllocationFieldTags
            allTags={allTags}
            disabled={isLoading}
            onAdd={onAdd}
            engine={engine}
            isLoading={isMutating || isTagsFetching}
            name={`${FINANCE_DATA}[${field[INDEX]}].${BATCH_ALLOCATION_FIELDS.transactionTag}.tagList`}
          />
        );
      },
    });
  }, [
    allTags,
    budgetStatusOptions,
    calculatedFinanceData,
    engine,
    fiscalYear?.currency,
    fundStatusOptions,
    intl,
    isMutating,
    isTagsConfigFetching,
    isTagsFetching,
    isLoading,
    onAdd,
    tagsEnabled,
  ]);

  return formatter;
};
