import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
import { get } from 'lodash';

import {
  SearchAndSort,
  makeQueryFunction,
} from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';
import { Callout } from '@folio/stripes/components';
import {
  baseManifest,
  changeSearchIndex,
  getActiveFilters,
  handleFilterChange,
  showToast,
} from '@folio/stripes-acq-components';

import packageInfo from '../../../package';
import {
  GROUPS_API,
  GROUPS_ROUTE,
  GROUP_VIEW_ROUTE,
} from '../../common/const';
import FinanceNavigation from '../../common/FinanceNavigation';

import GroupDetails from '../GroupDetails';
import GroupForm from '../GroupForm';

import GroupsListFilters from '../GroupsListFilters';
import { filterConfig } from './GroupsListFilterConfig';
import {
  searchableIndexes,
  groupsSearchTemplate,
} from './GroupsListSearchConfig';

const groupsPackageInfo = {
  ...packageInfo,
  stripes: {
    ...packageInfo.stripes,
    route: GROUPS_ROUTE,
  },
};

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

const title = <FormattedMessage id="ui-finance.group" />;
const visibleColumns = ['name', 'code'];
const columnMapping = {
  name: <FormattedMessage id="ui-finance.groups.list.name" />,
  code: <FormattedMessage id="ui-finance.groups.list.code" />,
};

class GroupsList extends Component {
  static propTypes = {
    stripes: PropTypes.object,
    intl: intlShape.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
  };

  static manifest = Object.freeze({
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: 'name',
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      ...baseManifest,
      clear: true,
      records: 'groups',
      recordsRequired: '%{resultCount}',
      path: GROUPS_API,
      perRequest: RESULT_COUNT_INCREMENT,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            groupsSearchTemplate,
            {},
            filterConfig,
          ),
        },
        staticFallback: { params: {} },
      },
    },
  });

  constructor(props) {
    super(props);

    this.getActiveFilters = getActiveFilters.bind(this);
    this.handleFilterChange = handleFilterChange.bind(this);
    this.changeSearchIndex = changeSearchIndex.bind(this);
    this.callout = React.createRef();
    this.showToast = showToast.bind(this);
  }

  onCreate = async (group) => {
    const { history, mutator } = this.props;

    try {
      const savedGroup = await mutator.records.POST(group);

      this.showToast('ui-finance.groups.actions.save.success');
      history.push(`${GROUP_VIEW_ROUTE}${savedGroup.id}?layer=view`);

      return savedGroup;
    } catch (response) {
      this.showToast('ui-finance.groups.actions.save.error', 'error');

      return { id: 'Unable to create group' };
    }
  }

  renderNavigation = () => (
    <FinanceNavigation />
  );

  renderFilters = (onChange) => {
    return (
      <GroupsListFilters
        activeFilters={this.getActiveFilters()}
        onChange={onChange}
      />
    );
  };

  getTranslateSearchableIndexes() {
    const { intl: { formatMessage } } = this.props;

    return searchableIndexes.map(index => {
      const label = formatMessage({ id: `ui-finance.groups.search.${index.label}` });

      return { ...index, label };
    });
  }

  render() {
    const { resources, mutator, stripes } = this.props;

    return (
      <div data-test-groups-list>
        <SearchAndSort
          packageInfo={groupsPackageInfo}
          objectName="group"
          baseRoute={groupsPackageInfo.stripes.route}
          title={title}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          editRecordComponent={GroupForm}
          onCreate={this.onCreate}
          viewRecordComponent={GroupDetails}
          visibleColumns={visibleColumns}
          columnMapping={columnMapping}
          viewRecordPerms="finance.groups.item.get"
          newRecordPerms="finance.groups.item.post"
          parentResources={resources}
          parentMutator={mutator}
          stripes={stripes}
          onFilterChange={this.handleFilterChange}
          renderFilters={this.renderFilters}
          renderNavigation={this.renderNavigation}
          searchableIndexes={this.getTranslateSearchableIndexes()}
          selectedIndex={get(resources.query, 'qindex')}
          onChangeIndex={this.changeSearchIndex}
        />
        <Callout ref={this.callout} />
      </div>
    );
  }
}

export default stripesConnect(injectIntl(GroupsList));
