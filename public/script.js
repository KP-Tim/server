'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${Math.abs(mov)}💶</div>
    </div>
  `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// const user = 'Steven Thomas Williams'; // stw

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}💶`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}💶`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}💶`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int > 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}💶`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);
  // console.log(currentAccount.pin);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message
    console.log(currentAccount.owner);
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    inputLoginUsername.value = inputLoginPin.value = ' ';
    inputLoginPin.blur();
    containerApp.style.opacity = 100;
    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
  }
  // Update UI
  updateUI(currentAccount);
  // Clear fields
  inputLoanAmount.value = '';
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('hi');
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferTo.blur();

  if (
    amount > 0 &&
    receiverAcc &&
    amount <= currentAccount.balance &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // Update UI
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const closeUser = inputCloseUsername.value;
  const closePin = Number(inputClosePin.value);
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
  if (
    closeUser === currentAccount.username &&
    closePin === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// console.log(accounts);
// const calcPrintBalance = function (accs) {
//   accs.forEach(function (acc) {
//     return acc.movements.reduce((accs, cur) => accs + cur, 0);
//   });
// };

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => el.textContent.replace('💶', '')
//   );
//   console.log(movementsUI);
// });

// 1.
const bankDepositSum = accounts
  .flatMap(mov => mov.movements)
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
// console.log(bankDepositSum);

// 2.
const numDeposits1000 = accounts
  .flatMap(mov => mov.movements)
  .filter(mov => mov >= 1000).length;
//console.log(numDeposits1000);

const numDeposits1000r = accounts
  .flatMap(mov => mov.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
//console.log(numDeposits1000r);

// 3.
const { deposits, withdrawals } = accounts
  .flatMap(mov => mov.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      // return sums;
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
// console.log(deposits, withdrawals);

// 4.
// this is a nice title --> This Is a Nice Title
const converTitleCase = function (title) {
  const excludeWords = ['a', 'an', 'of', 'in', 'on', 'to', 'is', 'the'];
  const toLower = title.toLowerCase().split(' ');
  console.log(toLower);
  const too = toLower
    .map((letter, i) => {
      return excludeWords.includes(letter) && i != 0
        ? letter.toLowerCase()
        : letter.charAt(0).toUpperCase() +
            letter.substring(1) /*.toLowerCase()*/;
    })
    .join(' ');
  console.log(too);
};
converTitleCase('this is A nice title');
converTitleCase('the world is going ON to the panic mode');
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
const topSix = [
  { name: 'Nigeria', position: '1st', points: 43 },
  { name: 'England', position: '2nd', points: 37 },
  { name: 'USA', position: '3rd', points: 35 },
  { name: 'South Africa', position: '4th', points: 30 },
  { name: 'Brazil', position: '5th', points: 27 },
  { name: 'Korea', position: '6th', points: 23 },
];

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

const euros = [29.76, 41.85, 46.5];
const average = euros.reduce((total, amount, index, array) => {
  total.push(amount * 2);
  return total;
}, []);

const above30 = euros.reduce((total, amount) => {
  if (amount > 30) {
    total.push(amount);
  }
  return total;
}, []);

const fruitBasket = [
  'banana',
  'cherry',
  'orange',
  'apple',
  'cherry',
  'orange',
  'apple',
  'banana',
  'cherry',
  'orange',
  'fig',
];

const count = fruitBasket.reduce((total, fruit) => {
  total[fruit] = (total[fruit] || 0) + 1;
  return total;
}, {});
// console.log(count);

const count1 = fruitBasket.reduce((tally, fruit) => {
  tally[fruit] = 1;
  return tally;
}, {});
// console.log(count1);
//{sums: 10, withdrawal: 20}

// console.log(new Arrry(1, 2, 3));
// const x = new Array(7);
// console.log(x.fill(1));

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);
// const random = Array.from({ length: 100 }, (num, i) =>
//   Math.trunc(Math.random() + 1)
// );
// console.log(random);
// const firstWithdrawal = movements.find(move => move < 0);

// console.log(movements);
// console.log(firstWithdrawal);
// const maximum = movements.reduce(
//   (acc, cur) => (acc < cur ? cur : acc),
//   movements[0]
// );
// console.log(maximum);

// const balance = movements.reduce((acc, cur) => acc + cur, 0);
// const deposits = movements.filter(mov => mov > 0);
// const withdrawals = movements.filter(mov => mov < 0);
// console.log(balance);
// console.log(deposits);
// console.log(withdrawals);

// const eurToUsd = 1.1;
// const movementsUSD = movements.map(mov => eurToUsd * mov);

// const movementsUSD = movements.map(function (mov) {
//   return eurToUsd * mov;
// });
// console.log(movements);
// console.log(movementsUSD);

// const movementsDescriptions = movements.map(function (mov, i) {
//   console.log(
//     `Movement ${i + 1}: You have ${
//       mov > 0 ? 'deposited' : 'withdrew'
//     } ${Math.abs(mov)}`
//   );
// });

/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
*/

/*
// for (const [i, el] of movements.entries()) {
//   if (el > 0) {
//     console.log(`You have deposited ${el} dollars`);
//   } else {
//     console.log(`You have withdrewal ${Math.abs(el)} dollars`);
//   }
// }

// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`${i + 1}: You have deposited ${mov} dollars`);
//   } else {
//     console.log(
//       `${i + 1}: You have withdrewal ${Math.abs(mov)} dollars ${arr}`
//     );
//   }
// });

/*
/////////////////////////////////////////////////
let arr = ['a', 'b', 'c', 'd', 'e'];

// slice() Not MUTATES
console.log(arr.slice(1, 4)); //"b","c","d"

// splice() Same as slice but this MUTATES and useful when removing arrays. Also last argument is the position of an element in array.
console.log(arr.splice(3)); //'d','e'

arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];

// reverse() It reverses the array and MUTATES the orginal
console.log(arr2.reverse());

// concat() Not MUTATES, adds two arrays together
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

// join() Not MUTATES, joins arrays and results in a strings
console.log(letters.join(' - '));
console.log(letters);

arr = [23, 11, 64];

// at() Not MUTATES, works on string as well.  Good for chaining method
console.log(arr.at(-1)); //63
console.log(arr.slice(-1)[0]);
console.log(arr[arr.length - 1]);
*/

/* Coding Challenge1 ----------------------------------------------
// Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

const julia1 = [3, 5, 2, 12, 7];
const kate1 = [4, 1, 15, 8, 3];

const julia2 = [9, 16, 6, 8, 3];
const kate2 = [10, 5, 6, 1, 4];

function checkDogs(dogsJulia, dogsKate) {
  const juliaCorrected = dogsJulia.slice().splice(1, 2);
  console.log(juliaCorrected);
  const dogs = juliaCorrected.concat(dogsKate);
  dogs.forEach(function (age, i) {
    if (age >= 3) {
      console.log(`Dog number ${i + 1} is an adults, and is ${age} years old`);
    } else {
      console.log(`Dog number ${i + 1} is still a puppy🐶`);
    }
  });
}

checkDogs(julia1, kate1);
checkDogs(julia2, kate2);
*/

// § Data 1: [5, 2, 4, 1, 15, 8, 3]
// § Data 2: [16, 6, 10, 5, 6, 1, 4]

// const calcAverageHumanAge = function (ages) {
//   ages.map(function (dogAge) {
//     const humanAge = dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4;
//     console.log(humanAge);
//     // const ages = humanAge.filter(old => old >= 18);
//   });
// };

// const calcAverageHumanAge = ages =>
//   ages
//     .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
//     .filter(old => old >= 18)
//     .reduce((acc, avg, i, arr) => acc + avg / arr.length, 0);
// // return humanAge;
// // const ages = humanAge.filter(old => old >= 18);
// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

/* Challenge 4 --------------------------------------------------------
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1. Calculate recommended food portion
dogs.forEach(function (dog, i) {
  dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
});
console.log(dogs);

// 2.  Find Sarah's dog whether it's eating too much or too little
const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(
  `Sarah's dog is eating too ${
    sarahDog.curFood > sarahDog.recommendedFood ? 'much' : 'little'
  }`
);

// 3. Create an array for each whoese eating too much and too little
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

// 4. Log a string
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!"`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!"`);

// 5. Log whether there is any dog eating exactly the amount True or False
console.log(`${dogs.some(dog => dog.curFood === dog.recommendedFood)}`);

// 6. Log whether any dog eating okay amount of food Tru or False
console.log(
  `${dogs.some(
    dog =>
      dog.curFood > dog.recommendedFood * 0.9 &&
      dog.curFood < dog.recommendedFood * 1.1
  )}`
);

// 7. Create array for dogs that are eating okay amount of food
const checkEatingOkay = dog =>
  dog.curFood > dog.recommendedFood * 0.9 &&
  dog.curFood < dog.recommendedFood * 1.1;
console.log(dogs.filter(checkEatingOkay));

const okay = dogs.filter(
  dog =>
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
);
console.log(okay);

// 8. Shallow copy of dogs array sorted by recom food port in ascending order

const dogFoodOrder1 = dogs
  .map(dog => dog.recommendedFood)
  .sort((a, b) => b - a);
console.log(dogFoodOrder1);

const dogFoodOrder2 = dogs
  .map(dog => dog)
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(dogFoodOrder2);

Challenge Done ---------------------------------------------------
*/
