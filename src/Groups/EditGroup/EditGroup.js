import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { FormattedMessage, useIntl } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import { LoadingView } from '@folio/stripes/components';
import {
  getErrorCodeFromResponse,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { GROUPS_ROUTE } from '../../common/const';
import { groupByUrlIdResource } from '../../common/resources';
import { GroupForm } from '../GroupForm';

const EditGroup = ({ resources, mutator, match, history, location }) => {
  const groupId = match.params.id;
  const intl = useIntl();

  useEffect(
    () => {
      mutator.groupEdit.reset();
      mutator.groupEdit.GET();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groupId],
  );

  const showCallout = useShowCallout();

  const closeEdit = useCallback(
    () => {
      history.push({
        pathname: `${GROUPS_ROUTE}/${groupId}/view`,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groupId, location.search],
  );

  const saveGroup = useCallback(
    async (group) => {
      try {
        const savedGroup = await mutator.groupEdit.PUT(group);

        showCallout({ messageId: 'ui-finance.groups.actions.save.success' });
        closeEdit();

        return savedGroup;
      } catch (response) {
        const errorCode = await getErrorCodeFromResponse(response);

        const errorMessage = (
          <FormattedMessage
            id={`ui-finance.groups.actions.save.error.${errorCode}`}
            defaultMessage={intl.formatMessage({ id: 'ui-finance.groups.actions.save.error.genericError' })}
          />
        );

        showCallout({
          message: errorMessage,
          type: 'error',
        });

        return { id: 'Unable to edit group' };
      }
    },
    [closeEdit, mutator.groupEdit, showCallout],
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
    : (<LoadingView onClose={closeEdit} />);
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
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(stripesConnect(EditGroup));
