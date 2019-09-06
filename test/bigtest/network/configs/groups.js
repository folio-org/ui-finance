import { GROUPS_API } from '../../../../src/common/const';

const configGroups = server => {
  server.get(GROUPS_API, (schema) => {
    return schema.groups.all();
  });

  server.get(`${GROUPS_API}/:id`, (schema, request) => {
    const schemaGroup = schema.groups.find(request.params.id) || {};

    return schemaGroup.attrs;
  });

  server.post(GROUPS_API, (schema, request) => {
    const attrs = JSON.parse(request.requestBody) || {};

    return schema.groups.create(attrs).attrs;
  });

  server.put(`${GROUPS_API}/:id`, () => null);

  server.delete(`${GROUPS_API}/:id`, 'group');
};

export default configGroups;
