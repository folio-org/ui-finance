import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import stripesForm from '@folio/stripes/form';
import {
  Button,
  Col,
  Modal,
  ModalFooter,
  Row,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import {
  FieldSelect,
  FieldTags,
  validateRequired,
} from '@folio/stripes-acq-components';

const TRANSFER_FORM = 'transferForm';

const TransferAddModalForm = ({ handleSubmit, onClose, funds }) => {
  const footer = (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        data-test-add-transfer-save
        onClick={handleSubmit}
      >
        <FormattedMessage id="ui-finance.transaction.button.confirm" />
      </Button>
      <Button
        data-test-add-transfer-cancel
        onClick={onClose}
      >
        <FormattedMessage id="ui-finance.transaction.button.cancel" />
      </Button>
    </ModalFooter>
  );
  return (
    <Modal
      id="add-transfer-modal"
      label={<FormattedMessage id="ui-finance.transaction.transfer.title" />}
      footer={footer}
      open
    >
      <form>
        <Row>
          <Col xs>
            <FieldSelect
              dataOptions={funds}
              label={<FormattedMessage id="ui-finance.transaction.transferFrom" />}
              name="fromFundId"
            />
          </Col>

          <Col xs>
            <FieldSelect
              dataOptions={funds}
              label={<FormattedMessage id="ui-finance.transaction.transferTo" />}
              name="toFundId"
              required
              validate={validateRequired}
            />
          </Col>
        </Row>
        <Row>
          <Col xs>
            <Field
              component={TextField}
              label={<FormattedMessage id="ui-finance.transaction.amount" />}
              name="amount"
              type="number"
              required
              validate={validateRequired}
            />
          </Col>

          <Col xs>
            <FieldTags
              formName={TRANSFER_FORM}
              name="tags.tagList"
            />
          </Col>
        </Row>
        <Row>
          <Col xs>
            <Field
              component={TextArea}
              label={<FormattedMessage id="ui-finance.transaction.description" />}
              name="description"
            />
          </Col>
        </Row>
      </form>
    </Modal>
  );
};

TransferAddModalForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  funds: PropTypes.arrayOf(PropTypes.object),
};

TransferAddModalForm.defaultProps = {
  funds: [],
};

export default stripesForm({
  form: TRANSFER_FORM,
})(TransferAddModalForm);
