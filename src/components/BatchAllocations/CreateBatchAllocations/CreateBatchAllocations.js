import React, { useCallback, useMemo } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
import { useIntl } from 'react-intl';

import { LoadingView } from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';

import {
  LEDGERS_ROUTE,
  GROUPS_ROUTE,
} from '../../../common/const';
import { useBatchAllocation } from '../hooks';
import { BatchAllocationsForm } from '../BatchAllocationsForm';

export const CreateBatchAllocations = ({ match }) => {
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const { id, fiscalYearId } = match.params;
  const type = location.pathname.includes(LEDGERS_ROUTE) ? 'ledgerId' : 'groupId';
  const params = { query: `fiscalYearId=="${fiscalYearId}" and ${type}=="${id}"` };
  const { budgetsFunds, isLoading } = useBatchAllocation(params);

  const initialValues = useMemo(() => {
    return budgetsFunds.reduce((acc, value, index) => {
      acc[`index-${index}`] = value;

      return acc;
    }, {});
  }, [budgetsFunds]);

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

  if (isLoading) return <LoadingView />;

  return (
    <>
      <TitleManager record="paneLedgerName" />
      <BatchAllocationsForm
        onSubmit={save}
        initialValues={initialValues}
        onCancel={close}
      />
    </>
  );
};

CreateBatchAllocations.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};
