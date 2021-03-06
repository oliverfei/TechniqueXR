const PAUSE_PLAY_ICONS = {
    false: "/images/pause_icon.svg",
    true: "/images/play_icon.svg"
}

const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
let speedIndex = 3;

let stepAmount = 0.05;
let maxTime = 1.0;

document.addEventListener("DOMContentLoaded", function(e){
  let characterModel = document.querySelector("#character-model");
  let playButton = document.querySelector('#play-button-xr');
  let pauseButton = document.querySelector('#pause-button-xr');
  let skipNextButton = document.querySelector('#skip-next-button-xr');
  let skipPrevButton = document.querySelector('#skip-previous-button-xr');
  let speedButton = document.querySelector('#speed-button-xr');
  
  characterModel.addEventListener("clip-loaded", e => {
    maxTime = e.detail.clipDuration;
    document.querySelector("#animation-slider").setAttribute("max", maxTime);

    characterModel.addEventListener("tick", e => {
        document.querySelector("#animation-slider").value = e.detail.time;
    });
  });

  document.querySelector("#previous-button").onclick = function() {
    step(-stepAmount, characterModel);
  };

  document.querySelector('#skip-previous-button-xr').onclick = function() {
    step(-stepAmount, characterModel);
  };

  document.querySelector("#next-button").onclick = function() {
    step(stepAmount, characterModel);
  };

  document.querySelector('#skip-next-button-xr').onclick = function() {
    step(stepAmount, characterModel);
  };

  document.querySelector("#pause-play-button").onclick = function(event) {
    let paused = characterModel.getAttribute("animation-player").paused;
    setPaused(!paused, characterModel);
  };

  document.querySelector('#play-button-xr').onclick = function(event) {
    setPaused(false, characterModel);
  };

  document.querySelector('#pause-button-xr').onclick = function(event) {
    setPaused(true, characterModel);
  };

  document.querySelector("#speed-select").onchange = function(event) {
    speedIndex = speeds.indexOf(event.target.value);
    characterModel.setAttribute("animation-player", {speed: event.target.value});
  };

  document.querySelector('#speed-button-xr').onclick = function(event) {
    speedIndex = (speedIndex + 1) % speeds.length;
    characterModel.setAttribute("animation-player", {speed: speeds[speedIndex]});
    document.querySelector('#speed-button-text').setAttribute('text', {value:speeds[speedIndex] + 'X'});
  }

  document.querySelector("#animation-slider").oninput = function(event) {
    setPaused(true, characterModel);
    characterModel.setAttribute("animation-player", {currentTime: event.target.value});
  };
});

function step(stepAmount, animatedModel) {
  let animationPlayer = animatedModel.getAttribute("animation-player");
  if(animationPlayer.paused) {
    let newTime = Number(document.querySelector("#animation-slider").value) + stepAmount;
    if (newTime > maxTime) {
        newTime = maxTime;
    } else if (newTime < 0) {
        newTime = 0;
    }
    animatedModel.setAttribute("animation-player", {currentTime: newTime});
    document.querySelector("#animation-slider").value = newTime;
  }
}

function setPaused(paused, animatedModel) {
  document.querySelector("#pause-play-button").setAttribute("src", PAUSE_PLAY_ICONS[paused]);
  animatedModel.setAttribute("animation-player", {paused: paused});
}