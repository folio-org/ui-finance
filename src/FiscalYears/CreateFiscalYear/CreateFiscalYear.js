import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { SubmissionError } from 'redux-form';

import { stripesConnect } from '@folio/stripes/core';
import {
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  FISCAL_YEAR_ROUTE,
} from '../../common/const';
import {
  fiscalYearsResource,
} from '../../common/resources';
import FiscalYearForm from '../FiscalYearForm';

const INITIAL_FISCAL_YEAR = {};

const CreateFiscalYear = ({ mutator, location, history }) => {
  const showCallout = useShowCallout();

  const closeForm = useCallback(
    (id) => {
      history.push({
        pathname: id ? `${FISCAL_YEAR_ROUTE}/${id}/view` : FISCAL_YEAR_ROUTE,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

  const saveFiscalYear = useCallback(
    async (fiscalYearValues) => {
      try {
        const savedFiscalYear = await mutator.createFiscalYear.POST(fiscalYearValues);

        showCallout({
          messageId: 'ui-finance.fiscalYear.actions.save.success',
        });
        setTimeout(() => closeForm(savedFiscalYear.id), 0);

        return savedFiscalYear;
      } catch (response) {
        let errorCode = null;

        try {
          const responseJson = await response.json();

          errorCode = get(responseJson, 'errors.0.code', 'genericError');
        } catch (parsingException) {
          errorCode = 'genericError';
        }
        showCallout({
          messageId: `ui-finance.fiscalYear.actions.save.error.${errorCode}`,
          type: 'error',
        });
        throw new SubmissionError({
          _error: 'FY was not saved',
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [closeForm],
  );

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
