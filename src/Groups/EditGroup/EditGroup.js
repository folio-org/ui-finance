import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { Paneset } from '@folio/stripes/components';
import {
  useShowToast,
  LoadingPane,
} from '@folio/stripes-acq-components';

import { GROUP_VIEW_ROUTE } from '../../common/const';
import { groupByUrlIdResource } from '../../common/resources';
import GroupForm from '../GroupForm';

const EditGroup = ({ resources, mutator, match, history }) => {
  const groupId = match.params.id;

  useEffect(
    () => {
      mutator.groupEdit.reset();
      mutator.groupEdit.GET();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groupId],
  );

  const showToast = useShowToast();

  const closeEdit = useCallback(
    () => {
      history.push(`${GROUP_VIEW_ROUTE}${groupId}?layer=view`);
    },
    [groupId, history],
  );

  const saveGroup = useCallback(
    async (group) => {
      try {
        const savedGroup = await mutator.groupEdit.PUT(group);

        showToast('ui-finance.groups.actions.save.success');
        setTimeout(() => closeEdit(), 0);

        return savedGroup;
      } catch (response) {
        showToast('ui-finance.groups.actions.save.error', 'error');

        return { id: 'Unable to edit group' };
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [closeEdit, mutator.groupEdit],
  );

  const hasLoaded = get(resources, ['groupEdit', 'hasLoaded']);
  const group = get(resources, ['groupEdit', 'records', '0']);

  return hasLoaded
    ? (
      <GroupForm
        initialValues={group}
        onSubmit={saveGroup}
        onCancel={closeEdit}
      />
    )
    : (
      <Paneset>
        <LoadingPane onClose={closeEdit} />
      </Paneset>
    );
};

EditGroup.manifest = Object.freeze({
  groupEdit: {
    ...groupByUrlIdResource,
    accumulate: true,
  },
});

EditGroup.propTypes = {
  resources: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};

export default withRouter(stripesConnect(EditGroup));
