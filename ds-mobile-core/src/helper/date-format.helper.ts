export function formatDate(date: Date, delimiter: string) {
  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join(`${delimiter}`);
}

function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}
