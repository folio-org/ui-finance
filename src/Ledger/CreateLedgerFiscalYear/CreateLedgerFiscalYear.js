import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';

import {
  LEDGERS_ROUTE,
} from '../../common/const';
import {
  fiscalYearsResource,
} from '../../common/resources';

import {
  FiscalYearForm,
  useSaveFiscalYear,
} from '../../FiscalYears';

const INITIAL_FISCAL_YEAR = {};

const CreateLedgerFiscalYear = ({ mutator, location, history, match }) => {
  const ledgerId = match.params.id;

  const closeForm = useCallback(
    ({ id } = {}) => {
      const ledgerFormPath = ledgerId
        ? `${LEDGERS_ROUTE}/${ledgerId}/edit`
        : `${LEDGERS_ROUTE}/create`;

      history.push({
        pathname: ledgerFormPath,
        search: location.search,
        state: { fiscalYearOneId: id },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

  const saveFiscalYear = useSaveFiscalYear(mutator.createLedgerFiscalYear, closeForm);

  return (
    <FiscalYearForm
      initialValues={INITIAL_FISCAL_YEAR}
      onSubmit={saveFiscalYear}
      onCancel={closeForm}
    />
  );
};

CreateLedgerFiscalYear.manifest = Object.freeze({
  createLedgerFiscalYear: {
    ...fiscalYearsResource,
    fetch: true,
  },
});

CreateLedgerFiscalYear.propTypes = {
  mutator: PropTypes.object.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};

export default withRouter(stripesConnect(CreateLedgerFiscalYear));
