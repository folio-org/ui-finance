import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { LoadingView } from '@folio/stripes/components';

import {
  FISCAL_YEAR_ROUTE,
} from '../../common/const';
import {
  fiscalYearResource,
} from '../../common/resources';

import { FiscalYearForm } from '../FiscalYearForm';
import { useSaveFiscalYear } from '../utils';

export const EditFiscalYear = ({ resources, mutator, match, history, location }) => {
  const fiscalYearId = match.params.id;

  useEffect(
    () => {
      mutator.fiscalYearEdit.reset();
      mutator.fiscalYearEdit.GET();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fiscalYearId],
  );

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

  const saveFiscalYear = useSaveFiscalYear(mutator.fiscalYearEdit, closeEdit, 'PUT');

  const isLoading = !get(resources, ['fiscalYearEdit', 'hasLoaded']);
  const fiscalYear = get(resources, ['fiscalYearEdit', 'records', '0']);

  if (isLoading) {
    return (
      <LoadingView onClose={closeEdit} />
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
