"use strict";
// ! 30/08/2022
// Data
const account1 = {
  owner: "Bob Elka",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
// ! Working In Bankist App : 01/09/2022
// ! Display UI :
const displayUi = (acc) => {
  // ? Display Movements :
  displayMovements(acc.movements);

  // ? Display Balance :
  calcDisplayBalance(acc);

  // ? Display Summary :
  displaySummaryMovs(acc);
};
// !Display Movements
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
  <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date"></div>
          <div class="movements__value">${mov} €</div>
        </div>
  `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
// displayMovements(account1.movements);

// ! Calculate and Display Balance :
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
};
// calcDisplayBalance(account1.movements);

// ! Create User Name
const createUseName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((Name) => Name[0])
      .join("");
  });
};
createUseName(accounts);
// console.log(accounts);

// ! Display Summary Movements :
const displaySummaryMovs = function (account) {
  // * incomes
  const sumIn = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${sumIn}€`;

  // * outs
  const sumOut = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(sumOut)}€`;

  // * interset
  const sumInt = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${sumInt}€`;
};

// displaySummaryMovs(account1.movements);

// ! Login Form
let currentAccount;

btnLogin.addEventListener("click", function (e) {
  // ? Prevent Form From Submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // ? Display UI and Welcome Message:
    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(" ")[0]} `;
    containerApp.style.opacity = 100;

    inputLoginPin.value = inputLoginUsername.value = "";

    inputLoginPin.blur();

    // ? Display UI
    displayUi(currentAccount);
  }
});

// !Transform Form
btnTransfer.addEventListener("click", function (e) {
  // ? Prevent Form From Submitting
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );

  // Check If Amount And Reciever Valid
  // * Amount > 0
  // * Recieve Account Exist
  // * Current Balance >= Amount
  // * Current Account Name !== Reciever Name

  // ? Fields The Inputs
  inputTransferTo.value = inputTransferAmount.value = "";
  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    currentAccount.userName !== recieverAcc?.userName
  ) {
    // ! Doing The Transfer
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    // ! Display Ui
    displayUi(currentAccount);
  }
});
// ! close Form
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    currentAccount?.userName === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      (acc) => acc.userName === inputCloseUsername.value
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log in to get started";
  }
  inputClosePin.value = inputCloseUsername.value = "";
});

// ! Loan Form
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    // ? Add Positiv Movements To Current User
    currentAccount.movements.push(amount);

    // ? Display UI
    displayUi(currentAccount);

    inputLoanAmount.value = "";
  }
});

// ! Sorting Button :
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
console.log("-----------------BANKIST APP---------------------------");
/*

// !ARRAYS METHOD

// * Slice Method :

let arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.slice(1));
console.log(arr.slice(-2));
console.log(arr);

// * Splice Method :
console.log(arr.splice(3));
console.log(arr);
console.log(arr.splice(-2));
// ? The Splice Method it work like The slice Method but the splice it muted the original array

// * Revers Method
arr = ['a', 'b', 'c', 'd', 'e'];
let arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());

// * Concat Method
let letters = arr.concat(arr2);
console.log(letters);

// * Join Method
console.log(letters.join('-').toUpperCase());

// ! THE NEW AT METHOD

const newArr = [33, 42, 12];
console.log(newArr[0]);
console.log(newArr.at(0));
console.log(newArr.at(-1));

// !FOREACH METHOD

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300, 566];

// for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`move ${i + 1}: you have ${movement}`);
  } else {
    console.log(`move ${i + 1}: you don't have ${Math.abs(movement)}`);
  }
}

// * forEach method
console.log('-----------------forEach-------------------');

// ! in the call back function
// ? first arg is the current element
// ? second arg is the current index
// ? third arg is the current array

movements.forEach(function (movement, i, ar) {
  if (movement > 0) {
    console.log(`move ${i + 1}: you have ${movement}`);
  } else {
    console.log(`move ${i + 1}: you don't have ${Math.abs(movement)}`);
  }
});

