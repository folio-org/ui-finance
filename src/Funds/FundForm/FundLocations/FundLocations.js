import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useForm } from 'react-final-form';

import { FindLocation } from '@folio/stripes-acq-components';

import { FundLocationsList } from './FundLocationsList';

const INITIAL_FILTERS = { isAssigned: [true] };

export const FundLocations = ({
  assignedLocations,
  name,
}) => {
  const { change } = useForm();

  const onRecordsSelect = useCallback((locations) => {
    const locationIds = locations.map(({ id }) => id);

    change(name, locationIds);
  }, [name]);

  return (
    <>
      <FundLocationsList
        items={assignedLocations}
      />

      <FindLocation
        isMultiSelect
        searchLabel={<FormattedMessage id="ui-finance.fund.information.locations.add" />}
        initialFilters={assignedLocations.length ? INITIAL_FILTERS : undefined}
        initialSelected={assignedLocations}
        onRecordsSelect={onRecordsSelect}
      />
    </>
  );
}

FundLocations.defaultProps = {
  assignedLocations: [],
}

FundLocations.propTypes = {
  assignedLocations: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string.isRequired,
}
