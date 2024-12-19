export function removeFromArray<T>(arr: T[], item: T) {
  const i = arr.indexOf(item);
  if (i !== -1) {
    arr.splice(i, 1);
  }
  return arr;
}
