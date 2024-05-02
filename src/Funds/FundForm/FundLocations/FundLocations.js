import PropTypes from 'prop-types';
import { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import { Loading } from '@folio/stripes/components';
import {
  ConsortiumLocationsContext,
  LocationsContext,
} from '@folio/stripes-acq-components';

import { FundLocationsList } from './FundLocationsList';

const validate = (locations, { fund }) => {
  return fund?.restrictByLocations && (locations || []).length === 0
    ? <FormattedMessage id="ui-finance.validation.locationsRequired" />
    : undefined;
};

export const FundLocations = ({
  assignedLocations,
  centralOrdering = false,
  name,
}) => {
  const { isLoading, locations } = useContext(centralOrdering ? ConsortiumLocationsContext : LocationsContext);

  if (isLoading) return <Loading />;

  return (
    <FieldArray
      component={FundLocationsList}
      name={name}
      assignedLocations={assignedLocations}
      locations={locations}
      validate={validate}
      centralOrdering={centralOrdering}
    />
  );
};

FundLocations.defaultProps = {
  assignedLocations: [],
};

FundLocations.propTypes = {
  assignedLocations: PropTypes.arrayOf(PropTypes.object),
  centralOrdering: PropTypes.bool,
  name: PropTypes.string.isRequired,
};
