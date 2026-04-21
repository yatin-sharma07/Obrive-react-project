export const getNext3Days = () => {
  const today = new Date();

  const format = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  const addDays = (date: Date, days: number) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
  };

  return [
    {
      id: "today",
      label: format(today),
      date: today.toISOString(),
    },
    {
      id: "tomorrow",
      label: format(addDays(today, 1)),
      date: addDays(today, 1).toISOString(),
    },
    {
      id: "dayAfterTomorrow",
      label: format(addDays(today, 2)),
      date: addDays(today, 2).toISOString(),
    },
  
  ];
};