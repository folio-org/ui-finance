import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation, useParams } from 'react-router-dom';

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

const RolloverLedgerCreateFiscalYear = ({ mutator }) => {
  const { id: ledgerId } = useParams();
  const location = useLocation();
  const history = useHistory();

  const closeForm = useCallback(
    (id) => {
      history.push({
        pathname: `${LEDGERS_ROUTE}/${ledgerId}/rollover`,
        search: location.search,
        state: { toFiscalYearId: id },
      });
    },
    [history, ledgerId, location.search],
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

RolloverLedgerCreateFiscalYear.manifest = Object.freeze({
  createLedgerFiscalYear: {
    ...fiscalYearsResource,
    fetch: true,
  },
});

RolloverLedgerCreateFiscalYear.propTypes = {
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(RolloverLedgerCreateFiscalYear);
