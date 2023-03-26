# hoohacks2023
HooHacks 2023 project

# Dependencies
To run the project, ensure that `npm` and `pip3` are installed. 
Then install dependencies with the following commands:
1. Run `npm install` in the `client` directory.
2. Run `pip3 install selenium bs4 lxml openai python-dotenv` in the `server` directory.

# OpenAI API Key
Place an OpenAI API Key in `server/.env` with the following format:
```
OPENAI_API_KEY={key_here}
```

# Running the development version
To run locally, use the following commands: 
1. In the `client` directory, run `npm start`.
2. In the `server` directory, run `npm run app`

Then go to `http://localhost:3000` to view the webapp.
