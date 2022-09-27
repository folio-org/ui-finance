import PropTypes from 'prop-types';

import { AccordionSet } from '@folio/stripes/components';
import {
  AcqCheckboxFilter,
  AcqDateRangeFilter,
} from '@folio/stripes-acq-components';

import {
  LEDGER_ROLLOVER_SOURCE_OPTIONS,
  LEDGER_ROLLOVER_STATUS_OPTIONS,
} from '../constants';

export const RolloverLogsFilters = ({
  activeFilters,
  applyFilters,
  disabled,
}) => {
  return (
    <AccordionSet>
      <AcqDateRangeFilter
        id="rollover-logs-start-time-filter"
        disabled={disabled}
        activeFilters={activeFilters?.startDate}
        labelId="ui-finance.ledger.rollover.logs.startDate"
        name="startDate"
        onChange={({ name, values }) => applyFilters(name, values)}
      />

      <AcqDateRangeFilter
        id="rollover-logs-end-time-filter"
        disabled={disabled}
        activeFilters={activeFilters?.endTime}
        labelId="ui-finance.ledger.rollover.logs.endDate"
        name="endDate"
        onChange={({ name, values }) => applyFilters(name, values)}
      />

      <AcqCheckboxFilter
        id="rollover-logs-status-filter"
        disabled={disabled}
        activeFilters={activeFilters?.rolloverStatus}
        labelId="ui-finance.ledger.rollover.logs.status"
        name="rolloverStatus"
        onChange={({ name, values }) => applyFilters(name, values)}
        options={LEDGER_ROLLOVER_STATUS_OPTIONS}
        closedByDefault={false}
      />

      <AcqCheckboxFilter
        id="rollover-logs-source-filter"
        disabled={disabled}
        activeFilters={activeFilters?.ledgerRolloverType}
        labelId="ui-finance.ledger.rollover.logs.source"
        name="ledgerRolloverType"
        onChange={({ name, values }) => applyFilters(name, values)}
        options={LEDGER_ROLLOVER_SOURCE_OPTIONS}
      />
    </AccordionSet>
  );
};

RolloverLogsFilters.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
