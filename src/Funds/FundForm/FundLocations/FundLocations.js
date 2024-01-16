import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import { Loading } from '@folio/stripes/components';
import { useLocations } from '@folio/stripes-acq-components';

import { FundLocationsList } from './FundLocationsList';

const validate = (locations, { fund }) => {
  return fund?.restrictByLocations && (locations || []).length === 0
    ? <FormattedMessage id="ui-finance.validation.locationsRequired" />
    : undefined;
};

export const FundLocations = ({ assignedLocations, name }) => {
  const { isLoading, locations } = useLocations();

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
  assignedLocations: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string.isRequired,
};
