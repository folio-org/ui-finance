import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { AccordionSet } from '@folio/stripes/components';
import {
  AcqCheckboxFilter,
  AcqUnitFilter,
} from '@folio/stripes-acq-components';

import {
  GROUPS_FILTERS,
  GROUP_STATUS_OPTIONS,
} from '../../constants';

const applyFiltersAdapter = (applyFilters) => ({ name, values }) => applyFilters(name, values);

const GroupsListFilters = ({ activeFilters, applyFilters }) => {
  const adaptedApplyFilters = useCallback(
    applyFiltersAdapter(applyFilters),
    [applyFilters],
  );

  return (
    <AccordionSet>
      <AcqCheckboxFilter
        id={GROUPS_FILTERS.STATUS}
        activeFilters={activeFilters[GROUPS_FILTERS.STATUS]}
        labelId="ui-finance.groups.status"
        name={GROUPS_FILTERS.STATUS}
        onChange={adaptedApplyFilters}
        options={GROUP_STATUS_OPTIONS}
      />
      <AcqUnitFilter
        id={GROUPS_FILTERS.ACQUISITIONS_UNIT}
        activeFilters={activeFilters[GROUPS_FILTERS.ACQUISITIONS_UNIT]}
        labelId="ui-finance.groups.acqUnits"
        name={GROUPS_FILTERS.ACQUISITIONS_UNIT}
        onChange={adaptedApplyFilters}
      />
    </AccordionSet>
  );
};

GroupsListFilters.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
};

export default GroupsListFilters;
