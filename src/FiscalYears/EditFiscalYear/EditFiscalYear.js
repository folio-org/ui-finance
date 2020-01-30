import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { SubmissionError } from 'redux-form';

import { stripesConnect } from '@folio/stripes/core';
import { Paneset } from '@folio/stripes/components';
import {
  LoadingPane,
  useShowToast,
} from '@folio/stripes-acq-components';

import {
  FISCAL_YEAR_ROUTE,
} from '../../common/const';
import {
  fiscalYearResource,
} from '../../common/resources';
import FiscalYearForm from '../FiscalYearForm';

const EditFiscalYear = ({ resources, mutator, match, history, location }) => {
  const fiscalYearId = match.params.id;

  useEffect(
    () => {
      mutator.fiscalYearEdit.reset();
      mutator.fiscalYearEdit.GET();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fiscalYearId],
  );

  const showToast = useShowToast();

  const closeEdit = useCallback(
    () => {
      history.push({
        pathname: `${FISCAL_YEAR_ROUTE}/${fiscalYearId}/view`,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fiscalYearId, location.search],
  );

  const saveFiscalYear = useCallback(
    async (fiscalYearValues) => {
      try {
        const savedFiscalYear = await mutator.fiscalYearEdit.PUT(fiscalYearValues);

        showToast('ui-finance.fiscalYear.actions.save.success');
        setTimeout(() => closeEdit(), 0);

        return savedFiscalYear;
      } catch (response) {
        let errorCode = null;

        try {
          const responseJson = await response.json();

          errorCode = get(responseJson, 'errors.0.code', 'genericError');
        } catch (parsingException) {
          errorCode = 'genericError';
        }
        showToast(`ui-finance.fiscalYear.actions.save.error.${errorCode}`, 'error');
        throw new SubmissionError({
          _error: 'FY was not saved',
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [closeEdit, mutator.fiscalYearEdit],
  );

  const isLoading = !get(resources, ['fiscalYearEdit', 'hasLoaded']);
  const fiscalYear = get(resources, ['fiscalYearEdit', 'records', '0']);

  if (isLoading) {
    return (
      <Paneset>
        <LoadingPane onClose={closeEdit} />
      </Paneset>
    );
  }

  return (
    <FiscalYearForm
      initialValues={fiscalYear}
      onSubmit={saveFiscalYear}
      onCancel={closeEdit}
    />
  );
};

EditFiscalYear.manifest = Object.freeze({
  fiscalYearEdit: {
    ...fiscalYearResource,
    accumulate: true,
  },
});

EditFiscalYear.propTypes = {
  resources: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};

export default withRouter(stripesConnect(EditFiscalYear));
