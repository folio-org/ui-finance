import React from 'react';
import PropTypes from 'prop-types';

import { AccordionSet } from '@folio/stripes/components';
import {
  AcqCheckboxFilter,
  AcqUnitFilter,
  acqUnitsShape,
} from '@folio/stripes-acq-components';

import {
  GROUPS_FILTERS,
  GROUP_STATUS_OPTIONS,
} from '../constants';

const GroupsListFilters = ({ activeFilters, onChange, acqUnits }) => {
  return (
    <AccordionSet>
      <AcqCheckboxFilter
        id={GROUPS_FILTERS.STATUS}
        activeFilters={activeFilters[GROUPS_FILTERS.STATUS]}
        labelId="ui-finance.groups.status"
        name={GROUPS_FILTERS.STATUS}
        onChange={onChange}
        options={GROUP_STATUS_OPTIONS}
      />
      <AcqUnitFilter
        id={GROUPS_FILTERS.ACQUISITIONS_UNIT}
        activeFilters={activeFilters[GROUPS_FILTERS.ACQUISITIONS_UNIT]}
        labelId="ui-finance.groups.acqUnits"
        name={GROUPS_FILTERS.ACQUISITIONS_UNIT}
        onChange={onChange}
        acqUnits={acqUnits}
      />
    </AccordionSet>
  );
};

GroupsListFilters.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  acqUnits: acqUnitsShape,
  onChange: PropTypes.func.isRequired,
};

export default GroupsListFilters;
