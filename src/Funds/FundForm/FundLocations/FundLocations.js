import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import {
  checkIfUserInCentralTenant,
  useStripes,
} from '@folio/stripes/core';
import { Loading } from '@folio/stripes/components';
import {
  FundLocationsContextProvider,
  FundConsortiumLocationsContextProvider,
  FundConsortiumLocationsContext,
  FundLocationsContext,
} from '@folio/stripes-acq-components';

import { FundLocationsList } from './FundLocationsList';

const validate = (locations, { fund }) => {
  return fund?.restrictByLocations && (locations || []).length === 0
    ? <FormattedMessage id="ui-finance.validation.locationsRequired" />
    : undefined;
};

export const FundLocations = ({ assignedLocations, name }) => {
  const stripes = useStripes();

  console.log('stripes', stripes);

  const ContextProvider = checkIfUserInCentralTenant(stripes)
    ? FundConsortiumLocationsContextProvider
    : FundLocationsContextProvider;

  const ContextConsumer = checkIfUserInCentralTenant(stripes)
    ? FundConsortiumLocationsContext.Consumer
    : FundLocationsContext.Consumer;

  return (
    <ContextProvider>
      <ContextConsumer>
        {({ isLoading, locations }) => {
          console.log(locations, isLoading);
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
        }}
      </ContextConsumer>
    </ContextProvider>
  );
};

FundLocations.defaultProps = {
  assignedLocations: [],
};

FundLocations.propTypes = {
  assignedLocations: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string.isRequired,
};
