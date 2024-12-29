// 24 & 24+ SOLVER

function solve24() {
    const nums = [
        parseFloat(document.getElementById('num1').value),
        parseFloat(document.getElementById('num2').value),
        parseFloat(document.getElementById('num3').value),
        parseFloat(document.getElementById('num4').value)
    ];

    if (nums.some(isNaN)) {
        document.getElementById('result').textContent = 'Please enter valid numbers.';
        return;
    }

    const solutions = findSolutions(nums, 24);
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = ''; // Clear previous results

    if (solutions.length > 0) {
        solutions.forEach(solution => {
            const solutionElement = document.createElement('p');  // Use <p> for new line
            solutionElement.textContent = solution;
            resultContainer.appendChild(solutionElement);
        });
    } else {
        resultContainer.textContent = 'No solutions found.';
    }
}

function solveTarget() {
    const nums = [
        parseFloat(document.getElementById('num1').value),
        parseFloat(document.getElementById('num2').value),
        parseFloat(document.getElementById('num3').value),
        parseFloat(document.getElementById('num4').value)
    ];
    const target = parseFloat(document.getElementById('target').value);

    if (nums.some(isNaN) || isNaN(target)) {
        document.getElementById('result').textContent = 'Please enter valid numbers.';
        return;
    }

    const solutions = findSolutions(nums, target);
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = ''; // Clear previous results

    if (solutions.length > 0) {
        solutions.forEach(solution => {
            const solutionElement = document.createElement('p');  // Use <p> for new line
            solutionElement.textContent = solution;
            resultContainer.appendChild(solutionElement);
        });
    } else {
        resultContainer.textContent = 'No solutions found.';
    }
}

function findSolutions(numbers, target) {
    const ops = ['+', '-', '*', '/'];
    const results = [];

    function permute(arr, m = []) {
        if (arr.length === 0) {
            checkCombination(m);
        } else {
            for (let i = 0; i < arr.length; i++) {
                const curr = arr.slice();
                const next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next));
            }
        }
    }

    function checkCombination(nums) {
        function evalExpr(a, b, op) {
            if (op === '/' && b === 0) return null;
            return eval(`${a} ${op} ${b}`);
        }

        function dfs(vals, expr) {
            if (vals.length === 1) {
                if (Math.abs(vals[0] - target) < 1e-6) {
                    results.push(expr[0]);
                }
                return;
            }

            for (let i = 0; i < vals.length; i++) {
                for (let j = 0; j < vals.length; j++) {
                    if (i !== j) {
                        const remaining = vals.filter((_, idx) => idx !== i && idx !== j);
                        const a = vals[i], b = vals[j];

                        ops.forEach(op => {
                            const result = evalExpr(a, b, op);
                            if (result !== null) {
                                dfs([result, ...remaining], [
                                    `(${expr[i]} ${op} ${expr[j]})`,
                                    ...expr.filter((_, idx) => idx !== i && idx !== j)
                                ]);
                            }
                        });
                    }
                }
            }
        }

        dfs(nums, nums.map(String));
    }

    permute(numbers);
    return [...new Set(results)];
}

// atas clear

// CLUE SOLVER
// Fungsi untuk memeriksa kecocokan dengan petunjuk

document.addEventListener("DOMContentLoaded", () => {
    // Fungsi untuk memeriksa clue
    function checkClue(guess, clue) {
      const [numbers, clueType] = clue;
      if (clueType === "2 benar") {
        return guess.filter((num, i) => num === numbers[i]).length === 2;
      } else if (clueType === "1 benar") {
        return guess.filter((num, i) => num === numbers[i]).length === 1;
      } else if (clueType === "2 salah") {
        return guess.filter((num, i) => numbers.includes(num) && num !== numbers[i]).length === 2;
      } else if (clueType === "1 salah") {
        return guess.filter((num, i) => numbers.includes(num) && num !== numbers[i]).length === 1;
      } else if (clueType === "0 benar") {
        return guess.every(num => !numbers.includes(num));
      }
      return false;
    }
  
    // Fungsi untuk menghasilkan semua permutasi
    function permutations(arr, size) {
      if (size === 1) return arr.map(el => [el]);
      const result = [];
      arr.forEach((el, i) => {
        const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
        permutations(rest, size - 1).forEach(perm => result.push([el, ...perm]));
      });
      return result;
    }
  
    // Fungsi untuk memproses form dan mencari solusi
    document.getElementById("solveForm").addEventListener("submit", event => {
      event.preventDefault();
  
      const clues = [];
      for (let i = 1; i <= 5; i++) {
        const clueNumbers = Array.from(
          document.querySelectorAll(`.clue${i} input[type="number"]`)
        ).map(input => parseInt(input.value, 10));
        const clueType = document.querySelector(`.clue${i} .clue-type`).textContent.trim();
        clues.push([clueNumbers, clueType]);
      }
  
      // Coba semua kemungkinan
      const allPermutations = permutations([...Array(10).keys()], 4);
      const solutions = allPermutations.filter(perm =>
        clues.every(clue => checkClue(perm, clue))
      );
  
      const resultContainer = document.getElementById("result");
      resultContainer.innerHTML = solutions.length
        ? `Solution found: ${solutions[0].join(", ")}`
        : "No solution found.";
    });
  });
  
