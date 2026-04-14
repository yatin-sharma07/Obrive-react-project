export const addCardToColumn = (column, index, card) => {
  const newItems = [...column.items];
  newItems.splice(index, 0, { ...card, date: column.id });

  return { ...column, items: newItems };
};

export const removeCardFromColumn = (column, index) => {
  const newItems = [...column.items];
  newItems.splice(index, 1);

  return { ...column, items: newItems };
};

export const moveCardInColumn = (column, from, to) => {
  const newItems = [...column.items];
  const [moved] = newItems.splice(from, 1);
  newItems.splice(to, 0, moved);

  return { ...column, items: newItems };
};