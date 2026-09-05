export const getElapsed = (createdAt) => {
  const now = new Date();
  const created = new Date(createdAt);

  const diff = Math.max(0, Math.floor((now - created) / 1000));
  const min = Math.floor(diff / 60);
  const sec = diff % 60;

  return `${min}:${String(sec).padStart(2, "0")}`;
};

export const formatDateTime = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleString("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};