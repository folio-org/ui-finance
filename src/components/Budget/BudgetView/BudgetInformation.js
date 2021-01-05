import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';
import {
  FolioFormattedDate,
} from '@folio/stripes-acq-components';

import {
  TRANSACTIONS_ROUTE,
} from '../../../common/const';

const BudgetInformation = ({
  allowableEncumbrance,
  allowableExpenditure,
  budgetStatus,
  fiscalEnd,
  fiscalStart,
  name,
  id,
}) => (
  <Row>
    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.name" />}
        value={name}
      />
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.allocationDate" />}
        value={<NoValue />}
      />
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.status" />}
        value={budgetStatus}
      />
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.actionsRequired" />}
        value={<NoValue />}
      />
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.fiscalStart" />}
      >
        <FolioFormattedDate value={fiscalStart} />
      </KeyValue>
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.fiscalEnd" />}
      >
        <FolioFormattedDate value={fiscalEnd} />
      </KeyValue>
    </Col>

    <Col xs={3}>
      <KeyValue label={<FormattedMessage id="ui-finance.budget.allowableExpenditure" />}>
        {allowableExpenditure == null ? <NoValue /> : `${allowableExpenditure}%`}
      </KeyValue>
    </Col>

    <Col xs={3}>
      <KeyValue label={<FormattedMessage id="ui-finance.budget.allowableEncumbrance" />}>
        {allowableEncumbrance == null ? <NoValue /> : `${allowableEncumbrance}%`}
      </KeyValue>
    </Col>

    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id="ui-finance.budget.transactions" />}
      >
        <Link to={`${TRANSACTIONS_ROUTE}/budget/${id}`}>
          <FormattedMessage id="ui-finance.budget.transactions.view" />
        </Link>
      </KeyValue>
    </Col>
  </Row>
);

BudgetInformation.propTypes = {
  allowableEncumbrance: PropTypes.number,
  allowableExpenditure: PropTypes.number,
  budgetStatus: PropTypes.string,
  expenditures: PropTypes.number,
  fiscalEnd: PropTypes.string,
  fiscalStart: PropTypes.string,
  fiscalYearCurrency: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
};

BudgetInformation.defaultProps = {
  budgetStatus: '',
  fiscalEnd: '',
  fiscalStart: '',
  name: '',
};

export default BudgetInformation;