// Foreach & Map
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${value} : ${key}`);
});

console.log('_____________________SET______________________');

const currenciesSet = new Set(['MAD', 'EGP', 'EUR', 'MAD', 'EGP']);

currenciesSet.forEach(function (value, _, map) {
  console.log(`${value} : ${value}`);
});

*/

/*
! Coding Challenge #1

* Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners 
* about their dog's age, and stored the data into an array (one array for each). For 
* now, they are just interested in knowing whether a dog is an adult or a puppy.
* A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

! Your tasks:
* Create a function 'checkDogs', which accepts 2 arrays of dog's ages 
* ('dogsJulia' and 'dogsKate'), and does the following things:

? 1. Julia found out that the owners of the first and the last two dogs actually have 
? cats, not dogs! So create a shallow copy of Julia's array, and remove the cat 
? ages from that copied array (because it's a bad practice to mutate function parameters)
? 2. Create an array with both Julia's (corrected) and Kate's data
? 3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 
? is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy �")
? 4. Run the function for both test datasets
! Test data:

*  Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
*  Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]


const julia = [3, 5, 2, 12, 7];
const kate = [4, 1, 15, 8, 3];
console.log('#################################################');
console.log('________________Challenge 1______________________');
const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaShallow = dogsJulia.slice();
  dogsJuliaShallow.splice(0, 1);
  dogsJuliaShallow.splice(-2);
  console.log(dogsJuliaShallow, dogsKate);
  const juliaAndKate = dogsJuliaShallow.concat(dogsKate);
  // console.log(juliaAndKate);

  juliaAndKate.forEach(function (dog, i) {
    const dogAge = dog >= 3 ? 'is an ADULT' : 'still a PUPPY';
    console.log(`Dog number ${i + 1}  ${dogAge}, and is ${dog} years old`);
  });
};

checkDogs(julia, kate);
*/
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300, 566];

// const euroToUsd = 1.1;

// const movementUsd = movements.map(function (mov) {
//   return mov * euroToUsd;
// });

// const movementUsd = (movements.map ( mov => mov * euroToUsd));

// console.log(movements);
// console.log(movementUsd);

const deposit = movements.filter((mov) => mov > 0);
const withdrawal = movements.filter((mov) => mov < 0);
// console.log(movements);
// console.log(deposit);
// console.log(withdrawal);

// const balance = movements.reduce(function (acc, cur, i, arr) {
//   return acc + cur;
// }, 0);

const balance = movements.reduce((acc, cur, i, arr) => acc + cur, 0);
// console.log(balance);

// !Maximum Value :

const max = movements.reduce((acc, cur) => {
  return acc >= cur ? acc : cur;
}, movements[0]);
// console.log(max);

/*
! Coding Challenge #2
* Let's go back to Julia and Kate's study about dogs. This time, they want to convert 
* dog ages to human ages and calculate the average age of the dogs in their study.

! Your tasks:

* Create a function 'calcAverageHumanAge', which accepts an arrays of dog's 
* ages ('ages'), and does the following things in order:
? 1. Calculate the dog age in human years using the following formula: 
? if the dog is <= 2 years old, humanAge = 2 * dogAge.
? If the dog is > 2 years old, humanAge = 16 + dogAge * 4
? 2. Exclude all dogs that are less than 18 human years old (which is the same as 
? keeping dogs that are at least 18 years old)
? 3. Calculate the average human age of all adult dogs (you should already know 
? from other challenges how we calculate averages �)
? 4. Run the function for both test datasets

! Test data:

* § Data 1: [5, 2, 4, 1, 15, 8, 3]
* § Data 2: [16, 6, 10, 5, 6, 1, 4]
*/

const calcAverageHumanAge = function (ages) {
  const humanAge = ages.map((age) => (age <= 2 ? 2 * age : 16 + age * 4));
  const adult = humanAge.filter((age) => age >= 18);
  // console.log(humanAge);
  // console.log(adult);
  const average = adult.reduce((acc, age, i, arr) => acc + age / arr.length, 0);

  return average;
};
// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));
/*
! Coding Challenge #3

* Rewrite the 'calcAverageHumanAge' function from Challenge #2, but this time 
* as an arrow function, and using chaining!

! Test data:

? § Data 1: [5, 2, 4, 1, 15, 8, 3]
? § Data 2: [16, 6, 10, 5, 6, 1, 4]
*/

const calcAverageHumanAge2 = function (ages) {
  const humanAge2 = ages
    .map((age) => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter((age) => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
  return humanAge2;
};

// console.log(calcAverageHumanAge2([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge2([16, 6, 10, 5, 6, 1, 4]));

// console.log(movements);
// ! Some : Condition
const someCond = movements.some((mov) => mov > 0);
// console.log(someCond);
// ? Some Condition Is a Method that check if it is one at least is TRUE

// ! EVERY
// console.log(account4.movements);
const everyCond = account4.movements.every((mov) => mov > 0);
// console.log(everyCond);

// ! Array Methods Practice :
// const exercice1 = accounts.flatMap(mov => mov.movements).filter(mov => mov >= 1000).length;
const exercice1 = accounts
  .flatMap((mov) => mov.movements)
  .reduce((com, mov) => (mov >= 1000 ? ++com : com), 0);
console.log(exercice1);

const { deposits, withdrawals } = accounts
  .flatMap((mov) => mov.movements)
  .reduce(
    (acc, cur) => {
      // *Method 1
      // cur > 0 ? (acc.deposits += cur) : (acc.withdrawals += cur);

      // *Method 2
      acc[cur > 0 ? "deposits" : "withdrawals"] += cur;
      return acc;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, withdrawals);

const text = (title) => {
  const exprection = [
    "a",
    "an",
    "and",
    "the",
    "or",
    "to",
    "of",
    "but",
    "in",
    "on",
    "with",
  ];

  const para = title
    .toLowerCase()
    .split(" ")
    .map((word) =>
      exprection.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(" ");

  return para;
};
/**

 console.log(text('He came in just as I was going out.'));
 console.log(
   text(
     'After fighting off the alligator, Brian still had TO face the anaconda.'
     )
     );
     console.log(
       text(
         'Writing a LisT of random sentences Is HARDER than I initially thought it would be.'
         )
         );
         console.log(
           text('The best Part OF marriage is animal crackers WITH peanut butter.')
           );
           
*/
/*
* Julia and Kate are still studying dogs, and this time they are studying if dogs are 
* eating too much or too little.
* Eating too much means the dog's current food portion is larger than the 
* recommended portion, and eating too little is the opposite.
* Eating an okay amount means the dog's current food portion is within a range 10% 
* above and 10% below the recommended portion (see hint).

! Your tasks:

? 1. Loop over the 'dogs' array containing dog objects, and for each dog, calculate 
? the recommended food portion and add it to the object as a new property. Do 
? not create a new array, simply loop over the array. Forumla: 
? recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)

? 2. Find Sarah's dog and log to the console whether it's eating too much or too 
? little. Hint: Some dogs have multiple owners, so you first need to find Sarah in 
? the owners array, and so this one is a bit tricky (on purpose) �

? 3. Create an array containing all owners of dogs who eat too much 
? ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').

? 4. Log a string to the console for each array created in 3., like this: "Matilda and 
? Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"

? 5. Log to the console whether there is any dog eating exactly the amount of food that is recommended (just true or false)

? 6. Log to the console whether there is any dog eating an okay amount of food (just true or false)

? 7. Create an array containing the dogs that are eating an okay amount of food (try to reuse the condition used in 6.)

? 8. Create a shallow copy of the 'dogs' array and sort it by recommended food 
? portion in an ascending order (keep in mind that the portions are inside the array's objects �) The Complete JavaScript Course 26

! Hints:
* Use many different tools to solve these challenges, you can use the summary lecture to choose between them �
* Being within a range 10% above and below the recommended portion means: 
! current > (recommended * 0.90) && current < (recommended * 1.10). 
! Basically, the current portion should be between 90% and 110% of the recommended portion.

! Test data:
*/
const dogs = [
  { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
  { weight: 8, curFood: 200, owners: ["Matilda"] },
  { weight: 13, curFood: 275, owners: ["Sarah", "John"] },
  { weight: 32, curFood: 340, owners: ["Michael"] },
];

// ! 11/09/2022
