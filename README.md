# harvest-automation

## Goal
Generate a CSV spreadsheet connecting your Harvest entries with your GitHub project card estimation

## Requirements
- NodeJS and yarn
- GitHub token with access to private repositories - [generate here](https://github.com/settings/tokens/new)
- Harvest token - [generate here](https://id.getharvest.com/oauth2/access_tokens/new)

## Setup
```bash
git clone https://github.com/flplima/harvest-automation
cd harvest-automation
cp .env.example .env # don't forget to fill in your .env file!
yarn # install dependencies
```

## Run
```bash
node index.js 2023-10-01 2023-10-19 # start and end dates YYYY-MM-DD format
```
If everything went well, an `output.csv` file should be created
