import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { keyBy } from 'lodash';

import {
  Checkbox,
  Col,
  Headline,
  KeyValue,
  Layout,
  Loading,
  Row,
} from '@folio/stripes/components';
import { FolioFormattedDate } from '@folio/stripes-acq-components';

import { useFiscalYearsBatch } from '../../../../common/hooks';

export const RolloverFiscalYearsView = ({ rollover }) => {
  const fromFiscalYearId = rollover?.fromFiscalYearId;
  const toFiscalYearId = rollover?.toFiscalYearId;

  const fiscalYearIds = useMemo(() => (
    [fromFiscalYearId, toFiscalYearId].filter(Boolean)
  ), [fromFiscalYearId, toFiscalYearId]);

  const { isLoading, fiscalYears } = useFiscalYearsBatch(fiscalYearIds);

  const { fromFiscalYear, toFiscalYear } = useMemo(() => {
    const fiscalYearsMap = keyBy(fiscalYears, 'id');

    return {
      fromFiscalYear: fiscalYearsMap[fromFiscalYearId],
      toFiscalYear: fiscalYearsMap[toFiscalYearId],
    };
  }, [fiscalYears, fromFiscalYearId, toFiscalYearId]);

  if (isLoading) return <Loading />;

  return (
    <>
      <Headline size="large" margin="medium" tag="h3">
        {fromFiscalYear?.code}
      </Headline>
      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-finance.ledger.rollover.periodBeginDate" />}
            value={<FolioFormattedDate value={fromFiscalYear?.periodStart} />}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-finance.ledger.rollover.periodEndDate" />}
            value={<FolioFormattedDate value={fromFiscalYear?.periodEnd} />}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-finance.budget.fiscalYear" />}
            value={toFiscalYear?.code}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <Checkbox
            checked={!!rollover?.restrictEncumbrance}
            disabled
            label={<FormattedMessage id="ui-finance.ledger.rollover.restrictEncumbranceDuringRollover" />}
          />
        </Col>
        <Col xs={3}>
          <Checkbox
            checked={!!rollover?.restrictExpenditures}
            disabled
            label={<FormattedMessage id="ui-finance.ledger.rollover.restrictExpendituresDuringRollover" />}
          />
        </Col>
        <Col xs={3}>
          <Layout className="padding-bottom-gutter">
            <Checkbox
              checked={!!rollover?.needCloseBudgets}
              disabled
              label={<FormattedMessage id="ui-finance.ledger.rollover.closeAllCurrentBudgets" />}
            />
          </Layout>
        </Col>
      </Row>
    </>
  );
};

RolloverFiscalYearsView.propTypes = {
  rollover: PropTypes.object.isRequired,
};
