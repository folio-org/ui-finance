import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useForm } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Button,
  ConfirmationModal,
  Loading,
} from '@folio/stripes/components';
import {
  FindLocation,
  useLocations,
} from '@folio/stripes-acq-components';

import { FundLocationsList } from './FundLocationsList';

import css from './FundLocations.css';

const INITIAL_FILTERS = { isAssigned: [true] };
const SCOPE_TRANSLATION_ID = 'ui-finance.fund.information.locations';

export const FundLocations = ({ assignedLocations, name }) => {
  const { change } = useForm();
  const { isLoading, locations } = useLocations();

  const [isUnassignModalOpen, setIsUnassignModalOpen] = useState();

  const onRecordsSelect = useCallback((records) => {
    const locationIds = records.map(({ id }) => id);

    change(name, locationIds);
  }, [change, name]);

  const openUnassignModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUnassignModalOpen(true);
  };

  const closeIsUnassignModal = () => setIsUnassignModalOpen(false);

  const unassignAll = () => {
    change(name, []);
    closeIsUnassignModal();
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <FieldArray
        component={FundLocationsList}
        name={name}
        locations={locations}
      />

      <div className={css.actions}>
        <FindLocation
          isMultiSelect
          searchLabel={<FormattedMessage id={`${SCOPE_TRANSLATION_ID}.action.add`} />}
          initialFilters={assignedLocations.length ? INITIAL_FILTERS : undefined}
          initialSelected={assignedLocations}
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

FundLocations.defaultProps = {
  assignedLocations: [],
};

FundLocations.propTypes = {
  assignedLocations: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string.isRequired,
};
