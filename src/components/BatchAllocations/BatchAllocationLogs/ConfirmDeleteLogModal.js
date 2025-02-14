import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ConfirmationModal } from '@folio/stripes/components';

export const ConfirmDeleteLogModal = ({
  onCancel,
  onConfirm,
  open,
}) => {
  return (
    <ConfirmationModal
      id="delete-batch-allocation-log"
      open={open}
      heading={<FormattedMessage id="ui-finance.allocation.batch.logs.modal.delete.title" />}
      message={<FormattedMessage id="ui-finance.allocation.batch.logs.modal.delete.description" />}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmLabel={<FormattedMessage id="ui-finance.transaction.button.confirm" />}
    />
  );
};

ConfirmDeleteLogModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool,
};
