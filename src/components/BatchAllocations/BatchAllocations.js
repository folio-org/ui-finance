import {
  Route,
  Switch,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { CreateBatchAllocations } from './CreateBatchAllocations';
import { UploadBatchAllocations } from './UploadBatchAllocations';

export const BatchAllocations = ({ match }) => {
  return (
    <Switch>
      <Route
        path={`${match.path}/create`}
        component={CreateBatchAllocations}
      />
      <Route
        path={`${match.path}/upload`}
        component={UploadBatchAllocations}
      />
    </Switch>
  );
};

BatchAllocations.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};
