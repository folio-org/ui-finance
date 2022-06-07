import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  AccordionSet,
} from '@folio/stripes/components';

import {
  AcqCheckboxFilter,
  AcqTagsFilter,
  DynamicSelectionFilter,
  INVOICES_API,
  LINES_API,
} from '@folio/stripes-acq-components';

import {
  TRANSACTION_SOURCE_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
} from '../../constants';
import { ExpenseClassFilter } from './ExpenseClassFilter';

export const FILTERS = {
  SOURCE: 'source',
  SOURCE_PO_LINE: 'encumbrance.sourcePoLineId',
  SOURCE_INVOICE: 'sourceInvoiceId',
  TRANSACTION_TYPE: 'transactionType',
  TAGS: 'tags.tagList',
  EXPENSE_CLASS: 'expenseClassId',
};

const applyFiltersAdapter = (applyFilters) => ({ name, values }) => applyFilters(name, values);
const getSourceQueryBuilder = (field) => (value) => `${field}="${value || ''}*" sortby ${field}/sort.ascending`;

const TransactionsFilters = ({
  activeFilters,
  applyFilters,
}) => {
  const adaptedApplyFilters = useCallback(
    applyFiltersAdapter(applyFilters),
    [applyFilters],
  );

  return (
    <AccordionSet>
      <AcqCheckboxFilter
        id={FILTERS.TRANSACTION_TYPE}
        activeFilters={activeFilters[FILTERS.TRANSACTION_TYPE]}
        labelId="ui-finance.transaction.type"
        name={FILTERS.TRANSACTION_TYPE}
        onChange={adaptedApplyFilters}
        options={TRANSACTION_TYPE_OPTIONS}
      />

      <AcqCheckboxFilter
        activeFilters={activeFilters[FILTERS.SOURCE]}
        id={`filter-${FILTERS.SOURCE}`}
        labelId="ui-finance.transaction.source"
        name={FILTERS.SOURCE}
        onChange={adaptedApplyFilters}
        options={TRANSACTION_SOURCE_OPTIONS}
      />

      <DynamicSelectionFilter
        activeFilters={activeFilters[FILTERS.SOURCE_PO_LINE]}
        api={LINES_API}
        dataFormatter={({ poLines }) => poLines.map(({ id, poLineNumber }) => ({ label: poLineNumber, value: id }))}
        id={`filter-${FILTERS.SOURCE_PO_LINE}`}
        labelId="ui-finance.transaction.source.PoLine.number"
        name={FILTERS.SOURCE_PO_LINE}
        onChange={adaptedApplyFilters}
        queryBuilder={getSourceQueryBuilder('poLineNumber')}
      />

      <DynamicSelectionFilter
        activeFilters={activeFilters[FILTERS.SOURCE_INVOICE]}
        api={INVOICES_API}
        dataFormatter={({ invoices }) => invoices.map(
          ({ id, vendorInvoiceNo }) => ({ label: vendorInvoiceNo, value: id }),
        )}
        id={`filter-${FILTERS.SOURCE_INVOICE}`}
        labelId="ui-finance.transaction.source.Invoice.number"
        name={FILTERS.SOURCE_INVOICE}
        onChange={adaptedApplyFilters}
        queryBuilder={getSourceQueryBuilder('vendorInvoiceNo')}
      />

      <AcqTagsFilter
        activeFilters={activeFilters[FILTERS.TAGS]}
        id={FILTERS.TAGS}
        name={FILTERS.TAGS}
        onChange={adaptedApplyFilters}
      />

      <ExpenseClassFilter
        activeFilters={activeFilters[FILTERS.EXPENSE_CLASS]}
        id={FILTERS.EXPENSE_CLASS}
        labelId="ui-finance.transaction.expenseClass"
        name={FILTERS.EXPENSE_CLASS}
        onChange={adaptedApplyFilters}
      />
    </AccordionSet>
  );
};

TransactionsFilters.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
};

export default TransactionsFilters;
