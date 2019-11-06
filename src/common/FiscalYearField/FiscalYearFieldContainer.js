import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import { fiscalYearsResource } from '../resources';
import getFiscalYearsForSelect from '../../Utils/getFiscalYearsForSelect';

import FiscalYearField from './FiscalYearField';

function FiscalYearFieldContainer({ resources, name, required }) {
  const fiscalYears = getFiscalYearsForSelect(resources);

  return (
    <FiscalYearField
      dataOptions={fiscalYears}
      name={name}
      required={required}
    />
  );
}

FiscalYearFieldContainer.manifest = Object.freeze({
  fiscalYears: fiscalYearsResource,
});

FiscalYearFieldContainer.propTypes = {
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  resources: PropTypes.object.isRequired,
};

FiscalYearFieldContainer.defaultProps = {
  required: false,
};

export default stripesConnect(FiscalYearFieldContainer);
