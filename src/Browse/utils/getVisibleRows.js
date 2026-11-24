/*
  Flattens the hierarchy into the rows that are currently displayed:
  children of a node are only included when the node is expanded.
*/
export const getVisibleRows = (hierarchy, expandedKeys) => {
  const rows = [];

  const visit = (node, level) => {
    const isExpanded = expandedKeys.has(node.key);

    rows.push({ node, level, isExpanded });

    if (isExpanded) node.children.forEach(child => visit(child, level + 1));
  };

  hierarchy.forEach(node => visit(node, 0));

  return rows;
};
