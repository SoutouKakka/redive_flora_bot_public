# Redive Flora Bot
<details>
<summary><strong>Environment setup</strong></summary>

1. Install [NVM (Node Version Manager)](https://github.com/nvm-sh/nvm)
```
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
```
2. Install node.js version 10
```
$ nvm install 10
```
</details>
<details>
<summary><strong>Install node modules</strong></summary>

1. Use NPM to install required node modules
```
$ npm install
```
</details>

[@redive_flora_bot](https://t.me/redive_flora_bot)  
### Bot to fetch teams for monthly clan battle in Princess Connect Re:Dive
* Support inline query
* Support [sticker-as-command](https://t.me/addstickers/flora_pack) query
* Support customized sticker-as-command
* Customized for Hong Kong users

### Usage
1. Copy `config/index.example.js` to `config/index.js`
2. Fill in `config/index.js` with your bot API token, Google Spreadsheet API key
3. You can make use of [my demo spreadsheet](https://docs.google.com/spreadsheets/d/1mlrMBOX0Gy-hyXUDuhwAbmwxfN00O0NS1t6DLyl-YRQ/edit#gid=1084290105) or your own spreadsheet details (Please follow the format of demo spreadsheet)
4. Start the process
```
$ npm start
```
