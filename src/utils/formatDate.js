export const formatDate = (timestamp) => {
    const inputDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
  
    today.setHours(0, 0, 0, 0);
    yesterday.setDate(today.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);
  
    if (inputDate.getTime() === today.getTime()) {
      return "Today";
    } else if (inputDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(timestamp));
    }
  };