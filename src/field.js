'use strict';
import * as sound from './sound.js';


const FISH_SIZE = 80;
export const ItemType = Object.freeze({
    garbage: 'garbage',
    fish: 'fish',
})

export class Field {
  constructor(garbageCount, fishCounth) {
    this.garbageCount = garbageCount;
    this.fishCounth = fishCounth;

    this.field = document.querySelector('.game__field');
    this.fieldRect = this.field.getBoundingClientRect();
    this.field.addEventListener('click', this.onClick);
  }

  init() {
    this.field.innerHTML = '';
    this._addItem('fish', this.fishCounth, 'img/fish.png');
    this._addItem('garbage', this.garbageCount, 'img/garbage.png');
  }

  setClickListener(onItemClick){
    this.onItemClick = onItemClick;
  }

   _addItem (className, count, imgPath){
    const x1 = 0;
    const y1 = 0;
    const x2 = this.fieldRect.width - FISH_SIZE;
    const y2 = this.fieldRect.height - FISH_SIZE;
  
    for(let i = 0; i < count; i++){
      const item = document.createElement('img');
      item.setAttribute('class', className);
      item.setAttribute('src', imgPath);
      item.style.position = 'absolute';
      const x = randomNumber(x1, x2);
      const y = randomNumber(y1, y2);
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      this.field.appendChild(item);
    }
  }

  onClick = event => {
    const target = event.target;
    if(target.matches('.garbage')){
      target.remove();      
      sound.playTrash();    
      this.onItemClick && this.onItemClick(ItemType.garbage);
      } else if(target.matches('.fish')){
      this.onItemClick && this.onItemClick(ItemType.fish);
    }
  }
}


function randomNumber(min, max){
  return Math.random() * (max - min) + min;
}
