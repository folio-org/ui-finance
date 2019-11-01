import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import { fiscalYearsResource } from '../resources';
import getFiscalYearsForSelect from '../../Utils/getFiscalYearsForSelect';

import FiscalYearField from './FiscalYearField';

function FiscalYearFieldContainer({ resources, mutator, stripes, ...rest }) {
  const fiscalYears = getFiscalYearsForSelect(resources);

  return (
    <FiscalYearField
      dataOptions={fiscalYears}
      {...rest}
    />
  );
}

FiscalYearFieldContainer.manifest = Object.freeze({
  fiscalYears: fiscalYearsResource,
});

FiscalYearFieldContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default stripesConnect(FiscalYearFieldContainer);
