# Bankist-App-Accounts-Balances
A full bank app that helps members only who have accounts to:
- know their current in, out and total balance.
- know their last movements either deposit or withdrawal with its real date.
- transfer money to accounts that are opened in this bank only if:
  transfered amount is not larger than their balance
  account will receive amout is already open
- request a loan from the bank.
  acount has at least 1 movement with 0.1 of the loan reaquested
  minimum amount is 10 and maximum amount is their current total balance
- close their accounts only for account that currently logged in.

This app also:
shows a welcome message to this member after login and the current real date and time.
shows movements in an ascending sort.
has a 00:10:00 minutes timer starts decreasing once account has been idle and if the time passed, account logs out.

Accounts that has been registered are:
  username: js    pin: 1111    Porugal
  username: jd    pin: 2222    USA
  username: de    pin: 3333    Egypt
