import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { writeStorage } from '@rehooks/local-storage';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';

import {
  Button,
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
  LEDGERS_ROUTE,
  OVERALL_ROLLOVER_STATUS,
} from '../../../common/const';

// attributes that show if corresponding stage is completed
const STAGE_ATTRS = ['budgetsClosingRolloverStatus', 'financialRolloverStatus', 'ordersRolloverStatus'];

function LedgerRolloverProgress({ ledgerName, onClose, rolloverStatus, fromYearCode, mutator, rollover }) {
  const showCallout = useShowCallout();
  const history = useHistory();
  const location = useLocation();
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
  const isInProgress = rolloverStatus.overallRolloverStatus === OVERALL_ROLLOVER_STATUS.inProgress;
  const closeProgress = useCallback(() => {
    writeStorage(`LedgerRolloverProgress-${rolloverStatus.id}`, true);
    history.push({
      pathname: `${LEDGERS_ROUTE}/${rollover.ledgerId}/view`,
      search: location.search,
    });
  }, [history, location.search, rollover.ledgerId, rolloverStatus.id]);

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
          {isInProgress
            ? (
              <>
                <FormattedMessage id="ui-finance.ledger.rolloverInProgress.rollingOver" />
                <Loading />
              </>
            )
            : (
              <FormattedMessage id="ui-finance.ledger.rolloverInProgress.rollingOverFinished" />
            )
          }
        </Headline>
      </Card>
      {!isInProgress && (
        <Button
          buttonStyle="primary"
          fullWidth
          onClick={closeProgress}
        >
          <FormattedMessage id="ui-finance.ledger.rolloverInProgress.close" />
        </Button>
      )}
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
