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
  LIMIT_MAX,
  TIMEZONE,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  LEDGER_ROLLOVER_BUDGETS_API,
  LEDGER_ROLLOVER_ERRORS_API,
} from '../../../common/const';
import {
  generateBudgetsReport,
  exportRolloverErrors,
  exportRolloverResult,
} from '../../../common/utils';
import {
  LEDGER_ROLLOVER_LINK_TYPES,
  LEDGER_ROLLOVER_LINK_TYPES_MAP,
} from '../constants';

import css from './RolloverLogLink.css';

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
    return ky.get(LEDGER_ROLLOVER_ERRORS_API, {
      searchParams: {
        query: `ledgerRolloverId=="${ledgerRolloverId}"`,
        limit: LIMIT_MAX,
      },
    })
      .json()
      .then(({ ledgerFiscalYearRolloverErrors }) => ({
        errors: ledgerFiscalYearRolloverErrors,
        filename,
      }))
      .then(exportRolloverErrors);
  }, [filename, ky, ledgerRolloverId]);

  const getLedgerRolloverResults = useCallback(() => {
    showCallout({
      messageId: 'ui-finance.ledger.rollover.logs.results.export.start',
    });

    return ky.get(LEDGER_ROLLOVER_BUDGETS_API, {
      searchParams: {
        query: `ledgerRolloverId=="${ledgerRolloverId}"`,
        limit: LIMIT_MAX,
      },
    })
      .json()
      .then(({ ledgerFiscalYearRolloverBudgets }) => ledgerFiscalYearRolloverBudgets)
      .then(generateBudgetsReport(ky))
      .then((data) => exportRolloverResult({ data, filename }));
  }, [filename, ky, ledgerRolloverId, showCallout]);

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

  const hasErrorLink = (
    type === LEDGER_ROLLOVER_LINK_TYPES.error
    && type === LEDGER_ROLLOVER_LINK_TYPES_MAP[rolloverStatus]
  );
  const hasResultLink = (
    type === LEDGER_ROLLOVER_LINK_TYPES.result
    && Boolean(LEDGER_ROLLOVER_LINK_TYPES_MAP[rolloverStatus])
  );

  return hasErrorLink || hasResultLink
    ? (
      <TextLink
        data-testid="rollover-log-link"
        className={css.link}
        onClick={onClick}
      >
        {filename}
      </TextLink>
    )
    : <NoValue />;
};

RolloverLogLink.propTypes = {
  type: PropTypes.oneOf(Object.values(LEDGER_ROLLOVER_LINK_TYPES)).isRequired,
  rolloverLog: PropTypes.object.isRequired,
  exportFileName: PropTypes.string,
};
