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

import {
  BATCH_ALLOCATIONS_SOURCE,
  BATCH_ALLOCATIONS_UPLOAD_STORAGE_KEY,
  FISCAL_YEARS_API,
  GROUPS_ROUTE,
  LEDGERS_ROUTE,
} from '../../const';
import { UploadAllocationWorksheetModalForm } from './UploadAllocationWorksheetModalForm';

const pathnamesDict = {
  [BATCH_ALLOCATIONS_SOURCE.group]: GROUPS_ROUTE,
  [BATCH_ALLOCATIONS_SOURCE.ledger]: LEDGERS_ROUTE,
};

const resolveFiscalYearId = (httpClient) => async (parsed) => {
  const fiscalYearCode = parsed.find(({ fiscalYear }) => Boolean(fiscalYear))?.fiscalYear;
  const searchParams = {
    query: `(code==${fiscalYearCode})`,
    limit: 1,
  };

  const response = await httpClient.get(FISCAL_YEARS_API, { searchParams }).json();

  return response.fiscalYears[0]?.id;
};

export const UploadAllocationWorksheetModal = ({
  open,
  toggle,
  sourceType,
}) => {
  const history = useHistory();
  const location = useLocation();
  const { id } = useParams();

  const ky = useOkapiKy();
  const [storageKey] = useNamespace({ key: BATCH_ALLOCATIONS_UPLOAD_STORAGE_KEY });

  const onSubmit = async ({ file }) => {
    const { data, fileName } = file;

    const fiscalYearId = await resolveFiscalYearId(ky)(data);

    if (!fiscalYearId) {
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

    history.push({
      pathname: `${pathnamesDict[sourceType]}/${id}/batch-allocations/upload/${fiscalYearId}/${sourceType}`,
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
  toggle: PropTypes.func.isRequired,
  sourceType: PropTypes.oneOf(Object.values(BATCH_ALLOCATIONS_SOURCE)).isRequired,
};
