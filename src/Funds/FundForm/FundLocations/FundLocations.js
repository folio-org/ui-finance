import PropTypes from 'prop-types';
import { useContext } from 'react';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';

import { Loading } from '@folio/stripes/components';
import {
  ConsortiumLocationsContext,
  LocationsContext,
  useConsortiumTenants,
} from '@folio/stripes-acq-components';

import { FundLocationsList } from './FundLocationsList';

const validate = (locations, { fund }) => {
  return fund?.restrictByLocations && (locations || []).length === 0
    ? <FormattedMessage id="ui-finance.validation.locationsRequired" />
    : undefined;
};

const DEFAULT_ASSIGNED_LOCATIONS = [];

export const FundLocations = ({
  assignedLocations = DEFAULT_ASSIGNED_LOCATIONS,
  centralOrdering = false,
  name,
}) => {
  const { isLoading, locations } = useContext(centralOrdering ? ConsortiumLocationsContext : LocationsContext);
  const { tenants } = useConsortiumTenants({ enabled: centralOrdering });

  if (isLoading) return <Loading />;

  return (
    <FieldArray
      component={FundLocationsList}
      name={name}
      assignedLocations={assignedLocations}
      locations={locations}
      validate={validate}
      centralOrdering={centralOrdering}
      tenants={tenants}
    />
  );
};

FundLocations.propTypes = {
  assignedLocations: PropTypes.arrayOf(PropTypes.object),
  centralOrdering: PropTypes.bool,
  name: PropTypes.string.isRequired,
};
