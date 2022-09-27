import { omit } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  OVERALL_ROLLOVER_STATUS,
  LEDGER_ROLLOVER_TYPES,
} from '../../common/const';

export const LEDGER_ROLLOVER_SOURCE_MAP = {
  [LEDGER_ROLLOVER_TYPES.commit]: <FormattedMessage id="ui-finance.ledger.rollover.rollover" />,
  [LEDGER_ROLLOVER_TYPES.preview]: <FormattedMessage id="ui-finance.ledger.rollover.rolloverTest" />,
};

export const LEDGER_ROLLOVER_STATUS_MAP = {
  [OVERALL_ROLLOVER_STATUS.inProgress]: <FormattedMessage id="ui-finance.ledger.rollover.status.inProgress" />,
  [OVERALL_ROLLOVER_STATUS.success]: <FormattedMessage id="ui-finance.ledger.rollover.status.success" />,
  [OVERALL_ROLLOVER_STATUS.error]: <FormattedMessage id="ui-finance.ledger.rollover.status.error" />,
};

export const ROLLOVER_LOGS_VISIBLE_COLUMNS = [
  'startDate',
  'endDate',
  'status',
  'errors',
  'results',
  'source',
];

export const ROLLOVER_LOGS_COLUMNS_MAPPING = (
  ROLLOVER_LOGS_VISIBLE_COLUMNS.reduce((acc, column) => ({
    ...acc,
    [column]: <FormattedMessage id={`ui-finance.ledger.rollover.logs.${column}`} />,
  }), {})
);

export const LEDGER_ROLLOVER_STATUS_OPTIONS = (
  Object.values(omit(OVERALL_ROLLOVER_STATUS, 'notStarted')).map(value => ({
    label: LEDGER_ROLLOVER_STATUS_MAP[value],
    value,
  }))
);

export const LEDGER_ROLLOVER_SOURCE_OPTIONS = (
  Object.values(omit(LEDGER_ROLLOVER_TYPES, 'rollback')).map(value => ({
    label: LEDGER_ROLLOVER_SOURCE_MAP[value],
    value,
  }))
);

export const LEDGER_ROLLOVER_LINK_TYPES = {
  error: 'error',
  result: 'result',
};

export const LEDGER_ROLLOVER_LINK_TYPES_MAP = {
  [OVERALL_ROLLOVER_STATUS.error]: LEDGER_ROLLOVER_LINK_TYPES.error,
  [OVERALL_ROLLOVER_STATUS.success]: LEDGER_ROLLOVER_LINK_TYPES.result,
};
