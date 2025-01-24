import PropTypes from 'prop-types';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import {
  Col,
  ConfirmationModal,
  Row,
} from '@folio/stripes/components';
import { FileUploader } from '@folio/stripes-acq-components';

import { EXPORT_ALLOCATION_WORKSHEET_FIELDS } from '../../const';
import { csvToJson } from '../../utils';

const headersMap = new Map(
  Object
    .entries(EXPORT_ALLOCATION_WORKSHEET_FIELDS)
    .map(([key, value]) => [value, key]),
);

export const UploadAllocationWorksheetModal = ({
  open,
  toggle,
}) => {
  const history = useHistory();
  const [uploadedFile, setUploadedFile] = useState();

  const onConfirm = async () => {
    const rows = await csvToJson(uploadedFile);

    /* TODO: validate CSV */

    const parsed = rows.map((row) => {
      return Object.fromEntries(
        Object
          .entries(row)
          .map(([key, value]) => {
            const header = headersMap.get(key.replace(/^"|"$/g, ''));

            return [header, value.replace(/^"|"$/g, '')];
          }),
      );
    });

    console.log('parsed', parsed);

    history.push({
      pathname: '/finance/batch-allocations/upload',
    });
  };

  const message = (
    <>
      <Row>
        <Col xs>
          {uploadedFile ? uploadedFile.name : <FormattedMessage id="ui-finance.uploadWorksheet.modal.message" />}
        </Col>
      </Row>
      <Row>
        <Col xs>
          <FileUploader onSelectFile={setUploadedFile} />
        </Col>
      </Row>
    </>
  );

  return (
    <ConfirmationModal
      open={open}
      onConfirm={onConfirm}
      onCancel={toggle}
      message={message}
      heading={<FormattedMessage id="ui-finance.uploadWorksheet.modal.heading" />}
      confirmLabel={<FormattedMessage id="stripes-core.button.confirm" />}
      isConfirmButtonDisabled={!uploadedFile}
    />
  );
};

UploadAllocationWorksheetModal.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};
