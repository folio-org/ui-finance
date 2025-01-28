import PropTypes from 'prop-types';
import { useCallback } from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Field } from 'react-final-form';

import {
  Col,
  ConfirmationModal,
  Row,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import { FileUploader } from '@folio/stripes-acq-components';

import { csvToJson } from '../../../utils';
import { headersMap } from '../constants';
import { validateFile } from '../utils';

const FileUploadField = ({ input, meta }) => {
  const handleFileSelect = async (file) => {
    const rows = await csvToJson(file);

    const parsed = rows.map((row) => {
      return Object.fromEntries(
        Object
          .entries(row)
          .map(([key, value]) => {
            const header = headersMap.get(key.replace(/(^")|("$)/g, ''));

            return [header, value.replace(/(^")|("$)/g, '')];
          }),
      );
    });

    input.onChange({
      fileName: file.name,
      data: parsed,
    });
  };

  return (
    <div>
      <FileUploader onSelectFile={handleFileSelect} />
      {meta.dirty && meta.error && (
        <span style={{ color: 'red' }}>{meta.error}</span>
      )}
    </div>
  );
};

FileUploadField.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
};

const UploadAllocationWorksheetModalForm = ({
  form,
  handleSubmit,
  open,
  toggle,
  values,
}) => {
  const intl = useIntl();

  const {
    hasValidationErrors,
    pristine,
    submitting,
  } = form.getState();

  const isSubmitDisabled = pristine || hasValidationErrors || submitting;

  const validate = useCallback((value) => validateFile({ intl })(value), [intl]);

  const message = (
    <>
      <Row>
        <Col xs>
          {
            values?.file
              ? values.file.fileName
              : <FormattedMessage id="ui-finance.batchAllocations.uploadWorksheet.modal.message" />}
        </Col>
      </Row>
      <Row>
        <Col xs>
          <Field
            name="file"
            component={FileUploadField}
            validate={validate}
          />
        </Col>
      </Row>
    </>
  );

  return (
    <form>
      <ConfirmationModal
        open={open}
        onConfirm={handleSubmit}
        onCancel={toggle}
        message={message}
        heading={<FormattedMessage id="ui-finance.batchAllocations.uploadWorksheet.modal.heading" />}
        confirmLabel={<FormattedMessage id="stripes-core.button.confirm" />}
        isConfirmButtonDisabled={isSubmitDisabled}
      />
    </form>
  );
};

UploadAllocationWorksheetModalForm.propTypes = {
  form: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool,
  toggle: PropTypes.func.isRequired,
  values: PropTypes.object,
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { values: true },
})(UploadAllocationWorksheetModalForm);
