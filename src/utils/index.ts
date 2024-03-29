const padWidth2 = (n: number) => ("00" + n).slice(-2);

export const formatDate = (d: Date) => {
  const days = ["日", "月", "火", "水", "木", "金", "土"];

  const year = d.getFullYear();
  const month = padWidth2(d.getMonth() + 1);
  const date = padWidth2(d.getDate());
  const day = days[d.getDay()];

  const text = `${year}-${month}-${date} (${day})`;

  return text;
};

export const formatDateTime = (d: Date) => {
  const days = ["日", "月", "火", "水", "木", "金", "土"];

  const year = d.getFullYear();
  const month = padWidth2(d.getMonth() + 1);
  const date = padWidth2(d.getDate());
  const day = days[d.getDay()];
  const hour = padWidth2(d.getHours());
  const min = padWidth2(d.getMinutes());

  const text = `${year}-${month}-${date} (${day}) ${hour}:${min}`;

  return text;
};

const now = new Date().getTime();

// if null, returns false
export const isDateWithinDay = (date: number) => {
  const delta = date - now;
  return delta > 0 && delta < 1 * 24 * 60 * 60 * 1000;
};

export const NULL_DATE = 32503680000000;
