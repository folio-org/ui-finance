import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';

import {
  FISCAL_YEAR_ROUTE,
} from '../../common/const';
import {
  fiscalYearsResource,
} from '../../common/resources';

import { useSaveFiscalYear } from '../utils';
import { FiscalYearForm } from '../FiscalYearForm';

const INITIAL_FISCAL_YEAR = {};

export const CreateFiscalYear = ({ mutator, location, history }) => {
  const closeForm = useCallback(
    ({ id } = {}) => {
      history.push({
        pathname: id ? `${FISCAL_YEAR_ROUTE}/${id}/view` : FISCAL_YEAR_ROUTE,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

  const { saveFiscalYear } = useSaveFiscalYear(mutator.createFiscalYear, closeForm);

  return (
    <FiscalYearForm
      initialValues={INITIAL_FISCAL_YEAR}
      onSubmit={saveFiscalYear}
      onCancel={closeForm}
    />
  );
};

CreateFiscalYear.manifest = Object.freeze({
  createFiscalYear: {
    ...fiscalYearsResource,
    fetch: true,
  },
});

CreateFiscalYear.propTypes = {
  mutator: PropTypes.object.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};

export default withRouter(stripesConnect(CreateFiscalYear));
