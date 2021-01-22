import React, { useCallback } from 'react';
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
  Layout,
  Loading,
  MessageBanner,
  Pane,
} from '@folio/stripes/components';
import { Progress } from '@folio/stripes-data-transfer-components';

import {
  LEDGERS_ROUTE,
  OVERALL_ROLLOVER_STATUS,
} from '../../../common/const';
import RolloverErrorsLink from '../RolloverErrorsLink';
import css from './LedgerRolloverProgress.css';

// attributes that show if corresponding stage is completed
const STAGE_ATTRS = ['budgetsClosingRolloverStatus', 'financialRolloverStatus', 'ordersRolloverStatus'];

function LedgerRolloverProgress({ ledgerName, onClose, rolloverStatus, fromYearCode, rolloverToFY, rollover, errors }) {
  const history = useHistory();
  const location = useLocation();
  const toYearCode = rolloverToFY.code;
  const inProgressStages = STAGE_ATTRS.filter((k) => rolloverStatus[k] !== OVERALL_ROLLOVER_STATUS.notStarted);
  const isInProgress = rolloverStatus.overallRolloverStatus === OVERALL_ROLLOVER_STATUS.inProgress;
  const closeProgress = useCallback(() => {
    writeStorage(`LedgerRolloverProgress-${rollover.id}`, true);
    history.push({
      pathname: `${LEDGERS_ROUTE}/${rollover.ledgerId}/view`,
      search: location.search,
    });
  }, [history, location.search, rollover.ledgerId, rollover.id]);

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
          progressCurrentClassName={isInProgress ? undefined : css.progressCompleted}
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
      {!errors.length ? null : (
        <MessageBanner type="error">
          <FormattedMessage
            id="ui-finance.ledger.rolloverInProgress.hasErrors"
            values={{ ledgerName }}
          />
          <RolloverErrorsLink
            errors={errors}
            ledgerName={ledgerName}
            toYearCode={toYearCode}
          />
        </MessageBanner>
      )}
      {!isInProgress && (
        <Layout className="marginTop1">
          <Button
            buttonStyle="primary"
            fullWidth
            onClick={closeProgress}
          >
            <FormattedMessage id="ui-finance.ledger.rolloverInProgress.close" />
          </Button>
        </Layout>
      )}
    </Pane>
  );
}

LedgerRolloverProgress.propTypes = {
  fromYearCode: PropTypes.string,
  ledgerName: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  rollover: PropTypes.object,
  errors: PropTypes.arrayOf(PropTypes.object),
  rolloverStatus: PropTypes.object,
  rolloverToFY: PropTypes.object,
};

LedgerRolloverProgress.defaultProps = {
  errors: [],
  rollover: {},
  rolloverStatus: {},
  rolloverToFY: {},
};

export default LedgerRolloverProgress;
