import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import _ from "lodash";
import queryString from 'query-string';
// Folio
import makeQueryFunction from '@folio/stripes-components/util/makeQueryFunction';
import SearchAndSort from '@folio/stripes-smart-components/lib/SearchAndSort';
import { filters2cql, initialFilterState, onChangeFilter as commonChangeFilter } from '@folio/stripes-components/lib/FilterGroups';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';
import removeQueryParam from '@folio/stripes-components/util/removeQueryParam';
import packageInfo from '../../../package';
// Components and Pages
import FundForm from './FundForm';
// import View from './View';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

const filterConfig = [
  // {
  //   label: 'Vendor Status',
  //   name: 'vendor_status',
  //   cql: 'vendor_status',
  //   values: [
  //     { name: 'Active', cql: 'active' },
  //     { name: 'Pending', cql: 'pending' },
  //     { name: 'Inactive', cql: 'inactive' },
  //   ]
  // }
];

class Fund extends Component {
  static manifest = Object.freeze({
    vendor: {
      type: 'okapi',
      records: 'vendors',
      path: 'vendor'
    },
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: 'Name',
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      records: 'ledgers',
      recordsRequired: '%{resultCount}',
      path: 'ledger',
      perRequest: RESULT_COUNT_INCREMENT,
      GET: {
        params: {
          query: (...args) => {
            /*
              This code is not DRY as it is copied from makeQueryFunction in stripes-components.
              This is necessary, as makeQueryFunction only referneces query paramaters as a data source.
              STRIPES-480 is intended to correct this and allow this query function to be replace with a call
              to makeQueryFunction.
              https://issues.folio.org/browse/STRIPES-480
            */
            const resourceData = args[2];
            console.log(resourceData);
            const sortMap = {
              Name: 'name',
              'Period Start': 'period_start',
              'Period End': 'period_end'
            };

            let cql = `(name="${resourceData.query.query}*")`;
            const filterCql = filters2cql(filterConfig, resourceData.query.filters);
            if (filterCql) {
              if (cql) {
                cql = `(${cql}) and ${filterCql}`;
              } else {
                cql = filterCql;
              }
            }

            const { sort } = resourceData.query;
            if (sort) {
              const sortIndexes = sort.split(',').map((sort1) => {
                let reverse = false;
                if (sort1.startsWith('-')) {
                  // eslint-disable-next-line no-param-reassign
                  sort1 = sort1.substr(1);
                  reverse = true;
                }
                let sortIndex = sortMap[sort1] || sort1;
                if (reverse) {
                  sortIndex = `${sortIndex.replace(' ', '/sort.descending ')}/sort.descending`;
                }
                return sortIndex;
              });

              cql += ` sortby ${sortIndexes.join(' ')}`;
            }
            console.log(cql);
            return cql;
          },
        },
        staticFallback: { params: {} },
      },
    }
  });

  constructor(props) {
    super(props);
    const query = props.location.search ? queryString.parse(props.location.search) : {};
    this.state = {
      searchTerm: query.query || '',
      sortOrder: query.sort || '',
      filters: initialFilterState(filterConfig, query.filters),
    };
    this.transitionToParams = transitionToParams.bind(this);
    this.removeQueryParam = removeQueryParam.bind(this);
  }

  render() {
    const props = this.props;
    console.log(props);
    const initialPath = (_.get(packageInfo, ['stripes', 'home']));
    const resultsFormatter = {
      'Name': data => _.get(data, ['name'], ''),
      'Code': data => _.get(data, ['code'], ''),
      'Description': data => _.get(data, ['description'], ''),
      'Period Start': data => _.get(data, ['period_start'], ''),
      'Period End': data => _.get(data, ['period_end'], '')
    }
    return (
      <div style={{width: '100%'}}>
      
        <SearchAndSort
          moduleName={packageInfo.name.replace(/.*\//, '')}
          moduleTitle={'ledger'}
          objectName="ledger"
          baseRoute={'/finance/ledger'}
          filterConfig={filterConfig}
          visibleColumns={['Name', 'Code', 'Description', 'Period Start', 'Period End']}
          resultsFormatter={resultsFormatter}
          initialFilters={this.constructor.manifest.query.initialValue.filters}
          viewRecordComponent={{}}
          editRecordComponent={LedgerForm}
          newRecordInitialValues={{}}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          finishedResourceName="perms"
          viewRecordPerms="ledger.item.get"
          newRecordPerms="ledger.item.post,login.item.post,perms.ledger.item.post"
          parentResources={props.resources}
          parentMutator={props.mutator}
        />
      </div>
    )
  }
}

export default Fund;