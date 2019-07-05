var popupHtml = `
<style>
    .yt-persistent-popup {
        position: absolute;
        z-index: 1000;
        top: 20px;
        right: 20px;
    }
</style>

<div class="yt-persistent-popup">
    <div class="handle">
    </div>
    <div class="song-info">
        <h1 class="song-title">-</h1>
        <h2 class="song-supp-info">-</h2>
    </div>
    <div class="footer">
        <div class="song-progress-container">
            <div class="song-progress"></div>
            <input type="range" class="progress-slider"></input>
        </div>
        <div class="controls">
            <img class="controls-volume" src="../assets/volume-active.png" />
            <img class="controls-prev" src="../assets/prev.png" />
            <img class="controls-play-pause" src="../assets/play.png" />
            <img class="controls-next" src="../assets/next.png" />
            <img class="controls-hamburger" src="../assets/hamburger.png" />
        </div>
    </div>
</div>
`

var newBlock = document.createElement('div');
newBlock.innerHTML = popupHtml;

var topLevelEl = document.querySelector('html');
topLevelEl.appendChild(newBlock);