function solve() {
    // Ambil input petunjuk dari form
    const clues = [
        { clue: document.getElementById("clue-1").value.split(",").map(Number), type: "2 Correct" },
        { clue: document.getElementById("clue-2").value.split(",").map(Number), type: "1 Correct" },
        { clue: document.getElementById("clue-3").value.split(",").map(Number), type: "2 Wrong" },
        { clue: document.getElementById("clue-4").value.split(",").map(Number), type: "1 Wrong" },
        { clue: document.getElementById("clue-5").value.split(",").map(Number), type: "None Correct" }
    ];

    const possibleSolutions = [];

    // Loop untuk mencoba semua kombinasi 4 digit angka
    for (let num = 0; num < 10000; num++) {
        const numStr = num.toString().padStart(4, "0");
        const numArr = numStr.split("").map(Number);

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
    for (let i = 0; i < 4; i++) {
        if (numArr[i] === clue[i]) {
            correctCount++;
        }
    }
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
    for (let i = 0; i < 4; i++) {
        if (numArr[i] === clue[i]) {
            correctCount++;
        }
    }
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
