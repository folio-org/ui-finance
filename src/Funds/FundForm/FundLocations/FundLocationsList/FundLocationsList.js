import groupBy from 'lodash/groupBy';
import range from 'lodash/range';
import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Button,
  ConfirmationModal,
  Layout,
  List,
} from '@folio/stripes/components';
import {
  checkIfUserInCentralTenant,
  useStripes,
} from '@folio/stripes/core';
import { FindLocation } from '@folio/stripes-acq-components';

import { FieldArrayError } from '../../../../common/FieldArrayError';
import { FundLocationsListItem } from './FundLocationsListItem';

import css from './FundLocationsList.css';

const SCOPE_TRANSLATION_ID = 'ui-finance.fund.information.locations';
const DEFAULT_VALUE = [];

export const FundLocationsList = ({
  assignedLocations,
  fields,
  locations,
  meta,
}) => {
  const {
    value = DEFAULT_VALUE,
    concat,
    length,
    remove,
    removeBatch,
  } = fields;

  const stripes = useStripes();

  const [isUnassignModalOpen, setIsUnassignModalOpen] = useState(false);

  const items = useMemo(() => {
    return value
      .map(({ locationId }) => locations.find(location => location.id === locationId) || {})
      .sort((a, b) => a?.name?.localeCompare(b?.name));
  }, [value, locations]);

  const assignedLocationIds = useMemo(() => assignedLocations.map(({ locationId }) => locationId), [assignedLocations]);

  const onRemove = useCallback((location) => {
    const indexToRemove = value.findIndex(({ locationId }) => locationId === location.id);

    if (indexToRemove > -1) {
      remove(indexToRemove);
    }
  }, [value, remove]);

  const itemFormatter = useCallback((location, index) => {
    return (
      <FundLocationsListItem
        key={location.id}
        location={location}
        index={index}
        onRemove={onRemove}
      />
    );
  }, [onRemove]);

  const removeAll = useCallback(() => removeBatch(range(0, length)), [length, removeBatch]);

  const onRecordsSelect = useCallback((records) => {
    const normalizedLocations = records.map((location) => ({
      locationId: location.id,
    }));

    removeAll();
    concat(normalizedLocations);
  }, [concat, removeAll]);

  const openUnassignModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUnassignModalOpen(true);
  };

  const closeIsUnassignModal = () => setIsUnassignModalOpen(false);

  const unassignAll = () => {
    removeAll();
    closeIsUnassignModal();
  };

  const isCurrentTenantConsortiumCentral = checkIfUserInCentralTenant(stripes);

  const userTenantsMap = useMemo(() => {
    return (stripes?.user?.user?.tenants ?? []).reduce((acc, tenant) => acc.set(tenant.id, tenant), new Map());
  }, [stripes?.user?.user?.tenants]);

  const renderTenantsGroupedList = useCallback((ungroupedItems) => {
    const groupedItemsEntries = Object.entries(groupBy(ungroupedItems, 'tenantId'));

    if (!ungroupedItems.length) {
      return (
        <p className={css.isEmptyMessage}>
          <FormattedMessage id="ui-finance.fund.information.locations.empty" />
        </p>
      );
    }

    return (
      <Layout className="margin-start-gutter">
        {
          groupedItemsEntries
            .sort((a, b) => b.name?.localeCompare(a.name))
            .map(([tenantId, tenantLocations]) => (
              <Accordion
                label={userTenantsMap.get(tenantId)?.name}
                id={`${tenantId}-locations`}
                key={tenantId}
              >
                <List
                  items={tenantLocations}
                  itemFormatter={itemFormatter}
                  isEmptyMessage={<FormattedMessage id="ui-finance.fund.information.locations.empty" />}
                />
              </Accordion>
            ))
        }
      </Layout>
    );
  }, [itemFormatter, userTenantsMap]);

  const list = useMemo(() => {
    return isCurrentTenantConsortiumCentral
      ? renderTenantsGroupedList(items)
      : (
        <List
          items={items}
          itemFormatter={itemFormatter}
          isEmptyMessage={<FormattedMessage id="ui-finance.fund.information.locations.empty" />}
        />
      );
  }, [
    isCurrentTenantConsortiumCentral,
    itemFormatter,
    items,
    renderTenantsGroupedList,
  ]);

  return (
    <>
      <FieldArrayError meta={meta} />
      {list}

      <div className={css.actions}>
        <FindLocation
          id="fund-locations"
          isMultiSelect
          searchLabel={<FormattedMessage id={`${SCOPE_TRANSLATION_ID}.action.add`} />}
          initialSelected={assignedLocationIds}
          onRecordsSelect={onRecordsSelect}
        />

        <Button
          buttonClass={css.unassignAll}
          disabled={!assignedLocations.length}
          id="clickable-remove-all-locations"
          onClick={openUnassignModal}
        >
          <FormattedMessage id={`${SCOPE_TRANSLATION_ID}.action.removeAll`} />
        </Button>
      </div>

      <ConfirmationModal
        open={isUnassignModalOpen}
        heading={<FormattedMessage id={`${SCOPE_TRANSLATION_ID}.action.removeAll`} />}
        message={<FormattedMessage id={`${SCOPE_TRANSLATION_ID}.action.removeAll.confirm.message`} />}
        onConfirm={unassignAll}
        onCancel={closeIsUnassignModal}
      />
    </>
  );
};

FundLocationsList.defaultProps = {
  assignedLocations: [],
  locations: [],
};

FundLocationsList.propTypes = {
  assignedLocations: PropTypes.arrayOf(PropTypes.object),
  fields: PropTypes.shape({
    concat: PropTypes.func,
    length: PropTypes.number,
    remove: PropTypes.func,
    removeBatch: PropTypes.func,
    value: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  locations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    code: PropTypes.string,
  })),
  meta: PropTypes.shape({
    error: PropTypes.node,
  }),
};
