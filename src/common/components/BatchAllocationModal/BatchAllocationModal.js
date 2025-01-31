import PropTypes from 'prop-types';
import {
  useMemo,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';

import {
  ConfirmationModal,
  Loading,
  Selection,
} from '@folio/stripes/components';

import { useUpcomingFiscalYears } from '../../hooks';

export const BatchAllocationModal = ({
  groupId,
  ledgerId,
  onConfirm,
  open,
  toggle,
}) => {
  const [selectedFiscalYear, setSelectedFiscalYear] = useState();

  const {
    isFetching: isFiscalYearsFetching,
    fiscalYears,
  } = useUpcomingFiscalYears(
    { groupId, ledgerId },
    {
      enabled: open,
      onSuccess: (results) => setSelectedFiscalYear(results.fiscalYears[0]?.id),
    },
  );

  const dataOptions = useMemo(() => fiscalYears?.map(({ id, code }) => ({ label: code, value: id })), [fiscalYears]);

  const isConfirmButtonDisabled = !selectedFiscalYear || isFiscalYearsFetching;

  const message = (
    <Selection
      label={<><FormattedMessage id="ui-finance.fiscalyear" /> {isFiscalYearsFetching && <Loading />}</>}
      dataOptions={dataOptions}
      value={selectedFiscalYear}
      onChange={setSelectedFiscalYear}
      disabled={isFiscalYearsFetching}
    />
  );

  return (
    <ConfirmationModal
      open={open}
      onConfirm={() => onConfirm(selectedFiscalYear)}
      onCancel={toggle}
      message={message}
      heading={<FormattedMessage id="ui-finance.selectFiscalYear" />}
      confirmLabel={<FormattedMessage id="stripes-components.saveAndClose" />}
      isConfirmButtonDisabled={isConfirmButtonDisabled}
    />
  );
};

BatchAllocationModal.propTypes = {
  groupId: PropTypes.string,
  ledgerId: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};
