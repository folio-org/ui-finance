import PropTypes from 'prop-types';
import { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import {
  checkIfUserInCentralTenant,
  useStripes,
} from '@folio/stripes/core';
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

export const FundLocations = ({ assignedLocations, name }) => {
  const stripes = useStripes();

  const {
    isLoading,
    locations,
  } = useContext(checkIfUserInCentralTenant(stripes) ? ConsortiumLocationsContext : LocationsContext);

  if (isLoading) return <Loading />;

  return (
    <FieldArray
      component={FundLocationsList}
      name={name}
      assignedLocations={assignedLocations}
      locations={locations}
      validate={validate}
    />
  );
};

FundLocations.defaultProps = {
  assignedLocations: [],
};

FundLocations.propTypes = {
  assignedLocations: PropTypes.arrayOf(PropTypes.object),
  name: PropTypes.string.isRequired,
};
