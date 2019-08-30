export const expandAll = (allSections, setSections) => (
  setSections(allSections)
);

export const toggleSection = (id, setSections) => (
  setSections(prevState => ({ ...prevState, [id]: !prevState[id] }))
);
