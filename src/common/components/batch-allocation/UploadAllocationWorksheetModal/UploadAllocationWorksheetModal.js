import localforage from 'localforage';
import PropTypes from 'prop-types';
import {
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { useShowCallout } from '@folio/stripes-acq-components';

import {
  BATCH_ALLOCATION_ROUTES_DICT,
  BATCH_ALLOCATIONS_SOURCE,
  BATCH_ALLOCATIONS_UPLOAD_STORAGE_KEY,
} from '../../../const';
import { UploadAllocationWorksheetModalForm } from './UploadAllocationWorksheetModalForm';
import { resolveFiscalYearId } from './utils';

export const UploadAllocationWorksheetModal = ({
  open,
  sourceType,
  toggle,
}) => {
  const history = useHistory();
  const location = useLocation();
  const { id: sourceId } = useParams();

  const ky = useOkapiKy();
  const [storageKey] = useNamespace({ key: BATCH_ALLOCATIONS_UPLOAD_STORAGE_KEY });
  const showCallout = useShowCallout();

  const onSubmit = async ({ file }) => {
    const { data, fileName } = file;

    const fiscalYearId = await resolveFiscalYearId(ky)(data);

    if (!fiscalYearId) {
      showCallout({
        messageId: 'ui-finance.batchAllocations.uploadWorksheet.validation.error.fiscalYearNotResolved',
        type: 'error',
      });

      return;
    }

    await localforage.setItem(
      storageKey,
      {
        data,
        fileName,
        fiscalYearId,
      },
    );

    toggle();

    history.push({
      pathname: `${BATCH_ALLOCATION_ROUTES_DICT[sourceType]}/${sourceId}/batch-allocations/upload/${fiscalYearId}`,
      state: {
        backPathname: `${location.pathname}${location.search}`,
      },
    });
  };

  return (
    <UploadAllocationWorksheetModalForm
      open={open}
      onSubmit={onSubmit}
      toggle={toggle}
    />
  );
};

UploadAllocationWorksheetModal.propTypes = {
  open: PropTypes.bool.isRequired,
  sourceType: PropTypes.oneOf(Object.values(BATCH_ALLOCATIONS_SOURCE)).isRequired,
  toggle: PropTypes.func.isRequired,
};
