import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { useOkapiKy } from '@folio/stripes/core';
import {
  NoValue,
  TextLink,
} from '@folio/stripes/components';
import {
  formatDate,
  TIMEZONE,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  exportRolloverErrors,
} from '../../../common/utils';
import {
  LEDGER_ROLLOVER_LINK_TYPES,
  LEDGER_ROLLOVER_LINK_TYPES_MAP,
} from '../constants';

import css from './RolloverLogLink.css';
import {
  LEDGER_ROLLOVER_ERRORS_API,
} from '../../../common/const';

export const RolloverLogLink = ({
  type,
  rolloverLog,
  exportFileName,
}) => {
  const intl = useIntl();
  const ky = useOkapiKy();
  const showCallout = useShowCallout();

  const {
    ledgerRolloverId,
    endDate,
    rolloverStatus,
  } = rolloverLog;

  const filename = exportFileName || `${formatDate(endDate, intl, TIMEZONE)}-${type}`;
  const isErrorLink = type === LEDGER_ROLLOVER_LINK_TYPES.error;

  const getLedgerRolloverErrors = useCallback(() => {
    const searchParams = {
      query: `ledgerRolloverId=="${ledgerRolloverId}"`,
    };

    return ky.get(LEDGER_ROLLOVER_ERRORS_API, { searchParams })
      .json()
      .then(({ ledgerFiscalYearRolloverErrors }) => ({
        errors: ledgerFiscalYearRolloverErrors,
        filename,
      }))
      .then(exportRolloverErrors);
  }, [ledgerRolloverId, ky, filename]);

  const getLedgerRolloverResults = useCallback(() => {
    // TODO: implement when BE API is ready
    console.log('Export rollover budgets');

    return Promise.resolve();
  }, []);

  const onClick = useCallback(async () => {
    const handler = isErrorLink
      ? getLedgerRolloverErrors
      : getLedgerRolloverResults;

    return handler()
      .catch(() => {
        showCallout({
          messageId: 'ui-finance.ledger.rollover.logs.export.failed',
          type: 'error',
        });
      });
  }, [
    getLedgerRolloverErrors,
    getLedgerRolloverResults,
    isErrorLink,
    showCallout,
  ]);

  if (type !== LEDGER_ROLLOVER_LINK_TYPES_MAP[rolloverStatus]) return <NoValue />;

  return (
    <TextLink
      data-testid="rollover-log-link"
      className={css.link}
      onClick={onClick}
    >
      {filename}
    </TextLink>
  );
};

RolloverLogLink.propTypes = {
  type: PropTypes.oneOf(Object.values(LEDGER_ROLLOVER_LINK_TYPES)).isRequired,
  rolloverLog: PropTypes.object.isRequired,
  exportFileName: PropTypes.string,
};
