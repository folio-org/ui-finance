import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Checkbox,
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';
import { AcqUnitsView } from '@folio/stripes-acq-components';

import { ViewFundGroups } from '../FundGroups';
import AllocatedFunds from './AllocatedFunds';
import FundLedger from './FundLedger';
import FundType from './FundType';

const DEFAULT_ACQ_UNIT_IDS = [];
const DEFAULT_GROUP_IDS = [];
const DEFAULT_FUND = {};

const FundDetails = ({
  acqUnitIds = DEFAULT_ACQ_UNIT_IDS,
  currency,
  fund = DEFAULT_FUND,
  groupIds = DEFAULT_GROUP_IDS,
}) => (
  <>
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
        <FundLedger ledgerId={fund.ledgerId} />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-finance.fund.information.status" />}
          value={fund.fundStatus}
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          data-testid="currency"
          label={<FormattedMessage id="ui-finance.fund.information.currency" />}
          value={currency || <NoValue />}
        />
      </Col>
      <Col xs={3}>
        <FundType fundTypeId={fund.fundTypeId} />
      </Col>
      <Col xs={3}>
        <ViewFundGroups groupIds={groupIds} />
      </Col>
      <Col xs={3}>
        <AcqUnitsView units={acqUnitIds} />
      </Col>
      <Col xs={3}>
        <AllocatedFunds
          fundIds={fund.allocatedFromIds}
          labelId="ui-finance.fund.information.transferFrom"
        />
      </Col>
      <Col xs={3}>
        <AllocatedFunds
          fundIds={fund.allocatedToIds}
          labelId="ui-finance.fund.information.transferTo"
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-finance.fund.information.externalAccount" />}
          value={fund.externalAccountNo}
        />
      </Col>
      <Col xs={3}>
        <Checkbox
          checked={fund.restrictByLocations}
          disabled
          label={<FormattedMessage id="ui-finance.fund.information.restrictByLocations" />}
          vertical
        />
      </Col>
    </Row>
    <Row>
      <Col xs={12}>
        <KeyValue
          data-testid="description"
          label={<FormattedMessage id="ui-finance.fund.information.description" />}
          value={fund.description || <NoValue />}
        />
      </Col>
    </Row>
  </>
);

FundDetails.propTypes = {
  acqUnitIds: PropTypes.arrayOf(PropTypes.string),
  currency: PropTypes.string,
  fund: PropTypes.object,
  groupIds: PropTypes.arrayOf(PropTypes.string),
};

export default FundDetails;
