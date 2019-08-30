import { ACQUISITIONS_UNITS_API } from '../../../../src/common/const';

const configAcquisitionsUnits = server => {
  server.get(`${ACQUISITIONS_UNITS_API}/:id`, (schema, request) => {
    return schema.acquisitionsUnits.find(request.params.id).attrs;
  });
};

export default configAcquisitionsUnits;
