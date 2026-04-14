type Task = {
  id: string;
  title: string;
  duration: string;
  column: string;
  color: string;
  date?: string; 
};

type Column = {
  id: string;
  label?: string;
  items: Task[];
};

export const addCardToColumn = (
  column: Column,
  index: number,
  card: Task
): Column => {
  const newItems = [...column.items];
  newItems.splice(index, 0, { ...card, date: column.id });

  return { ...column, items: newItems };
};

export const removeCardFromColumn = (
  column: Column,
  index: number
): Column => {
  const newItems = [...column.items];
  newItems.splice(index, 1);

  return { ...column, items: newItems };
};

export const moveCardInColumn = (
  column: Column,
  from: number,
  to: number
): Column => {
  const newItems = [...column.items];
  const [moved] = newItems.splice(from, 1);
  newItems.splice(to, 0, moved);

  return { ...column, items: newItems };
};