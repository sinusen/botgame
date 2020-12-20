require('dotenv').config()
const { App } = require('@slack/bolt');

//Global constants
const NUMBER_OF_TURNS = 2;
const BOT_NAME = "Guess_game";

//global variables
var gameStatus = false;
var randomNumber = null;
var userTurns = 0;

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

//Regular expressions
const INITIATE_PATTERN = new RegExp(`^(?=.*\\bstart\\b)(?=.*\\bgame\\b).*$`);
const CONFIRM_PATTERN = new RegExp(`${BOT_NAME} Yes`);
const NUMBER_MATCH = new RegExp(`${BOT_NAME}[ \\t]*0*([1-9]|10)$`);

// Listens to incoming messages
app.message(async ({ message, say }) => {

    
    switch(true) {
      case (INITIATE_PATTERN.test(message.text)&&userTurns==0):
        console.log('Matched start');
        initiateGame(message,say);
        break;
      case (CONFIRM_PATTERN.test(message.text)&&userTurns==0):
        console.log('Matched confirm message');
        startGame(message,say);
        break;
      case (NUMBER_MATCH.test(message.text)&&userTurns>0):
        console.log('Matched number');
        checkNumber(message,say);
        break;


    }
});

//Function to initiate game start
async function initiateGame(message,say) {
  await say(`Hello <@${message.user}>. Did you mean to start a wonderful guess game? To confirm type "Guess_game Yes"`);
}

//Function to start the game
async function startGame(message,say) {
  await say(`Welcome <@${message.user}> to the guess game. The rules of the game are simple. I,the computer will think of a number between 1 and 10.\
  You will be given ${NUMBER_OF_TURNS} chances to guess the number. If you guess a number higher than what I thought, I will say higher. If you guess a number\
  lower than I thought, I will say lower. May be I will give a few more hints to make it easier for you. Let us start the game now. `);
  randomNumber = Math.floor(Math.random()*10)+1;
  userTurns = NUMBER_OF_TURNS;
  console.log(randomNumber);
}

//Function to compare the user guess with system generated random number
async function checkNumber(message,say) {
  let extractedNumber = message.text.match(NUMBER_MATCH)[1]*1;
  switch(true) {
    case ((extractedNumber-randomNumber)<0):
      await say(`Sorry <@${message.user}>. The number I have in mind is higher.`);
      userTurns-=1;
      break;
    case ((extractedNumber-randomNumber)>0):
      await say(`Sorry <@${message.user}>. The number I have in mind is lower.`);
      userTurns-=1;
      break;
    case ((extractedNumber-randomNumber)==0):
      await say(`Congrats <@${message.user}>. You nailed it.`);
      userTurns = 0;
      return;
      break;
  }
  if (userTurns===0) {
    say(`Sorry <@${message.user}>. You are out of your turns. Better luck next time.`)
  }
}


//Function to display any message to slack



(async () => {
//   // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();
