interface DNA {
  dna: string[];
}

function isMutant(dna: string[]): boolean {
  const rows = dna.length;
  const cols = dna[0].length;

  let count = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j <= cols - 4; j++) {
      if (
        dna[i][j] === dna[i][j + 1] &&
        dna[i][j] === dna[i][j + 2] &&
        dna[i][j] === dna[i][j + 3]
      ) {
        count++;
        if (count > 1) {
          return true;
        }
      }
    }
  }

  for (let i = 0; i <= rows - 4; i++) {
    for (let j = 0; j < cols; j++) {
      if (
        dna[i][j] === dna[i + 1][j] &&
        dna[i][j] === dna[i + 2][j] &&
        dna[i][j] === dna[i + 3][j]
      ) {
        count++;
        if (count > 1) {
          return true;
        }
      }
    }
  }

  for (let i = 0; i <= rows - 4; i++) {
    for (let j = 0; j <= cols - 4; j++) {
      if (
        dna[i][j] === dna[i + 1][j + 1] &&
        dna[i][j] === dna[i + 2][j + 2] &&
        dna[i][j] === dna[i + 3][j + 3]
      ) {
        count++;
        if (count > 1) {
          return true;
        }
      }
    }
  }

  for (let i = 0; i <= rows - 4; i++) {
    for (let j = 3; j < cols; j++) {
      if (
        dna[i][j] === dna[i + 1][j - 1] &&
        dna[i][j] === dna[i + 2][j - 2] &&
        dna[i][j] === dna[i + 3][j - 3]
      ) {
        count++;
        if (count > 1) {
          return true;
        }
      }
    }
  }

  return false;
}

const result1 = isMutant([
  "ATGCGA",
  "CAGTGC",
  "TTATGT",
  "AGAAGG",
  "CCCCTA",
  "TCACTG",
]);
console.log(result1);

const result2 = isMutant([
  "ATGCGA",
  "CAGTGC",
  "TTATTT",
  "AGACGG",
  "GCGTCA",
  "TCACTG",
]);
console.log(result2);

export default isMutant;
