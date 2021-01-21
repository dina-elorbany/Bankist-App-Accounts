'use strict';

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-12-19T16:33:06.386Z',
    '2021-01-13T14:43:26.374Z',
    '2021-01-15T18:49:59.371Z',
    '2021-01-16T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-06-30T09:48:16.867Z',
    '2019-11-01T13:15:33.035Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-12-19T16:33:06.386Z',
    '2021-01-10T14:43:26.374Z',
    '2021-01-15T18:49:59.371Z',
    '2021-01-16T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Dina Elorbany',
  movements: [500, 340, -150, -790, 3210, -1000, -2470, 8500, 7000, -30],
  interestRate: 1.3,
  pin: 3333,

  movementsDates: [
    '2019-06-30T09:48:16.867Z',
    '2019-11-01T13:15:33.035Z',
    '2019-11-01T23:23:23.035Z',
    '2019-11-08T13:15:33.035Z',
    '2019-12-10T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-12-19T16:33:06.386Z',
    '2021-01-12T14:43:26.374Z',
    '2021-01-16T18:49:59.371Z',
    '2021-01-17T12:01:20.894Z',
  ],
  currency: 'EGP',
  locale: 'ar-EG',
};

const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelTotalIn = document.querySelector('.summary__value--in');
const labelTotalOut = document.querySelector('.summary__value--out');
const labelTotalInterest = document.querySelector('.summary__value--interest');
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

/////////////////////////////////////////////////
// Functions

// format Date
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const DaysPassed = calcDaysPassed(new Date(), new Date(date));

  if (DaysPassed === 0) return 'Today';
  if (DaysPassed === 1) return 'Yesterday';
  if (DaysPassed <= 7) return `${DaysPassed} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);
};

// Display Movements (add to html)
const displayMovements = function (account, sorted = false) {
  // reset html to empty before start
  containerMovements.innerHTML = '';

  // display deposits or withdrawals
  // sort ascending order

  const sortedMov = sorted
    ? account.movements.slice().sort((mov1, mov2) => mov1 - mov2)
    : account.movements;

  // display sorted
  sortedMov.forEach((mov, i) => {
    const process = mov > 0 ? 'deposit' : 'withdrawal';

    // create movementDate
    const date = new Date(account.movementsDates[i]);

    // format currency
    const formatmov = formatCurrency(mov, account.locale, account.currency);

    const insertHtml = `<div class="movements__row">
    <div class="movements__type movements__type--${process}">${
      i + 1
    } ${process}</div>
    <div class="movements__date">${formatMovementDate(
      date,
      account.locale
    )}</div>
    <div class="movements__value">${formatmov}</div>
  </div>`;

    // add element to html after the past ones
    containerMovements.insertAdjacentHTML('afterbegin', insertHtml);
  });
};

// Sort Movement Ascending
let sort = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sort);
  sort = !sort;
});

// format currencies
const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Display Total GlobalBalance
const calcDisplayBalance = function (account) {
  account.globalBalance = account.movements.reduce((acc, mov) => mov + acc, 0);
  labelBalance.textContent = formatCurrency(
    account.globalBalance,
    account.locale,
    account.currency
  );
};

// Display Total Summary
let inCome;
const totalInOutCome = function (account) {
  // display total IN
  inCome = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, deposit) => acc + deposit, 0);
  labelTotalIn.textContent = formatCurrency(
    inCome,
    account.locale,
    account.currency
  );

  // display total OUT
  const outCome = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, withdrawal) => acc + withdrawal, 0);
  labelTotalOut.textContent = labelTotalIn.textContent = formatCurrency(
    outCome,
    account.locale,
    account.currency
  );

  // display total INTEREST
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelTotalInterest.textContent = formatCurrency(
    interest,
    account.locale,
    account.currency
  );
};

// Create Username;
const createUsername = function (accounts) {
  accounts.forEach(account => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsername(accounts);

// updating UI
const updateUI = function (account) {
  displayMovements(account);
  calcDisplayBalance(account);
  totalInOutCome(account);
};

// Implementing Login
let currentAccount;

// lose inputLogin focus
const emptyInputLogin = function () {
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginUsername.blur();
  inputLoginPin.blur();
};

// login event handler
btnLogin.addEventListener('click', function (e) {
  // prevent form from submitting (reloading)
  e.preventDefault();

  // check username
  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  // check pin
  if (currentAccount?.pin === +inputLoginPin.value) {
    // display welcome msg and UI
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }! 😊`;
    containerApp.style.opacity = 100;

    // lose inputLogin focus
    emptyInputLogin();
    updateUI(currentAccount);

    // timer for each account log in
    // logOutTimer();
    startLogOutTimer();
  } else if (
    !currentAccount?.username ||
    currentAccount?.pin !== +inputLoginPin.value
  ) {
    alert('Please check your credentials ❗');
    //lose inputLogin focus
    emptyInputLogin();
  }

  // Create Current Date
  setInterval(function () {
    const currentDate = new Date();
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(currentDate);
  }, 1000);
});

