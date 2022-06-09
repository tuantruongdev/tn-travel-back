/**
 * @param {number[][]} mat
 * @param {number} k
 * @return {number[]}
 */
var kWeakestRows = function (mat, k) {
  let mr = [];
  for (let i = 0; i < mat.length; i++) {
    let kount = 0;
    for (let j = 0; j < mat[0].length; j++) {
      if (mat[i][j] == 1) {
        kount++;
      }
    }
    mr.push({ line: i, val: kount });
  }
  mr.sort((a, b) => {
    return a.val - b.val;
  });
  let i = 0;
  let sarr = [];
  while (i < k) {
    sarr.push(mr[i].line);
    i++;
  }
};