// function checkClue(guess, clue, correctPosition, wrongPosition) {
//     let correct = 0;
//     let wrong = 0;
//     let guessCopy = [...guess];
//     let clueCopy = [...clue];

//     // Cek posisi yang benar
//     for (let i = 0; i < guess.length; i++) {
//         if (guess[i] === clue[i]) {
//             correct++;
//             guessCopy[i] = null;
//             clueCopy[i] = null;
//         }
//     }

//     // Cek posisi yang salah
//     for (let i = 0; i < guessCopy.length; i++) {
//         if (guessCopy[i] !== null && clueCopy.includes(guessCopy[i])) {
//             wrong++;
//             clueCopy[clueCopy.indexOf(guessCopy[i])] = null;
//         }
//     }

//     return correct === correctPosition && wrong === wrongPosition;
// }

// // Fungsi untuk menghasilkan semua kemungkinan kombinasi angka
// function generatePermutations(arr, length) {
//     let results = [];
//     function permute(prefix, remaining) {
//         if (prefix.length === length) {
//             results.push(prefix);
//             return;
//         }
//         for (let i = 0; i < remaining.length; i++) {
//             permute([...prefix, remaining[i]], remaining.filter((_, index) => index !== i));
//         }
//     }
//     permute([], arr);
//     return results;
// }

// // Fungsi utama untuk menemukan solusi
// function findSolution(clues) {
//     const possibleNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
//     const guesses = generatePermutations(possibleNumbers, 4);

//     for (const guess of guesses) {
//         let valid = true;
//         for (const clue of clues) {
//             if (!checkClue(guess, clue.numbers, clue.correctPosition, clue.wrongPosition)) {
//                 valid = false;
//                 break;
//             }
//         }

//         if (valid) {
//             return guess;
//         }
//     }

//     return null; // No solution found
// }

// // Fungsi untuk mengolah petunjuk dari form input dan mencari solusi
// function solveClue() {
//     // Ambil nilai petunjuk dari input form
//     const clue1 = document.getElementById("clue-1").value.split(",").map(Number);
//     const clue2 = document.getElementById("clue-2").value.split(",").map(Number);
//     const clue3 = document.getElementById("clue-3").value.split(",").map(Number);
//     const clue4 = document.getElementById("clue-4").value.split(",").map(Number);
//     const clue5 = document.getElementById("clue-5").value.split(",").map(Number);

//     // Petunjuk dengan posisi yang benar dan salah
//     const clues = [
//         { numbers: clue1, correctPosition: 2, wrongPosition: 0 },  // Clue 1
//         { numbers: clue2, correctPosition: 1, wrongPosition: 0 },  // Clue 2
//         { numbers: clue3, correctPosition: 0, wrongPosition: 2 },  // Clue 3
//         { numbers: clue4, correctPosition: 0, wrongPosition: 1 },  // Clue 4
//         { numbers: clue5, correctPosition: 0, wrongPosition: 0 },  // Clue 5
//     ];

//     // Temukan solusi
//     const solution = findSolution(clues);

//     // Tampilkan hasil
//     const resultElement = document.getElementById("result");
//     if (solution) {
//         resultElement.textContent = `Solution found: ${solution.join(", ")}`;
//     } else {
//         resultElement.textContent = "No solution found.";
//     }
// }
