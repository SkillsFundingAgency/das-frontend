
import GoogleTagManager from '../googleTagManager/_googleTagManager'
// import Plyr from 'plyr'

function VideoPlayer($module, $gtmDataLayer) {
    this.$module = $module;
    this.$videoPlayerId = this.$module.dataset.videoplayerid;
    this.$videoUrl = this.$module.dataset.videourl;
    this.$player = null;
    this.$playerElement = null;
    this.$videoWrap = null;
    this.$playerClass = this.$module.dataset.playerclass;
    this.$videoPlayerTemplate = '<div class="video-player__wrap"><a href="#" class="video-player__close" id="close-{videoPlayerId}" tabindex="0">Close</a><div class="video-player plyr__video-embed js-player visually-hidden" id="{videoPlayerId}"><div class="video-player--inner-wrap"><iframe src="{videoUrl}" allowfullscreen allowtransparency allow="autoplay"></iframe></div></div></div>';

    this.$trackingEnabled = $gtmDataLayer != null;
    this.$gtmDataLayer = $gtmDataLayer;
    this.$gtm = null;

    this.$playingTimer = null;
    this.$playingTimerTimespan = 5000;
}

VideoPlayer.prototype.init = function () {

    // Check module exists
    var $module = this.$module
    if (!$module) {
        return
    }

    this.appendPlayer();
    this.$playerElement = document.getElementById(this.$videoPlayerId);
    this.$videoWrap = this.$playerElement.parentNode;

    if (this.$playerClass != null) {
        this.$videoWrap.classList.add(this.$playerClass);
    }

    this.$player = new Plyr(this.$playerElement, {
        fullscreen: { enabled: true }
    });

    var event = 'click';
    if (this.$player.touch == true) {
        event = 'touchstart';
    }

    this.$module.addEventListener(event, this.play.bind(this));

    this.$closeButton = document.getElementById('close-' + this.$videoPlayerId);
    this.$closeButton.addEventListener('click', this.close.bind(this));

    this.$module.classList.remove('visually-hidden');

    if (this.$trackingEnabled) {
        this.$gtm = new GoogleTagManager(this.$gtmDataLayer);
        this.enableTrackingEvents();
    }

}

VideoPlayer.prototype.appendPlayer = function () {
    var playerHtml = this.$videoPlayerTemplate.replace(/{videoPlayerId}/g, this.$videoPlayerId).replace('{videoUrl}', this.$videoUrl);
    window.document.body.insertAdjacentHTML('beforeend', playerHtml);
}

VideoPlayer.prototype.close = function (event) {
    this.$videoWrap.classList.remove('video-player__playing');
    this.$module.classList.remove('js-video-player__playing');
    this.$player.stop();
    event.preventDefault();
}

VideoPlayer.prototype.play = function (event) {
    var that = this;
    this.$videoWrap.classList.add('video-player__playing');
    this.$module.classList.add('js-video-player__playing');
    this.$player.play();

    window.addEventListener('keydown', function(e){
        if((e.key=='Escape'||e.key=='Esc')){
            that.close(e);
            e.preventDefault();
            return false;
        }
    }, true);

    this.$closeButton.focus();
    event.preventDefault();
}

VideoPlayer.prototype.enableTrackingEvents = function () {
    var that = this;
    this.$player.on('play', function(event) {
        if (that.$player.currentTime == 0) {
            that.sendEvent('video_started');
        }
        else {
            that.sendEvent('video_play');
        }

        that.$playingTimer = setInterval(that.sendPlayingEvent.bind(that,that), that.$playingTimerTimespan);
    });

    this.$player.on('ended', function(event) {
        that.sendEvent('video_ended');
        clearInterval(that.$playingTimer);
    });

    this.$player.on('pause', function(event) {
        that.sendEvent('video_paused');
        clearInterval(that.$playingTimer);
    });


}
VideoPlayer.prototype.sendEvent = function (event) {

    var properties = {
        'currentTimestamp': round(this.$player.currentTime,1),
        'totalVideoPlayed': round(this.$player.currentTime/this.$player.duration,2),
        'totalVideoDuration': this.$player.duration,
        'videoId': this.$player.embed.getVideoData().video_id
    }
    this.$gtm.sendEvent(event, properties)
}

VideoPlayer.prototype.sendPlayingEvent = function (vp) {
    vp.sendEvent('video_playing')
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

export default VideoPlayer