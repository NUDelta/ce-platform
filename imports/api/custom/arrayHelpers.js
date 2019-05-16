export const setIntersection = function (A, B) {
  let A_with_string_elements = A.map((e) => {
    return JSON.stringify(e)
  });
  let B_with_string_elements = B.map((e) => {
    return JSON.stringify(e)
  });
  let beforeSet = new Set(A_with_string_elements);
  let afterSet = new Set(B_with_string_elements);

  let intersection = new Set(
    [...beforeSet].filter(x => afterSet.has(x)));

  return Array.from(intersection).map((e) => {
    return JSON.parse(e)
  });
};