#! /usr/bin/env node
const fs = require('fs');
const path = require('path');

const homeDir = process.env['HOME'];
const gamDir = path.join(homeDir, '.gam');
const graphcoolRCFile = path.join(homeDir, '.graphcoolrc');

if (!fs.existsSync(gamDir)){
  console.log('Initializing...');
  fs.mkdirSync(gamDir);
}

switch (process.argv[2]) {
  case "-v":
  case "--version":
    console.log('0.1.0');
    break;
  case "ls":
  case "list":
    listAccounts();
    break;
  case "add":
    addAccount(process.argv[3]);
    break;
  case "rm":
  case "remove":
    removeAccount(process.argv[3]);
    break;
  case "use":
    useAccount(process.argv[3]);
    break;
  default:
    printUsage();
}

function listAccounts() {
  const graphcoolFileExists = fs.existsSync(graphcoolRCFile);
  const graphcoolFile =  graphcoolFileExists ? fs.readFileSync(graphcoolRCFile) : undefined;
  fs.readdir(gamDir, (error, items) => {
    if(error) {
      return printError('Unexpected I/O error, try again.');
    }
    if(items.length === 0) {
      printError('No accounts found.','Try adding one with `$ gcam add <account-name>`');
    }
    items.forEach((item) => {
      const accountFile = fs.readFileSync(path.join(gamDir, item));
      if(graphcoolFileExists && accountFile.equals(graphcoolFile)) {
        printGreen('->       ' + item);
      } else {
        console.log('         ' + item);
      }
    });
  })
}

function addAccount(accountAlias) {
  if (!fs.existsSync(graphcoolRCFile)){
    return printError('Unable to detect a graphcool account.','Verify that one exists with `$ graphcool account`');
  }
  if (!accountAlias) {
    return printError('No account name provided.', 'Usage: gam add <account-alias>')
  }
  if(fs.existsSync(path.join(gamDir, accountAlias))) {
    return printError('Account already exists!');
  }
  var accounts = fs.readdirSync(gamDir);
  const graphcoolFile = fs.readFileSync(graphcoolRCFile);
  accounts.forEach((file => {
    const accountFile = fs.readFileSync(path.join(gamDir, file));
    if(graphcoolFile.equals(accountFile)) {
      printError('Current account is already saved as "' + file + '".', 'Run `$ gam use '+ file + '`');
      process.exit();
    }
  }))
  fs.createReadStream(graphcoolRCFile).pipe(fs.createWriteStream(path.join(gamDir, accountAlias)));
  console.log('Current graphcool account saved as ' + accountAlias + '.');
}

function removeAccount(accountAlias) {
  if (!accountAlias) {
    return printError('No account name provided.', 'Usage: gam rm <account-alias>')
  }
  const aliasFile = path.join(gamDir, accountAlias);
  if (!fs.existsSync(aliasFile)){
    return printError('Account "' + accountAlias + '" doesn\'t exist.', 'Use `$ gam ls` to list available accounts.');
  }
  fs.unlinkSync(aliasFile);
  console.log('Account "' + accountAlias + '" removed.');
}

function useAccount(accountAlias) {
  if (!accountAlias) {
    return printError('No account name provided.', 'Usage: gam use <account-alias>')
  }
  const aliasFile = path.join(gamDir, accountAlias);
  if (!fs.existsSync(aliasFile)){
    return printError('Account "' + accountAlias + '" doesn\'t exist.', 'Use `$ gam ls` to list available accounts.');
  }
  fs.createReadStream(aliasFile).pipe(fs.createWriteStream(graphcoolRCFile));
  console.log('Now using "' + accountAlias + '".');
}

function printUsage() {
  console.log(`
Graphcool Account Manager

Usage: gam COMMAND

COMMANDS:
  ls                        List available graphcool accounts
  add <account-alias>       Save the current graphcool account to gam
  rm <account-alias>        Remove account from gam
  use <account-alias>       Switch to a different graphcool account
  help                      Show this message
  -v, --version             Print out the installed version of gam

Examples:

- List available graphcool accounts
  $ gam ls

- Save the current graphcool account to gam
  $ gam add account1

- Switch to a different graphcool account
  $ gam use account1
  `);
}

function printGreen(text){
  console.log('\x1b[32m%s\x1b[0m', text);
}

function printError(error, suggestion){
  console.log('\x1b[31m' + error + '\x1b[0m' + (suggestion ? '\n' + suggestion : '') +'\n');
}
