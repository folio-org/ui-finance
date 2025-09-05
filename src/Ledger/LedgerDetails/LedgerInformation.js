import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Checkbox,
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { AcqUnitsView } from '@folio/stripes-acq-components';

import { LedgerDetailsFiscalYear } from './LedgerDetailsFiscalYear';

const LedgerInformation = ({
  ledger,
  onSelectFiscalYear,
  selectedFiscalYear,
}) => {
  const {
    acqUnitIds,
    code,
    description,
    fiscalYearOneId,
    id,
    metadata,
    name,
    restrictEncumbrance,
    restrictExpenditures,
    ledgerStatus: status,
  } = ledger;

  return (
    <>
      <ViewMetaData metadata={metadata} />
      <Row>
        <Col
          data-test-ledger-information-name
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.ledger.name" />}
            value={name}
          />
        </Col>

        <Col
          data-test-ledger-information-code
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-finance.ledger.code" />}
            value={code}
          />
        </Col>

        <Col
          data-test-ledger-information-fiscal-year
          xs={3}
        >
          <LedgerDetailsFiscalYear
            fiscalYearOneId={fiscalYearOneId}
            ledgerId={id}
            onSelectFiscalYear={onSelectFiscalYear}
            selectedFiscalYear={selectedFiscalYear}
          />
        </Col>

        <Col
          data-test-ledger-information-status
          xs={3}
        >
          <KeyValue label={<FormattedMessage id="ui-finance.ledger.status" />}>
            {status && <FormattedMessage id={`ui-finance.ledger.status.${status.toLowerCase()}`} />}
          </KeyValue>
        </Col>

        <Col xs={3}>
          <AcqUnitsView units={acqUnitIds} />
        </Col>

        <Col xs={3}>
          <Checkbox
            checked={restrictEncumbrance}
            disabled
            label={<FormattedMessage id="ui-finance.ledger.rollover.restrictEncumbrance" />}
            vertical
          />
        </Col>

        <Col xs={3}>
          <Checkbox
            checked={restrictExpenditures}
            disabled
            label={<FormattedMessage id="ui-finance.ledger.rollover.restrictExpenditures" />}
            vertical
          />
        </Col>

        <Col xs={9}>
          <KeyValue
            data-testid="description"
            label={<FormattedMessage id="ui-finance.ledger.description" />}
            value={description || <NoValue />}
          />
        </Col>
      </Row>
    </>
  );
};

LedgerInformation.propTypes = {
  ledger: PropTypes.shape({
    acqUnitIds: PropTypes.arrayOf(PropTypes.string),
    code: PropTypes.string.isRequired,
    description: PropTypes.string,
    fiscalYearOneId: PropTypes.string,
    id: PropTypes.string.isRequired,
    metadata: PropTypes.shape({}),
    name: PropTypes.string.isRequired,
    restrictEncumbrance: PropTypes.bool.isRequired,
    restrictExpenditures: PropTypes.bool.isRequired,
    status: PropTypes.string,
  }).isRequired,
  onSelectFiscalYear: PropTypes.func.isRequired,
  selectedFiscalYear: PropTypes.string,
};

export default LedgerInformation;
