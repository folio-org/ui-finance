import orderBy from 'lodash/orderBy';
import partition from 'lodash/partition';
import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  FormattedMessage,
  FormattedNumber,
  useIntl,
} from 'react-intl';

import {
  InfoPopover,
  MultiColumnList,
} from '@folio/stripes/components';
import {
  AcqEndOfList,
  AmountWithCurrencyField,
  ASC_DIRECTION,
  DESC_DIRECTION,
} from '@folio/stripes-acq-components';

import {
  EXPENSE_CLASS_FIELDS,
  UNASSIGNED_ID,
} from './constants';

const defaultVisibleColumns = [
  EXPENSE_CLASS_FIELDS.expenseClassName,
  EXPENSE_CLASS_FIELDS.encumbered,
  EXPENSE_CLASS_FIELDS.awaitingPayment,
  EXPENSE_CLASS_FIELDS.expended,
  EXPENSE_CLASS_FIELDS.percentageExpended,
  EXPENSE_CLASS_FIELDS.status,
];

const columnMapping = {
  [EXPENSE_CLASS_FIELDS.awaitingPayment]: <FormattedMessage id="ui-finance.budget.expenseClasses.awaitingPayment" />,
  [EXPENSE_CLASS_FIELDS.encumbered]: <FormattedMessage id="ui-finance.budget.expenseClasses.encumbered" />,
  [EXPENSE_CLASS_FIELDS.expended]: <FormattedMessage id="ui-finance.budget.expenseClasses.expended" />,
  [EXPENSE_CLASS_FIELDS.expenseClassName]: <FormattedMessage id="ui-finance.budget.expenseClasses.expenseClassName" />,
  [EXPENSE_CLASS_FIELDS.percentageExpended]: <FormattedMessage id="ui-finance.budget.expenseClasses.percentageExpended" />,
  [EXPENSE_CLASS_FIELDS.status]: <FormattedMessage id="ui-finance.budget.expenseClasses.status" />,
};

const getResultsFormatter = (currency, intl) => ({
  [EXPENSE_CLASS_FIELDS.expenseClassName]: expenseClass => {
    const isUnassigned = expenseClass.id === UNASSIGNED_ID;

    return (
      <span
        data-testid="nameColumn"
        style={isUnassigned ? { fontStyle: 'italic' } : {}}
      >
        {
          isUnassigned
            ? intl.formatMessage({ id: 'ui-finance.budget.expenseClasses.unassigned' })
            : expenseClass.expenseClassName
        }
        {isUnassigned && <InfoPopover content={intl.formatMessage({ id: 'ui-finance.budget.expenseClasses.unassigned.tooltip' })} />}
      </span>
    );
  },
  [EXPENSE_CLASS_FIELDS.encumbered]: expenseClass => (
    <AmountWithCurrencyField
      amount={expenseClass.encumbered}
      currency={currency}
      showBrackets={expenseClass.encumbered < 0}
    />
  ),
  [EXPENSE_CLASS_FIELDS.awaitingPayment]: expenseClass => (
    <AmountWithCurrencyField
      amount={expenseClass.awaitingPayment}
      currency={currency}
      showBrackets={expenseClass.awaitingPayment < 0}
    />
  ),
  [EXPENSE_CLASS_FIELDS.expended]: expenseClass => (
    <AmountWithCurrencyField
      amount={expenseClass.expended}
      currency={currency}
      showBrackets={expenseClass.expended < 0}
    />
  ),
  [EXPENSE_CLASS_FIELDS.percentageExpended]: expenseClass => (
    <FormattedNumber
      // "style" prop of <FormattedNumber> has type `"currency" | "unit" | "decimal" | "percent" | undefined`
      // eslint-disable-next-line react/style-prop-object
      style="percent"
      maximumFractionDigits={2}
      value={(expenseClass.percentageExpended ?? 0) / 100}
    />
  ),
  [EXPENSE_CLASS_FIELDS.status]: expenseClass => (
    <FormattedMessage
      id={`ui-finance.budget.expenseClasses.status.${expenseClass.expenseClassStatus}`}
      defaultMessage="-"
    />
  ),
});

const SORTERS = {
  [EXPENSE_CLASS_FIELDS.awaitingPayment]: ({ awaitingPayment }) => awaitingPayment,
  [EXPENSE_CLASS_FIELDS.encumbered]: ({ encumbered }) => encumbered,
  [EXPENSE_CLASS_FIELDS.expended]: ({ expended }) => expended,
  [EXPENSE_CLASS_FIELDS.expenseClassName]: ({ expenseClassName }) => expenseClassName?.toLocaleLowerCase(),
  [EXPENSE_CLASS_FIELDS.expenseClassStatus]: ({ expenseClassStatus }) => expenseClassStatus?.toLocaleLowerCase(),
  [EXPENSE_CLASS_FIELDS.percentageExpended]: ({ percentageExpended }) => percentageExpended,
};

const ExpenseClasses = ({
  currency,
  expenseClassesTotals,
  id,
  loading,
  visibleColumns,
}) => {
  const intl = useIntl();

  const [sortedColumn, setSortedColumn] = useState(EXPENSE_CLASS_FIELDS.expenseClassName);
  const [sortOrder, setSortOrder] = useState(ASC_DIRECTION);

  const resultsFormatter = useMemo(() => getResultsFormatter(currency, intl), [currency, intl]);

  const changeSorting = useCallback((event, { name }) => {
    if (!SORTERS[name]) return;
    if (sortedColumn !== name) {
      setSortedColumn(name);
      setSortOrder(DESC_DIRECTION);
    } else {
      setSortOrder(sortOrder === DESC_DIRECTION ? ASC_DIRECTION : DESC_DIRECTION);
    }
  }, [sortOrder, sortedColumn]);

  const sortedRecords = useMemo(() => {
    const [unassigned, assigned] = partition(expenseClassesTotals, (item) => item.id === UNASSIGNED_ID);

    const sorted = orderBy(
      assigned,
      SORTERS[sortedColumn],
      sortOrder === DESC_DIRECTION ? 'desc' : 'asc',
    );

    return unassigned.concat(sorted);
  }, [expenseClassesTotals, sortedColumn, sortOrder]);

  if (!expenseClassesTotals) {
    return null;
  }

  return (
    <>
      <MultiColumnList
        columnMapping={columnMapping}
        contentData={sortedRecords}
        formatter={resultsFormatter}
        id={id}
        interactive={false}
        loading={loading}
        onHeaderClick={changeSorting}
        sortDirection={sortOrder}
        sortedColumn={sortedColumn}
        visibleColumns={visibleColumns}
      />
      <AcqEndOfList totalCount={sortedRecords?.length} />
    </>
  );
};

ExpenseClasses.propTypes = {
  currency: PropTypes.string,
  expenseClassesTotals: PropTypes.arrayOf(PropTypes.object),
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

ExpenseClasses.defaultProps = {
  loading: false,
  visibleColumns: defaultVisibleColumns,
};

export default ExpenseClasses;
