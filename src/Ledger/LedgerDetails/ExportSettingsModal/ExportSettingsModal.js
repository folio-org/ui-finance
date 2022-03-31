import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Button,
  Col,
  Modal,
  ModalFooter,
  Row,
  Select,
} from '@folio/stripes/components';

import { FiscalYearField } from '../../../common/FiscalYearField';
import { getExportExpenseClassesOptions } from './utils';

const ExportSettingsModal = ({
  fiscalYear,
  handleSubmit,
  onCancel,
  values,
}) => {
  const intl = useIntl();
  const modalLabel = intl.formatMessage({ id: 'ui-finance.exportCSV.exportSettings.heading' });

  const { fiscalYearId } = values;

  const exportModalFooter = (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        onClick={handleSubmit}
        disabled={!fiscalYearId}
        marginBottom0
      >
        <FormattedMessage id="ui-finance.exportCSV.exportSettings.export" />
      </Button>
      <Button
        marginBottom0
        onClick={onCancel}
      >
        <FormattedMessage id="ui-finance.exportCSV.exportSettings.cancel" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      aria-label={modalLabel}
      footer={exportModalFooter}
      label={modalLabel}
      open
    >

      <FormattedMessage
        id="ui-finance.exportCSV.exportSettings.message"
        tagName="p"
      />

      <form>
        <Row>
          <Col xs={3}>
            <FiscalYearField
              name="fiscalYearId"
              series={fiscalYear.series}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <Field
              component={Select}
              dataOptions={getExportExpenseClassesOptions(intl)}
              id="expense-classes"
              label={<FormattedMessage id="ui-finance.exportCSV.exportSettings.expenseClasses" />}
              name="expenseClasses"
            />
          </Col>
        </Row>
      </form>

    </Modal>
  );
};

ExportSettingsModal.propTypes = {
  fiscalYear: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
};

export default stripesFinalForm({
  subscription: { values: true },
})(ExportSettingsModal);
