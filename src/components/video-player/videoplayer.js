function VideoPlayer($module) {
    this.$module = $module;
    this.$videoPlayerId = this.$module.dataset.videoplayerid;
    this.$videoUrl = this.$module.dataset.videourl;
    this.$player = null;
    this.$playerElement = null;
    this.$playerClass = this.$module.dataset.playerclass;
    this.$videoPlayerTemplate = '<div class="video-player plyr__video-embed js-player visually-hidden" id="{videoPlayerId}"><div class="video-player--inner-wrap"><a class="video-player__close" href="#"><span class="video-player__close-icon"></span> Close</a><iframe src="{videoUrl}" allowfullscreen allowtransparency allow="autoplay"></iframe></div></div>';
}

VideoPlayer.prototype.init = function () {

    // Check module exists
    var $module = this.$module
    if (!$module) {
        return
    }

    this.appendPlayer();
    this.$playerElement = document.getElementById(this.$videoPlayerId);

    if(this.$playerClass != null){
        this.$playerElement.classList.add(this.$playerClass);
    }

    this.$player = new Plyr(this.$playerElement);

    this.$module.addEventListener("click",this.play.bind(this));
    this.$module.addEventListener("touchstart",this.play.bind(this));

    this.$closeButton = this.$playerElement.querySelector('.video-player__close');

    this.$closeButton.addEventListener("click",this.close.bind(this));
    this.$closeButton.addEventListener("touchstart",this.close.bind(this));

    this.$module.classList.toggle('visually-hidden');
}

VideoPlayer.prototype.appendPlayer = function () {

    var playerHtml = this.$videoPlayerTemplate.replace('{videoPlayerId}', this.$videoPlayerId).replace('{videoUrl}', this.$videoUrl);
    
    window.document.body.insertAdjacentHTML('beforeend', playerHtml);
}

VideoPlayer.prototype.close = function () {
    if (this.$player.fullscreen.active) {
        this.$player.fullscreen.exit();
    }
    this.$player.stop();
}

VideoPlayer.prototype.play = function (event) {
    this.$player.play();
    if (this.isSmallScreen()) {
        this.$player.fullscreen.enter();
    }
    event.preventDefault();
}

VideoPlayer.prototype.isSmallScreen = function(){
   return window.innerWidth < 900;
}
export default VideoPlayer