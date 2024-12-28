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

function solveClue() {
    // Ambil input petunjuk dari form
    const clues = [
        { clue: document.getElementById("clue-1").value.split(",").map(Number), type: "2 Correct" },
        { clue: document.getElementById("clue-2").value.split(",").map(Number), type: "1 Correct" },
        { clue: document.getElementById("clue-3").value.split(",").map(Number), type: "2 Wrong" },
        { clue: document.getElementById("clue-4").value.split(",").map(Number), type: "1 Wrong" },
        { clue: document.getElementById("clue-5").value.split(",").map(Number), type: "None Correct" }
    ];

    const possibleSolutions = [];

    // Loop untuk mencoba semua kombinasi 4 digit angka yang memiliki angka unik
    for (let num = 0; num < 10000; num++) {
        const numStr = num.toString().padStart(4, "0");
        const numArr = numStr.split("").map(Number);

        // Pastikan angka terdiri dari 4 digit yang berbeda
        if (new Set(numArr).size !== 4) continue; // Jika ada angka yang sama, skip

        // Validasi kombinasi berdasarkan petunjuk
        let isValid = true;
        for (const { clue, type } of clues) {
            if (clue.length !== 4) continue; // Pastikan clue 4 digit

            let valid = false;
            switch (type) {
                case "2 Correct":
                    valid = checkTwoCorrect(numArr, clue);
                    break;
                case "1 Correct":
                    valid = checkOneCorrect(numArr, clue);
                    break;
                case "2 Wrong":
                    valid = checkTwoWrong(numArr, clue);
                    break;
                case "1 Wrong":
                    valid = checkOneWrong(numArr, clue);
                    break;
                case "None Correct":
                    valid = checkNoneCorrect(numArr, clue);
                    break;
            }

            if (!valid) {
                isValid = false;
                break;
            }
        }

        if (isValid) {
            possibleSolutions.push(numStr);
        }
    }

    // Tampilkan hasilnya
    document.getElementById("result").innerHTML = possibleSolutions.length
        ? possibleSolutions.join(", ")
        : "No solutions found!";
}

// Fungsi untuk memeriksa 2 angka benar posisi benar
function checkTwoCorrect(numArr, clue) {
    let correctCount = 0;
    for (let i = 0; i < 4; i++) {
        if (numArr[i] === clue[i]) {
            correctCount++;
        }
    }
    return correctCount === 2;
}

// Fungsi untuk memeriksa 1 angka benar posisi benar
function checkOneCorrect(numArr, clue) {
    let correctCount = 0;
    for (let i = 0; i < 4; i++) {
        if (numArr[i] === clue[i]) {
            correctCount++;
        }
    }
    return correctCount === 1;
}

// Fungsi untuk memeriksa 2 angka benar posisi salah
function checkTwoWrong(numArr, clue) {
    let correctCount = 0;
    let wrongCount = 0;
    
    // Hitung posisi yang benar
    for (let i = 0; i < 4; i++) {
        if (numArr[i] === clue[i]) {
            correctCount++;
        }
    }

    // Pastikan tidak ada posisi yang benar
    if (correctCount === 0) {
        for (let i = 0; i < 4; i++) {
            if (clue.includes(numArr[i]) && numArr[i] !== clue[i]) {
                wrongCount++;
            }
        }
    }

    return wrongCount === 2;
}

// Fungsi untuk memeriksa 1 angka benar posisi salah
function checkOneWrong(numArr, clue) {
    let correctCount = 0;
    let wrongCount = 0;

    // Hitung posisi yang benar
    for (let i = 0; i < 4; i++) {
        if (numArr[i] === clue[i]) {
            correctCount++;
        }
    }

    // Pastikan tidak ada posisi yang benar
    if (correctCount === 0) {
        for (let i = 0; i < 4; i++) {
            if (clue.includes(numArr[i]) && numArr[i] !== clue[i]) {
                wrongCount++;
            }
        }
    }

    return wrongCount === 1;
}

// Fungsi untuk memeriksa tidak ada angka yang benar
function checkNoneCorrect(numArr, clue) {
    return !clue.some((digit, index) => numArr[index] === digit);
}
