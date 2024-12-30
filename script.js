// #FEATURE date and time
async function updateTime() {  
    const response = await fetch('http://worldtimeapi.org/api/timezone/Asia/Jakarta');  
    const data = await response.json();
    const currentDate = new Date(data.datetime).toLocaleDateString('en-US', {
        day: '2-digit', 
        month: 'short',
        year: 'numeric'});
    const currentTime = new Date(data.datetime).toLocaleTimeString('id-ID', {hour12: true})
    document.getElementById('date').textContent = currentDate;
    document.getElementById('clock').textContent = currentTime;
}  
setInterval(updateTime, 1000);  
updateTime();

// #SOLVER 24 & 24+
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

// #SOLVER clue
function checkClue(guess, clue) {
    const [numbers, clueType] = clue;
    if (clueType === "0 benar") {
      return guess.every(num => !numbers.includes(num));
    } else if (clueType === "2 benar") {
      return guess.filter((num, i) => num === numbers[i]).length === 2;
    } else if (clueType === "1 benar") {
      return guess.filter((num, i) => num === numbers[i]).length === 1;
    } else if (clueType === "2 salah") {
      return guess.filter((num, i) => numbers.includes(num) && num !== numbers[i]).length === 2;
    } else if (clueType === "1 salah") {
      return guess.filter((num, i) => numbers.includes(num) && num !== numbers[i]).length === 1;
    }
    return false;
  }
  
  function permutations(arr, size) {
    if (size === 1) return arr.map(el => [el]);
    const result = [];
    arr.forEach((el, i) => {
      const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
      permutations(rest, size - 1).forEach(perm => result.push([el, ...perm]));
    });
    return result;
  }
  
  document.getElementById("clueForm").addEventListener("submit", (event) => {
    event.preventDefault(); // Menghindari reload form
  
    const clueTypes = ["2 benar", "1 benar", "2 salah", "1 salah", "0 benar"];
    const clues = [];
  
    // Cek apakah semua input sudah terisi dan tidak ada angka yang duplikat
    for (let i = 0; i < 5; i++) {
      const input = [];
      for (let j = 0; j < 4; j++) {
        const value = document.getElementById(`clue${i}-${j}`).value;
        
        if (value === "") {
          document.getElementById("result").textContent = "Please fill all the fields.";
          return; // Stop jika ada input kosong
        }
  
        const number = Number(value);
        if (isNaN(number) || number < 0 || number > 9) {
          document.getElementById("result").textContent = "Invalid input. Make sure all numbers are between 0 and 9.";
          return;
        }
        
        input.push(number);
      }
  
      // Validasi angka duplikat dalam input clue
      const uniqueNumbers = new Set(input);
      if (uniqueNumbers.size !== 4) {
        document.getElementById("result").textContent = "Each clue must have unique numbers.";
        return;
      }
  
      clues.push([input, clueTypes[i]]);
    }
  
    const allPermutations = permutations([...Array(10).keys()], 4);
    const solutions = [];
    for (const perm of allPermutations) {
      if (clues.every(clue => checkClue(perm, clue))) {
        solutions.push(perm.join(" "));
      }
    }
  
    document.getElementById("result").innerHTML =
      solutions.length > 0 ? `${solutions.join("<br>")}` : "No solution found.";
  });

// #GAME pouch
function rollPouch() {
  const userGive = parseInt(document.getElementById('userGive').value);
  const userGuess = parseInt(document.getElementById('userGuess').value);

  const botGive = Math.floor(Math.random() * 11);
  const botGuess = botGive + Math.floor(Math.random() * 11);

  const totalPouch = userGive + botGive;

  const userGuessDifference = Math.abs(userGuess - totalPouch);
  const botGuessDifference = Math.abs(botGuess - totalPouch);

  let winnerMessage = '<span class="tie">It\'s a tie!<span>😱';

  if (userGuess === totalPouch) {
    winnerMessage = `WOW, you guessed the EXACT total!`;
    textColor = '#0056b3';
  } else if (userGuessDifference < botGuessDifference) {
    winnerMessage = '<span class="win">You win!🎉</span>';
  } else if (botGuessDifference < userGuessDifference) {
    winnerMessage = '<span class="lose">You lose!😞</span>';
    textColor = '#dc3545';
  }

  document.getElementById('result').innerHTML = `
    <p>Your give: ${userGive} | bot's give: ${botGive}</p>
    <p>Total Pouch: ${totalPouch}</p>
    <p>Your guess: ${userGuess} | bot's guess: ${botGuess}</p>
    <p><span class="bold" style="font-size: 1.5rem; color: ${textColor}">${winnerMessage}</span></p>
  `;
}
  
