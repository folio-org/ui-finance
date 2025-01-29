import React, { useCallback } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { LoadingView } from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';

import {
  LEDGERS_ROUTE,
  GROUPS_ROUTE,
} from '../../../common/const';
import { useFiscalYear } from '../../../common/hooks';
import { useBatchAllocation } from '../hooks';
import { BatchAllocationsForm } from '../BatchAllocationsForm';

export const CreateBatchAllocations = ({ match }) => {
  const history = useHistory();
  const location = useLocation();
  const { id, fiscalYearId } = match.params;
  const type = location.pathname.includes(LEDGERS_ROUTE) ? 'ledgerId' : 'groupId';
  const params = { query: `fiscalYearId=="${fiscalYearId}" and ${type}=="${id}"` };
  const { budgetsFunds, isLoading } = useBatchAllocation(params);

  const {
    fiscalYear,
    isLoading: isFiscalYearLoading,
  } = useFiscalYear(fiscalYearId);

  const save = useCallback(async (formValues) => {
    console.log('formValues');
    console.log(formValues);
  }, []);

  const close = useCallback(
    () => {
      history.push({
        pathname: `${type === 'ledgerId' ? LEDGERS_ROUTE : GROUPS_ROUTE}/${id}/view`,
        search: location.search,
      });
    },
    [history, location.search, id, type],
  );

  const BATCH_EDIT_TITLE = <FormattedMessage id="ui-finance.allocation.batch.form.title.edit" />;

  if (isLoading) return <LoadingView />;

  return (
    <>
      <TitleManager record="Batch Allocation" />
      <BatchAllocationsForm
        headline={BATCH_EDIT_TITLE}
        initialValues={{ budgetsFunds }}
        onCancel={close}
        onSubmit={save}
        paneSub=""
        paneTitle={fiscalYear?.code}
      />
    </>
  );
};

CreateBatchAllocations.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};
