import React from 'react';
import PropTypes from 'prop-types';

import { AccordionSet } from '@folio/stripes/components';
import {
  AcqCheckboxFilter,
  AcqUnitFilter,
  acqUnitsShape,
  AcqTagsFilter,
  SelectionFilter,
  selectOptionsShape,
} from '@folio/stripes-acq-components';

import {
  FUND_FILTERS,
  FUND_STATUSES_OPTIONS,
} from '../constants';

const FundListFilters = ({
  acqUnits,
  activeFilters,
  fundTypes,
  groups,
  ledgers,
  onChange,
}) => {
  return (
    <AccordionSet>
      <SelectionFilter
        activeFilters={activeFilters[FUND_FILTERS.LEDGER]}
        labelId="ui-finance.fund.filters.ledger"
        name={FUND_FILTERS.LEDGER}
        onChange={onChange}
        options={ledgers}
      />
      <AcqCheckboxFilter
        id={FUND_FILTERS.STATUS}
        activeFilters={activeFilters[FUND_FILTERS.STATUS]}
        labelId="ui-finance.fund.filters.status"
        name={FUND_FILTERS.STATUS}
        onChange={onChange}
        options={FUND_STATUSES_OPTIONS}
      />
      <SelectionFilter
        activeFilters={activeFilters[FUND_FILTERS.TYPE]}
        labelId="ui-finance.fund.filters.type"
        name={FUND_FILTERS.TYPE}
        onChange={onChange}
        options={fundTypes}
      />
      <SelectionFilter
        activeFilters={activeFilters[FUND_FILTERS.GROUP]}
        labelId="ui-finance.fund.filters.group"
        name={FUND_FILTERS.GROUP}
        onChange={onChange}
        options={groups}
      />
      <AcqUnitFilter
        id={FUND_FILTERS.ACQUISITIONS_UNIT}
        activeFilters={activeFilters[FUND_FILTERS.ACQUISITIONS_UNIT]}
        labelId="ui-finance.fund.filters.acqUnits"
        name={FUND_FILTERS.ACQUISITIONS_UNIT}
        onChange={onChange}
        acqUnits={acqUnits}
      />
      <AcqTagsFilter
        activeFilters={activeFilters[FUND_FILTERS.TAGS]}
        id={FUND_FILTERS.TAGS}
        name={FUND_FILTERS.TAGS}
        onChange={onChange}
      />
    </AccordionSet>
  );
};

FundListFilters.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  acqUnits: acqUnitsShape,
  fundTypes: selectOptionsShape,
  groups: selectOptionsShape,
  ledgers: selectOptionsShape,
};

FundListFilters.defaultProps = {
  acqUnits: [],
  fundTypes: [],
  groups: [],
  ledgers: [],
};

export default FundListFilters;