// #GAME bomber
function updateroleOptions() {
  const side = document.getElementById('side').value;
  const roleSelect = document.getElementById('role');
  
  roleSelect.innerHTML = '';

  let options = [];
  if (side === 'President') {
    options = ['President', 'Member'];
  } else if (side === 'Terrorist') {
    options = ['Bomber', 'Member'];
  }

  if (options.length > 0) {
    options.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option;
      opt.textContent = option;
      roleSelect.appendChild(opt);
    });
  }
}

function rollBomb() {
  const userSide = document.getElementById('side').value;
  const userRole = document.getElementById('role').value;

  if (!userSide || !userRole) {
    alert("Choose your decision first!");
    return;
  }

  let hasil = `You choose ${userSide} side and sending your ${userRole}.<br>`;
  document.getElementById('result').innerHTML = hasil;

  setTimeout(() => {
    const botSide = userSide === 'President' ? 'Terrorist' : 'President';
    const botRole = botSide === 'President' 
      ? ['President', 'Member'][Math.floor(Math.random() * 2)] 
      : ['Bomber', 'Member'][Math.floor(Math.random() * 2)];

    hasil += `Your rival (${botSide}) were sending their... `;
    document.getElementById('result').innerHTML = hasil;

    setTimeout(() => {
      hasil += `${botRole}!<br>`;
      document.getElementById('result').innerHTML = hasil;

      function checkGameResult(userSide, userRole, botRole) {
        if (userSide === "Terrorist") {
          if (userRole === "Bomber" && botRole === "President") {
            return '<span class="lose">You lose, a clash at different bases.</span>';
          } else if (userRole === "Bomber" && botRole === "Member") {
            return '<span class="win">Victory is yours, a bomb successfully blown up.</span>';
          } else if (userRole === "Member" && botRole === "President") {
            return '<span class="win">You win, standing side by side.</span>';
          } else if (userRole === "Member" && botRole === "Member") {
            return '<span class="lose">A defeat, bases are far apart.</span>';
          }
        } else if (userSide === "President") {
          if (userRole === "President" && botRole === "Bomber") {
            return '<span class="win">You triumph, what a trick movement.</span>';
          } else if (userRole === "President" && botRole === "Member") {
            return '<span class="lose">A crushing defeat, President got trapped in.</span>';
          } else if (userRole === "Member" && botRole === "Bomber") {
            return '<span class="lose">You fall, along with your palace.</span>';
          } else if (userRole === "Member" && botRole === "Member") {
            return '<span class="win">Victory is yours, they did not even dare.</span>';
          }
        }
        return "Invalid input";
      }

      const result = checkGameResult(userSide, userRole, botRole);  
      setTimeout(() => {
        hasil += result;  
        document.getElementById('result').innerHTML = hasil;
      }, 3000);
    }, 3500);
  }, 1500);
}

// #GAME RPS
function rollRPS(choice) {
  let userChoice = choice;
  document.getElementById('result').innerHTML = `You chose: ${userChoice}<br>`;

  const botChoices = ['Rock', 'Paper', 'Scissors'];
  let botChoice = botChoices[Math.floor(Math.random() * 3)];
  document.getElementById('result').innerHTML += `Bot chose: ${botChoice}<br>`;

  let resultMessage = getWinner(userChoice, botChoice);
  document.getElementById('result').innerHTML += resultMessage;
}

function getWinner(user, bot) {
  if (user === bot) {
      return '<span class="tie">It\'s a tie!<span>';
  }
  if (
      (user === 'Rock' && bot === 'Scissors') ||
      (user === 'Scissors' && bot === 'Paper') ||
      (user === 'Paper' && bot === 'Rock')
  ) {
      return '<span class="win">You win!</span>';
  } else {
      return '<span class="lose">You lose!</span>';
  }
}

// #DONE