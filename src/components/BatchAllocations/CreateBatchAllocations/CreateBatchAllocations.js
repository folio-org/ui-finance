import noop from 'lodash/noop';
import { useCallback } from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { LoadingView } from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';
import { useSorting } from '@folio/stripes-acq-components';

import {
  LEDGERS_ROUTE,
  GROUPS_ROUTE,
  BATCH_ALLOCATIONS_SOURCE,
} from '../../../common/const';
import { useFiscalYear } from '../../../common/hooks';
import { BatchAllocationsForm } from '../BatchAllocationsForm';
import { BATCH_ALLOCATION_SORTABLE_FIELDS } from '../constants';
import {
  useBatchAllocation,
  useSourceData,
} from '../hooks';

export const CreateBatchAllocations = ({ match }) => {
  const history = useHistory();
  const location = useLocation();
  const intl = useIntl();

  const { id: sourceId, fiscalYearId } = match.params;

  const sourceType = location.pathname.includes(LEDGERS_ROUTE) ?
    BATCH_ALLOCATIONS_SOURCE.ledger :
    BATCH_ALLOCATIONS_SOURCE.group;

  const [
    sortingField,
    sortingDirection,
    changeSorting,
  ] = useSorting(noop, BATCH_ALLOCATION_SORTABLE_FIELDS);

  const {
    budgetsFunds,
    isLoading: isFinanceDataLoading,
  } = useBatchAllocation({
    fiscalYearId,
    sortingDirection,
    sortingField,
    sourceId,
    sourceType,
  });

  const {
    data: sourceData,
    isLoading: isSourceDataLoading,
  } = useSourceData(sourceType, sourceId);

  const {
    fiscalYear,
    isLoading: isFiscalYearLoading,
  } = useFiscalYear(fiscalYearId);

  const save = useCallback(async (formValues) => {
    console.log('formValues');
    console.log(formValues);
  }, []);

  const close = useCallback(() => {
    history.push({
      pathname: `${sourceType === BATCH_ALLOCATIONS_SOURCE.ledger ? LEDGERS_ROUTE : GROUPS_ROUTE}/${sourceId}/view`,
      search: location.search,
    });
  }, [history, location.search, sourceId, sourceType]);

  const isLoading = (
    isFinanceDataLoading
    || isSourceDataLoading
    || isFiscalYearLoading
  );

  if (isLoading) return <LoadingView />;

  return (
    <>
      <TitleManager record={intl.formatMessage({ id: 'ui-finance.actions.allocations.batch' })} />
      <BatchAllocationsForm
        changeSorting={changeSorting}
        headline={<FormattedMessage id="ui-finance.allocation.batch.form.title.edit" />}
        initialValues={{ budgetsFunds }}
        onCancel={close}
        onSubmit={save}
        paneSub={sourceData.name}
        paneTitle={fiscalYear?.code}
        sortingDirection={sortingDirection}
        sortingField={sortingField}
      />
    </>
  );
};

CreateBatchAllocations.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};
