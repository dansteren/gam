# Graphcool Account Manager

## Installation

```bash
npm install -g gam
```

## Usage

```
  ls                        List available graphcool accounts
  add <account-alias>       Save the current graphcool account to gam
  rm <account-alias>        Remove account from gam
  use <account-alias>       Switch to a different graphcool account
  help                      Show this message
  -v, --version             Print out the installed version of gam
```

## Examples

List available graphcool accounts:

```bash
gam ls
```

Save the current graphcool account to gam:

```bash
gam add account1
```

Switch to a different graphcool account:

```bash
gam use account1
```

## Uninstallation

Gam stores accounts in `~/.gam`. To uninstall gam just delete this directory and run `npm uninstall -g gam`.
