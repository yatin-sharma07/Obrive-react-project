export const getNext3Days = () => {
  const today = new Date();

  const formatLabel = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  const addDays = (days: number) => {
    const d = new Date();
    d.setDate(today.getDate() + days);
    return d;
  };

  const formatDate = (date: Date) =>
    date.toISOString().split("T")[0];

  return Array.from({ length: 3 }, (_, i) => {
    const d = addDays(i);

    return {
      id: formatDate(d),
      label: formatLabel(d),
    };
  });
};

export const getNext60Days = () => {
  const today = new Date();

  const addDays = (days: number) => {
    const d = new Date();
    d.setDate(today.getDate() + days);
    return d;
  };

  const formatDate = (date: Date) =>
    date.toISOString().split("T")[0];

  return Array.from({ length: 60 }, (_, i) => {
    const d = addDays(i);
    return formatDate(d);
  });
};