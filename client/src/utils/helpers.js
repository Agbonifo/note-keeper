// client/src/utils/helpers.js

export const formatSentenceCase = (text) => {
    return text.replace(/(?<=(?:^|[.?!])\W*)[a-z]/g, (letter) => letter.toUpperCase());
}    

export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const truncateText = (text, length = 100) => {
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};

export const getInitials = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

export const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
};

export const getContrastColor = (hexColor) => {
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "#000000" : "#ffffff";
};

const getDateGroup = (date) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const messageDate = new Date(date);
  const messageDay = new Date(
    messageDate.getFullYear(),
    messageDate.getMonth(),
    messageDate.getDate()
  );

  const diffInDays = Math.floor((today - messageDay) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) {
    return messageDate.toLocaleDateString(undefined, { weekday: "long" });
  }

  return messageDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const groupMessagesByDate = (messages) => {
  if (!Array.isArray(messages)) return {};

  const grouped = {};
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  sortedMessages.forEach((message) => {
    const messageDate = new Date(message.createdAt);
    const dateKey = new Date(
      messageDate.getFullYear(),
      messageDate.getMonth(),
      messageDate.getDate()
    ).toString();

    const groupLabel = getDateGroup(message.createdAt);

    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        label: groupLabel,
        messages: [],
      };
    }

    grouped[dateKey].messages.push(message);
  });

  return grouped;
};
