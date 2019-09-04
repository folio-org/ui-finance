import { GROUPS_API } from '../../../../src/common/const';

const configGroups = server => {
  server.get(GROUPS_API, (schema) => {
    return schema.groups.all();
  });

  server.get(`${GROUPS_API}/:id`, (schema, request) => {
    const schemaGroup = schema.groups.find(request.params.id) || {};

    return schemaGroup.attrs;
  });
};

export default configGroups;
