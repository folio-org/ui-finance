import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Card,
  Headline,
  Icon,
  Loading,
  Pane,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import { Progress } from '@folio/stripes-data-transfer-components';
import { useShowCallout } from '@folio/stripes-acq-components';

import {
  fiscalYearResource,
} from '../../../common/resources';
import {
  FISCAL_YEARS_API,
  OVERALL_ROLLOVER_STATUS,
} from '../../../common/const';

// attributes that show if corresponding stage is completed
const STAGE_ATTRS = ['budgetsClosingRolloverStatus', 'financialRolloverStatus', 'ordersRolloverStatus'];

function LedgerRolloverProgress({ ledgerName, onClose, rolloverStatus, fromYearCode, mutator, rollover }) {
  const showCallout = useShowCallout();
  const [toYearCode, setToYearCode] = useState();
  const toYearId = rollover?.toFiscalYearId;

  useEffect(() => {
    mutator.toFiscalYear.GET({ path: `${FISCAL_YEARS_API}/${toYearId}` })
      .then(
        ({ code }) => {
          setToYearCode(code);
        },
        () => {
          showCallout({
            messageId: 'ui-finance.ledger.rolloverInProgress.errorLoadingToFiscalYear',
            type: 'error',
          });
          setToYearCode();
        },
      );
  }, [showCallout, toYearId]);

  const inProgressStages = STAGE_ATTRS.filter((k) => rolloverStatus[k] !== OVERALL_ROLLOVER_STATUS.notStarted);

  return (
    <Pane
      id="pane-ledger-rollover-in-progress"
      defaultWidth="fill"
      dismissible
      paneTitle={ledgerName}
      onClose={onClose}
    >
      <Card
        cardStyle="positive"
        headerStart={(
          <Headline margin="none">
            <Icon icon="calendar">
              <FormattedMessage
                id="ui-finance.ledger.rolloverInProgress.header"
                values={{ fromYearCode, toYearCode }}
              />
            </Icon>
          </Headline>
        )}
        roundedBorder
      >
        <Progress
          current={inProgressStages.length}
          progressInfoType="none"
          total={STAGE_ATTRS.length}
        />
        <Headline
          faded
          margin="none"
        >
          <FormattedMessage id="ui-finance.ledger.rolloverInProgress.rollingOver" />
          <Loading />
        </Headline>
      </Card>
    </Pane>
  );
}

LedgerRolloverProgress.manifest = Object.freeze({
  toFiscalYear: {
    ...fiscalYearResource,
    accumulate: true,
    fetch: false,
  },
});

LedgerRolloverProgress.propTypes = {
  fromYearCode: PropTypes.string,
  ledgerName: PropTypes.string,
  mutator: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  rollover: PropTypes.object,
  rolloverStatus: PropTypes.object,
};

LedgerRolloverProgress.defaultProps = {
  rollover: {},
  rolloverStatus: {},
};

export default stripesConnect(LedgerRolloverProgress);
