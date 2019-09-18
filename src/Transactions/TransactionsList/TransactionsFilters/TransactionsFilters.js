import React, { useCallback, Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  AccordionSet,
} from '@folio/stripes/components';

import {
  AcqCheckboxFilter,
} from '@folio/stripes-acq-components';

import {
  TRANSACTION_TYPE_OPTIONS,
} from '../../constants';

const FILTERS = {
  TRANSACTION_TYPE: 'transactionType',
};

const applyFiltersAdapter = (applyFilters) => ({ name, values }) => applyFilters(name, values);

const TransactionsFilters = ({
  activeFilters,
  applyFilters,
}) => {
  const adaptedApplyFilters = useCallback(
    applyFiltersAdapter(applyFilters),
    [applyFilters],
  );

  return (
    <Fragment>
      <AccordionSet>
        <AcqCheckboxFilter
          id={FILTERS.TRANSACTION_TYPE}
          activeFilters={activeFilters[FILTERS.TRANSACTION_TYPE]}
          labelId="ui-finance.transaction.type"
          name={FILTERS.TRANSACTION_TYPE}
          onChange={adaptedApplyFilters}
          options={TRANSACTION_TYPE_OPTIONS}
        />
      </AccordionSet>
    </Fragment>
  );
};

TransactionsFilters.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
};

export default TransactionsFilters;
