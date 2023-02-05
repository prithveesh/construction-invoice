export const WEEKDAYS = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];

export const round = (value) => {
  return Math.round(value * 100) / 100;
};

export const calStartDate = (d) => {
  const date = new Date(d);
  d.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - date.getDay() + 1);
  return date;
};

export const getOffsetDate = (date, offset) => {
  const d = new Date(date);
  d.setDate(d.getDate() + offset);
  return d;
};
