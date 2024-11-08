import { Howl, Howler } from 'howler';
import highBeepPath from '../assets/sound/high_beep.mp3';
import lowBeepPath from '../assets/sound/low_beep.mp3';
import high from '../assets/sound/High.mp3';
import normal from '../assets/sound/Normal.mp3';
import low from '../assets/sound/Low.mp3';

export function highBeep(volume) {
  const highBeepSound = new Howl({
    src: [highBeepPath],
    volume: volume / 100
  });
  highBeepSound.play();
}

export function lowBeep(volume) {
  const lowBeepSound = new Howl({
    src: [lowBeepPath],
    volume: volume / 100
  });
  lowBeepSound.play();
}

export function high(volume){
  const highSound = new Howl({
    src: [high],
    volume: volume / 100
  });
  highSound.play();
}

export function normal(volume){
  const normalSound = new Howl({
    src: [normal],
    volume: volume / 100
  });
  normalSound.play();
}

export function low(volume){
  const lowSound = new Howl({
    src: [low],
    volume: volume / 100
  });
  lowSound.play();
}
