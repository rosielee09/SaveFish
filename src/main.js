'use strict';
import PopUp from './popup.js';
import {GameBuilder,  Reason}  from './game.js';
import * as sound from './sound.js';



const gameFinishBanner = new PopUp();
const game = new GameBuilder()
  .withGameDuration(13)
  .withFshCount(17)
  .withGarbageCount(17)
  .build();

game.setGameStopListener((reason)=>{
  
  let message;
  switch(reason){
    case Reason.cancel:
      message = 'Oops..Replay ❓';
      sound.playAlert();
      break;
    case Reason.win:
      message = 'You Saved all Fishes 💚';
      sound.playwin();
      break;
    case Reason.lose:
      message = 'Fishes will..be.. 💩';
      sound.playFish();
      break;
    default:
      throw new Error('not valid reason');
  }
  gameFinishBanner.showWithText(message);
});

gameFinishBanner.setClickListener(()=>{
  game.start(); 
});




