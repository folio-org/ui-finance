import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { Loading, Selection } from '@folio/stripes/components';
import {
  FilterAccordion,
  filterSelectValues,
  useFiscalYears,
} from '@folio/stripes-acq-components';

/*
  Same as FiscalYearFilter from stripes-acq-components, but with a placeholder
  ("Select fiscal year") for the empty state, which the shared filter doesn't support.
*/
const BrowseFiscalYearFilter = ({
  activeFilters,
  id,
  labelId,
  name,
  onChange,
}) => {
  const intl = useIntl();
  const { isLoading, fiscalYears } = useFiscalYears();

  const options = useMemo(() => (
    fiscalYears.map(({ code, id: fiscalYearId }) => ({ value: fiscalYearId, label: code }))
  ), [fiscalYears]);

  const changeSelection = useCallback(
    (value) => onChange({ name, values: [value] }),
    [name, onChange],
  );

  if (isLoading) return <Loading />;

  return (
    <FilterAccordion
      activeFilters={activeFilters}
      closedByDefault={false}
      id={id}
      labelId={labelId}
      name={name}
      onChange={onChange}
    >
      <Selection
        aria-labelledby={`accordion-toggle-button-${id}`}
        dataOptions={options}
        id={`${name}-selection`}
        onChange={changeSelection}
        onFilter={filterSelectValues}
        placeholder={intl.formatMessage({ id: 'ui-finance.selectFiscalYear' })}
        value={activeFilters?.[0] || ''}
      />
    </FilterAccordion>
  );
};

BrowseFiscalYearFilter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  id: PropTypes.string.isRequired,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default BrowseFiscalYearFilter;
