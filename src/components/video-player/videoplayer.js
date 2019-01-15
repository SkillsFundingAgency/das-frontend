
import GoogleTagManager from '../googleTagManager/_googleTagManager'
// import Plyr from 'plyr'

function VideoPlayer($module, $gtmDataLayer) {
    this.$module = $module;
    this.$videoPlayerId = this.$module.dataset.videoplayerid;
    this.$videoUrl = this.$module.dataset.videourl;
    this.$player = null;
    this.$playerElement = null;
    this.$playerClass = this.$module.dataset.playerclass;
    this.$videoPlayerTemplate = '<div class="video-player plyr__video-embed js-player visually-hidden" id="{videoPlayerId}"><div class="video-player--inner-wrap"><a class="video-player__close" href="#"><span class="video-player__close-icon"></span> Close</a><iframe src="{videoUrl}" allowfullscreen allowtransparency allow="autoplay"></iframe></div></div>';

    this.$trackingEnabled = $gtmDataLayer != null;
    this.$gtmDataLayer = $gtmDataLayer;
    this.$gtm = null;
}

VideoPlayer.prototype.init = function () {

    // Check module exists
    var $module = this.$module
    if (!$module) {
        return
    }

    this.appendPlayer();
    this.$playerElement = document.getElementById(this.$videoPlayerId);

    if (this.$playerClass != null) {
        this.$playerElement.classList.add(this.$playerClass);
    }

    this.$player = new Plyr(this.$playerElement);

    var event = 'click';
    if (this.$player.touch == true) {
        event = 'touchstart';
    }

    this.$module.addEventListener(event, this.play.bind(this));

    this.$closeButton = this.$playerElement.querySelector('.video-player__close');

    this.$closeButton.addEventListener(event, this.close.bind(this));

    this.$module.classList.toggle('visually-hidden');

    if (this.$trackingEnabled) {
        this.$gtm = new GoogleTagManager(this.$gtmDataLayer);
        this.enableEvents();
    }

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

VideoPlayer.prototype.isSmallScreen = function () {
    return window.innerWidth < 900;
}

VideoPlayer.prototype.enableEvents = function () {
    this.$player.on('play', event => {
        if (this.$player.currentTime == 0) {
            this.sendEvent('video_started');
        }
        else {
            this.sendEvent('video_play');
        }

        this.$playingTimer = setInterval(this.sendEvent('video_playing'), 5000);
    });

    this.$player.on('ended', event => {
        this.sendEvent('video_ended');
        clearInterval(this.$playingTimer);
    });

    this.$player.on('pause', event => {
        this.sendEvent('video_paused');
        clearInterval(this.$playingTimer);
    });


}
VideoPlayer.prototype.sendEvent = function (event) {

    var properties = {
        'currentTimestamp': this.$player.currentTime,
        'totalVideoDuration': this.$player.duration,
        'videoId': this.$player.embed.getVideoData().video_id
    }


    this.$gtm.sendEvent(event, properties)

}

export default VideoPlayer