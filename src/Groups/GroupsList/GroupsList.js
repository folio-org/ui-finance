import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  SearchAndSort,
  makeQueryFunction,
} from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';

import packageInfo from '../../../package';
import {
  GROUPS_API,
  GROUPS_ROUTE,
} from '../../common/const';
import FinanceNavigation from '../../common/FinanceNavigation';
import GroupDetails from '../GroupDetails';

const groupsPackageInfo = {
  ...packageInfo,
  stripes: {
    ...packageInfo.stripes,
    route: GROUPS_ROUTE,
  },
};

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;
const FILTER_CONFIG = [];

const visibleColumns = ['name', 'code'];
const columnMapping = {
  name: <FormattedMessage id="ui-finance.groups.list.name" />,
  code: <FormattedMessage id="ui-finance.groups.list.code" />,
};

const renderNavigation = () => (
  <FinanceNavigation />
);

const GroupsList = ({
  resources,
  mutator,
  stripes,
}) => {
  return (
    <div data-test-groups-list>
      <SearchAndSort
        packageInfo={groupsPackageInfo}
        objectName="group"
        baseRoute={groupsPackageInfo.stripes.route}
        initialResultCount={INITIAL_RESULT_COUNT}
        resultCountIncrement={RESULT_COUNT_INCREMENT}
        viewRecordComponent={GroupDetails}
        visibleColumns={visibleColumns}
        columnMapping={columnMapping}
        viewRecordPerms="invoice.invoices.item.get"
        newRecordPerms="invoice.invoices.item.post"
        parentResources={resources}
        parentMutator={mutator}
        stripes={stripes}
        filterConfig={FILTER_CONFIG}
        renderNavigation={renderNavigation}
      />
    </div>
  );
};

GroupsList.manifest = Object.freeze({
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  records: {
    type: 'okapi',
    clear: true,
    records: 'groups',
    recordsRequired: '%{resultCount}',
    path: GROUPS_API,
    perRequest: RESULT_COUNT_INCREMENT,
    throwErrors: false,
    GET: {
      params: {
        query: makeQueryFunction(
          'cql.allRecords=1',
          '',
          {},
          FILTER_CONFIG,
        ),
      },
      staticFallback: { params: {} },
    },
  },
});

GroupsList.propTypes = {
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default stripesConnect(GroupsList);