// Implementing Transfer button
//lose inputTransfers focus
const emptyInputTransfer = function () {
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferTo.blur();
  inputTransferAmount.blur();
};

const transfer = function (accounts) {
  //set transfer button
  btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();

    //select inputTransfer and amount
    const amount = +inputTransferAmount.value;

    //select receiver
    const receiver = accounts
      .filter(account => account !== currentAccount)
      .find(received => received.username === inputTransferTo.value);

    inputTransferAmount.value = inputTransferTo.value = '';

    //determine when the amount does transfer
    if (
      amount <= currentAccount.globalBalance &&
      amount > 0 &&
      receiver?.username
    ) {
      currentAccount.movements.push(-amount);
      currentAccount.movementsDates.push(new Date());

      //process at receiver after transfer
      receiver.movements.push(amount);
      receiver.movementsDates.push(new Date());

      //add changes to html
      updateUI(currentAccount);

      //display alert for the same user
    } else if (
      !receiver?.username &&
      inputTransferTo.value !== currentAccount.username
    ) {
      alert('This account is not exist, please check the receiver account. ⚠');
      //display alert for account doesn't exist
    } else if (inputTransferTo.value === currentAccount.username) {
      alert('This is your Acount, Please insert a correct receiver. ❗❗');
      //display alert for the amount over than the current balance
    } else {
      alert('Your credit is not enough, please insert an allowed amount. ❗❗');
    }

    //lose inputTransfer focus
    emptyInputTransfer();
  });
};
transfer(accounts);

// Implementing Request loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmount = Math.floor(+inputLoanAmount.value);

  const checkDeposits = currentAccount.movements.some(
    mov => mov >= 0.1 * loanAmount
  );

  const loanAction = function () {
    currentAccount.movements.push(loanAmount);
    currentAccount.movementsDates.push(new Date());
    updateUI(currentAccount);
  };

  if (checkDeposits && loanAmount > 0) {
    setTimeout(loanAction, 3000);

    // set button one use only
    btnLoan.disabled = true;
  }

  if (!checkDeposits)
    alert(`You don't have the minimun credit for this loan❗`);

  if (loanAmount < 10) alert(`Please enter an allowed amount❗`);

  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

// Implementing close account
//lose inputClose focus
const emptyInputClose = function () {
  inputCloseUsername.value = inputClosePin.value = '';
  inputCloseUsername.blur();
  inputClosePin.blur();
};

// close button event handler
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  // delete only the current account
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const deletedIndex = accounts.findIndex(
      account => account.username === currentAccount.username
    );

    // delete account
    accounts.splice(deletedIndex, 1);

    // Remove all the UI of deleted
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';

    // display alert if the account you insert is not the current
  } else if (inputCloseUsername.value !== currentAccount.username) {
    alert('You can not close this account❗');
    // display alert for the wrong pin
  } else if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value !== currentAccount.pin
  ) {
    alert('Please check your credentials❗');
  }
  // lose inputClose focus
  emptyInputClose();
});

// Set Timer for Logged-Out
// using manual formatting
/*
// create the primary function
const logOutTimer = function () {
  // set time to 5 minutes
  let time = 600;

  // start from actual time not after 1 sec
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    console.log(`${min}:${sec}`);

    // in each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // when 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }

    // decrease time by 1 sec
    time--;
  };
  // call the time every second (setInterval)
  tick();
  const timer = setInterval(tick, 1000);
};
*/

// using internationalizing
let timer;
const startLogOutTimer = () => {
  timer && clearInterval(timer);

  let time = 10 * 1000;
  const tick = () => {
    const timeFormat = new Intl.DateTimeFormat(navigator.language, {
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(time));

    console.log(timeFormat);
    labelTimer.textContent = timeFormat;

    if (time === 0) {
      // time = 20 * 1000;
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
    }
    // time = 0;
    time -= 1000;
  };

  tick();
  timer = setInterval(tick, 1000);
};
