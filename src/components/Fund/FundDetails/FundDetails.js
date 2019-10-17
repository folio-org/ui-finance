import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  KeyValue,
} from '@folio/stripes/components';
import { AcqUnitsView } from '@folio/stripes-acq-components';

import { ViewFundGroups } from '../FundGroups';

const FundDetails = ({
  acqUnitIds,
  allocatedFrom,
  allocatedTo,
  currency,
  fund,
  fundType,
  ledgerName,
}) => (
  <Fragment>
    <Row>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-finance.fund.information.name" />}
          value={fund.name}
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-finance.fund.information.code" />}
          value={fund.code}
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-finance.fund.information.ledger" />}
          value={ledgerName}
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-finance.fund.information.status" />}
          value={fund.fundStatus}
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-finance.fund.information.currency" />}
          value={currency}
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-finance.fund.information.type" />}
          value={fundType}
        />
      </Col>
      <Col xs={3}>
        <ViewFundGroups fundId={fund.id} />
      </Col>
      <Col xs={3}>
        <AcqUnitsView units={acqUnitIds} />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-finance.fund.information.transferFrom" />}
          value={allocatedFrom}
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-finance.fund.information.transferTo" />}
          value={allocatedTo}
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-finance.fund.information.externalAccount" />}
          value={fund.externalAccountNo}
        />
      </Col>
    </Row>
    <Row>
      <Col xs={12}>
        <KeyValue
          label={<FormattedMessage id="ui-finance.fund.information.description" />}
          value={fund.description}
        />
      </Col>
    </Row>
  </Fragment>
);

FundDetails.propTypes = {
  acqUnitIds: PropTypes.arrayOf(PropTypes.string),
  allocatedFrom: PropTypes.string,
  allocatedTo: PropTypes.string,
  currency: PropTypes.string,
  fund: PropTypes.object,
  fundType: PropTypes.string,
  ledgerName: PropTypes.string,
};

FundDetails.defaultProps = {
  acqUnitIds: [],
  allocatedFrom: '',
  allocatedTo: '',
  currency: '',
  fund: {},
  fundType: '',
  ledgerName: '',
};

export default FundDetails;
