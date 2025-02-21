import PropTypes from 'prop-types';
import {
  useMemo,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';
import {
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';

import {
  ConfirmationModal,
  Loading,
  Selection,
} from '@folio/stripes/components';

import {
  BATCH_ALLOCATION_ROUTES_DICT,
  BATCH_ALLOCATIONS_SOURCE,
} from '../../../const';
import { useUpcomingFiscalYears } from '../../../hooks';

export const BatchAllocationModal = ({
  open,
  sourceType,
  toggle,
}) => {
  const history = useHistory();
  const location = useLocation();
  const { id: sourceId } = useParams();

  const [selectedFiscalYear, setSelectedFiscalYear] = useState();

  const {
    isFetching: isFiscalYearsFetching,
    fiscalYears,
  } = useUpcomingFiscalYears(
    { sourceId, sourceType },
    {
      enabled: open,
      onSuccess: (results) => setSelectedFiscalYear(results.fiscalYears[0]?.id),
    },
  );

  const dataOptions = useMemo(() => fiscalYears?.map(({ id, code }) => ({ label: code, value: id })), [fiscalYears]);

  const isConfirmButtonDisabled = !selectedFiscalYear || isFiscalYearsFetching;

  const message = (
    <Selection
      dataOptions={dataOptions}
      disabled={isFiscalYearsFetching}
      label={<><FormattedMessage id="ui-finance.fiscalyear" /> {isFiscalYearsFetching && <Loading />}</>}
      onChange={setSelectedFiscalYear}
      value={selectedFiscalYear}
    />
  );

  const onConfirm = () => {
    toggle();

    history.push({
      pathname: `${BATCH_ALLOCATION_ROUTES_DICT[sourceType]}/batch-allocations/create/${sourceId}/${selectedFiscalYear}`,
      state: {
        backPathname: `${location.pathname}${location.search}`,
      },
    });
  };

  return (
    <ConfirmationModal
      open={open}
      onConfirm={onConfirm}
      onCancel={toggle}
      message={message}
      heading={<FormattedMessage id="ui-finance.selectFiscalYear" />}
      confirmLabel={<FormattedMessage id="stripes-components.saveAndClose" />}
      isConfirmButtonDisabled={isConfirmButtonDisabled}
    />
  );
};

BatchAllocationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  sourceType: PropTypes.oneOf(Object.values(BATCH_ALLOCATIONS_SOURCE)).isRequired,
  toggle: PropTypes.func.isRequired,
};
