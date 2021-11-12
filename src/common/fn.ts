const _ = require("lodash");

export function addDays(date: Date, days: number): Date {
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
export const pickUp = (values: any, withOutValues: string[]) => {
  return values.map((value: any) => {
    return _.pick(value, withOutValues);
  });
};
