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
  exportRolloverResult,
} from '../../../common/utils';
import { LEDGER_ROLLOVER_LINK_TYPES } from '../constants';

import css from './RolloverLogLink.css';

export const RolloverLogLink = ({
  type,
  rolloverLog,
  exportFileName,
}) => {
  const intl = useIntl();
  const ky = useOkapiKy();
  const showCallout = useShowCallout();

  const { budgetsLink, endDate, errorsLink } = rolloverLog;
  const filename = exportFileName || `${formatDate(endDate, intl, TIMEZONE)}-${type}`;
  const isErrorLink = type === LEDGER_ROLLOVER_LINK_TYPES.error;
  const link = isErrorLink
    ? errorsLink
    : budgetsLink;

  const onClick = useCallback(async () => {
    try {
      const data = await ky.get(link).json();

      return isErrorLink
        ? exportRolloverErrors({ errors: data, filename })
        : exportRolloverResult({ data, filename });
    } catch {
      return showCallout({
        messageId: 'ui-finance.ledger.rollover.logs.export.failed',
        type: 'error',
      });
    }
  }, [filename, isErrorLink, ky, link, showCallout]);

  if (!link) return <NoValue />;

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
