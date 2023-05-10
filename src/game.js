'use strcit';

import { Field, ItemType } from './field.js';
import * as sound from './sound.js';


export const Reason = Object.freeze({
  win: 'win',
  lose: 'lose',
  cancel: 'cancel',
});

// builder pattern
export class GameBuilder {
  withGameDuration(duration) {
    this.gameDuration = duration;
    return this;
  }
  withFshCount(num) {
    this.fishCount = num;
    return this;
  }
  withGarbageCount(num) {
    this.garbageCount = num;
    return this;
  }
  
  build() {
    return new Game(
      this.gameDuration,
      this.fishCount,
      this.garbageCount,
    );
  }
}


class Game {
  constructor(gameDuration, fishCount, garbageCount) {
    this.gameDuration = gameDuration;
    this.fishCount = fishCount;
    this.garbageCount = garbageCount;

    
    this.gameTimer = document.querySelector('.game__timer');
    this.gameScore = document.querySelector('.game__score');
    this.gameBtn = document.querySelector('.game__button');
    this.gameBtn.addEventListener('click', ()=> {
      if (this.started) {
        this.stop(Reason.cancel);
      } else {
        this.start();
      }
    });
    
    this.gameField = new Field(garbageCount, fishCount);
    this.gameField.setClickListener(this.onItemClick);
    
    this.started = false;
    this.score = 0;
    this.timer = undefined;

   }

  setGameStopListener(onGameStop){
    this.onGameStop = onGameStop;
    }

   start() {
    this.started = true;
    this.initGame();
    this.showStopButton();
    this.showTimerAndScore();
    this.startGameTimer();
    sound.playBackground();
    }
  
   stop(reason) {
    this.started = false;
    this.stopGameTimer();
    this.hideGameButton();       
    sound.StopBackground();   
    this.onGameStop && this.onGameStop(reason);
    }


  onItemClick = (item) => {
    if(!this.started){
      return;
    }  
      if(item === ItemType.garbage){
        this.score++;             
        this.updateScoreBoard();
        if(this.score === this.garbageCount){
          this.stop(Reason.win);
        }
       } else if(item === ItemType.fish){
          this.stop(Reason.lose);
      }
    }
    
    showStopButton(){
      const icon = this.gameBtn.querySelector('.fa-regular');
      icon.classList.add('fa-circle-stop');
      icon.classList.remove('fa-circle-play');
      this.gameBtn.style.visibility = 'visible';
    }

    hideGameButton(){
      this.gameBtn.style.visibility = 'hidden';
    }

     showTimerAndScore(){
      this.gameTimer.style.visibility = 'visible';
      this.gameScore.style.visibility = 'visible'; //display none은 렌더트리 영향. 포지션 변화일어남
    }


     startGameTimer() {
        let remainingTimeSec = this.gameDuration;
        this.updateTimerText(remainingTimeSec);
        this.timer = setInterval(()=> {
          if(remainingTimeSec <= 0){
              clearInterval(this.timer);
              this.stop(this.garbageCount === this.score ? Reason.win : Reason.lose);
              return;
          }
        this.updateTimerText(--remainingTimeSec);
        }, 1000);
    }

     stopGameTimer() {
        clearInterval(this.timer);
    }

     updateTimerText(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        this.gameTimer.innerText = `${minutes}:${seconds}`;
    }   

      initGame() {
        this.score = 0;  
        this.gameScore.innerHTML = this.score;
        this.gameField.init();
    }


      updateScoreBoard(){
        this.gameScore.innerText = this.score;
    }

  }