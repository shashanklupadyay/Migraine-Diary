export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const formatTime = (time) => {
  return time;
};

export const getSeverityColor = (severity) => {
  if (severity <= 3) return "text-green-500";
  if (severity <= 6) return "text-yellow-500";
  if (severity <= 8) return "text-orange-500";
  return "text-red-500";
};

export const getSeverityBgColor = (severity) => {
  if (severity <= 3) return "bg-green-100";
  if (severity <= 6) return "bg-yellow-100";
  if (severity <= 8) return "bg-orange-100";
  return "bg-red-100";
}; 