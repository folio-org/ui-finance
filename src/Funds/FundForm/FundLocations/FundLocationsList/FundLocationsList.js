import range from 'lodash/range';
import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  ConfirmationModal,
  List,
} from '@folio/stripes/components';
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

  return (
    <>
      <FieldArrayError meta={meta} />
      <List
        items={items}
        itemFormatter={itemFormatter}
        isEmptyMessage={<FormattedMessage id="ui-finance.fund.information.locations.empty" />}
      />

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
  assignedLocations: PropTypes.arrayOf(PropTypes.string),
  fields: PropTypes.shape({
    concat: PropTypes.func,
    length: PropTypes.number,
    remove: PropTypes.func,
    removeBatch: PropTypes.func,
    value: PropTypes.arrayOf(PropTypes.string),
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
