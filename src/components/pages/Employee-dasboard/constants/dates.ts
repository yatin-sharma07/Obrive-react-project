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
    date.toISOString().split("T")[0]; // ✅ key line

  return [0, 1, 2].map((i) => {
    const d = addDays(i);

    return {
      id: formatDate(d),     // 🔥 THIS is your column ID
      label: formatLabel(d), // UI label
    };
  });
};