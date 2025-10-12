export function selectValueByPercentage<T>(
  data: { percent: number; value: T }[],
): T | null {
  if (data.length === 0) return null;

  const totalPercentage = data.reduce((acc, entry) => acc + entry.percent, 0);
  const randomValue = Math.random() * totalPercentage;

  let cumulativePercentage = 0;
  for (const entry of data) {
    cumulativePercentage += entry.percent;
    if (randomValue <= cumulativePercentage) {
      return entry.value;
    }
  }

  // In case of rounding errors, return the last value
  return data[data.length - 1].value;
}
