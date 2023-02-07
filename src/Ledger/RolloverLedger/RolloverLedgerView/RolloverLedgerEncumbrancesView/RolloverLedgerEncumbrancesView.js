import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Checkbox,
  Col,
  Row,
} from '@folio/stripes/components';

import {
  BASED_ON_LABEL_ID,
  ORDER_TYPE_LABEL,
  ROLLOVER_ENCUMBRANCES_HEAD_LABELS,
} from '../../../constants';
import { RolloverListValue } from '../RolloverListValue';

import css from '../RolloverLedgerView.css';

export const RolloverLedgerEncumbrancesView = ({ rollover }) => {
  const intl = useIntl();

  const encumbrancesRollover = useMemo(() => rollover?.encumbrancesRollover || [], [rollover]);

  const renderFields = useCallback((encumbranceRollover) => {
    const {
      basedOn,
      increaseBy,
      orderType,
      rollover: isRollover,
    } = encumbranceRollover;

    return (
      <Row>
        <Col xs={2}>
          <RolloverListValue
            aria-label={intl.formatMessage({ id: 'ui-finance.ledger.rollover.orderType' })}
            value={ORDER_TYPE_LABEL[orderType]}
          />
        </Col>
        <Col xs={2}>
          <Checkbox
            aria-label={intl.formatMessage({ id: 'ui-finance.ledger.rollover.rollover' })}
            checked={!!isRollover}
            disabled
            vertical
          />
        </Col>
        <Col xs={2}>
          <RolloverListValue
            aria-label={intl.formatMessage({ id: 'ui-finance.ledger.rollover.basedOn' })}
            value={<FormattedMessage id={BASED_ON_LABEL_ID[basedOn]} />}
          />
        </Col>
        <Col xs={2}>
          <RolloverListValue
            aria-label={intl.formatMessage({ id: 'ui-finance.ledger.rollover.increaseBy' })}
            value={increaseBy}
          />
        </Col>
      </Row>
    );
  }, [intl]);

  return (
    <ul className={css.rolloverList}>
      {!!encumbrancesRollover.length && <li>{ROLLOVER_ENCUMBRANCES_HEAD_LABELS}</li>}
      {encumbrancesRollover.map(
        (encumbranceRollover) => <li key={encumbranceRollover.orderType}>{renderFields(encumbranceRollover)}</li>,
      )}
    </ul>
  );
};

RolloverLedgerEncumbrancesView.propTypes = {
  rollover: PropTypes.object.isRequired,
};
