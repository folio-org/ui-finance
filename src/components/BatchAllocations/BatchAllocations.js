import {
  Route,
  Switch,
  useRouteMatch,
} from 'react-router-dom';

import { CreateBatchAllocations } from './CreateBatchAllocations';
import { UploadBatchAllocations } from './UploadBatchAllocations';

export const BatchAllocations = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route
        path={`${match.path}/create/:fiscalYearId/:sourceType`}
        component={CreateBatchAllocations}
      />
      <Route
        path={`${match.path}/upload/:fiscalYearId/:sourceType`}
        component={UploadBatchAllocations}
      />
    </Switch>
  );
};
