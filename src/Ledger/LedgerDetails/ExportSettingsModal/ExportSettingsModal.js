import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

export const ExportSettingsModal = ({
  onCancel,
  onExportCSV,
  open,
}) => {
  const intl = useIntl();
  const modalLabel = intl.formatMessage({ id: 'ui-finance.exportCSV.exportSettings.heading' });

  const exportModalFooter = (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        onClick={onExportCSV}
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
      open={open}
    >

      <FormattedMessage
        id="ui-finance.exportCSV.exportSettings.message"
        tagName="p"
      />

    </Modal>
  );
};

ExportSettingsModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onExportCSV: PropTypes.func.isRequired,
  open: PropTypes.bool,
};
