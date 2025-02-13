import noop from 'lodash/noop';
import { useCallback } from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import ReactRouterPropTypes from 'react-router-prop-types';

import { LoadingView } from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';
import { useSorting } from '@folio/stripes-acq-components';

import {
  LEDGERS_ROUTE,
  BATCH_ALLOCATIONS_SOURCE,
} from '../../../common/const';
import { useFiscalYear } from '../../../common/hooks';
import { BatchAllocationsFormContainer } from '../BatchAllocationsForm';
import {
  BATCH_ALLOCATION_FORM_DEFAULT_FIELD_VALUES,
  BATCH_ALLOCATION_SORTABLE_FIELDS,
} from '../constants';
import {
  useBatchAllocation,
  useSourceData,
} from '../hooks';
import { resolveDefaultBackPathname } from '../utils';

export const CreateBatchAllocations = ({
  history,
  location,
  match,
}) => {
  const intl = useIntl();

  const { id: sourceId, fiscalYearId } = match.params;

  const sourceType = location.pathname.includes(LEDGERS_ROUTE) ?
    BATCH_ALLOCATIONS_SOURCE.ledger :
    BATCH_ALLOCATIONS_SOURCE.group;

  const backPathname = location.state?.backPathname || resolveDefaultBackPathname(sourceType, sourceId);

  const [
    sortingField,
    sortingDirection,
    changeSorting,
  ] = useSorting(noop, BATCH_ALLOCATION_SORTABLE_FIELDS);

  const {
    budgetsFunds: financeData,
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

  const onClose = useCallback(() => {
    history.push(backPathname);
  }, [history, backPathname]);

  const onSubmit = useCallback(async ({ fyFinanceData }) => {
    // TODO: https://folio-org.atlassian.net/browse/UIF-534
    console.log('fyFinanceData', fyFinanceData);

    onClose();
  }, [onClose]);

  const isLoading = (
    isFinanceDataLoading
    || isSourceDataLoading
    || isFiscalYearLoading
  );

  if (isLoading) {
    return (
      <LoadingView
        dismissible
        onClose={onClose}
      />
    );
  }

  const initialValues = {
    fyFinanceData: (
      financeData
        ?.map((item) => ({
          ...BATCH_ALLOCATION_FORM_DEFAULT_FIELD_VALUES,
          ...item,
        }))
        ?.sort((a, b) => a.fundName.localeCompare(b.fundName))
    ),
    calculatedFinanceData: null,
  };

  return (
    <>
      <TitleManager record={intl.formatMessage({ id: 'ui-finance.actions.allocations.batch' })} />
      <BatchAllocationsFormContainer
        changeSorting={changeSorting}
        fiscalYear={fiscalYear}
        headline={<FormattedMessage id="ui-finance.allocation.batch.form.title.edit" />}
        initialValues={initialValues}
        onCancel={onClose}
        onSubmit={onSubmit}
        paneSub={sourceData.name}
        paneTitle={fiscalYear?.code}
        sortingDirection={sortingDirection}
        sortingField={sortingField}
      />
    </>
  );
};

CreateBatchAllocations.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};
