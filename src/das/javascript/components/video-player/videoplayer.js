
import GoogleTagManager from '../googleTagManager/_googleTagManager'
// import Plyr from 'plyr'

function VideoPlayer($module, $gtmDataLayer) {
    this.$module = $module;
    this.$videoPlayerId = this.$module.dataset.videoplayerid;
    this.$videoUrl = this.$module.dataset.videourl;
    this.$href = null;
    this.$id = null;
    this.$player = null;
    this.$playerElement = null;
    this.$videoWrap = null;
    this.$playerClass = this.$module.dataset.playerclass;
    this.$videoPlayerTemplate = `
        <div class="video-player__wrap">
            <a href="#" class="video-player__close" id="close-{videoPlayerId}" tabindex="0">Close the video player</a>
            <div class="video-player plyr__video-embed js-player visually-hidden" id="{videoPlayerId}">
                <div class="video-player--inner-wrap">
                    <iframe src="{videoUrl}" allowfullscreen allowtransparency allow="autoplay"></iframe>
                </div>
            </div>
            <a href="#" class="button button-inverted video-player__unmute" id="unmute-{videoPlayerId}" tabindex="0">Unmute</a>
        </div>
    `;

    this.$trackingEnabled = $gtmDataLayer != null;
    this.$gtmDataLayer = $gtmDataLayer;
    this.$gtm = null;

    this.$playingTimer = null;
    this.$playingTimerTimespan = 5000;

    this.$iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
}

VideoPlayer.prototype.init = function () {

    // Check module exists
    var $module = this.$module

    if (!$module) {
        return
    }
    var event = 'click';

    this.$module.addEventListener(event, this.play.bind(this));
    this.$href = this.$module.getAttribute('href');

}

VideoPlayer.prototype.initPlayer = function () {
    this.appendPlayer();
    this.$playerElement = document.getElementById(this.$videoPlayerId);
    this.$videoWrap = this.$playerElement.parentNode;
    this.$id = this.$module.getAttribute('id');
    var $idfocus = document.getElementById(this.$id);

    if (this.$playerClass != null) {
        this.$videoWrap.classList.add(this.$playerClass);
    }

    this.$player = new Plyr(this.$playerElement, {
        fullscreen: { enabled: true }
    });

    this.$closeButton = document.getElementById('close-' + this.$videoPlayerId);
    this.$closeButton.addEventListener('click', this.close.bind(this));
    this.$closeButton.addEventListener('click', function(){
        $idfocus.focus();
    });

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

    this.iOSSetup();

    this.$player.stop();
    event.preventDefault();
}

VideoPlayer.prototype.unmute = function (event) {
    this.$player.muted = false;
    this.$unmuteButton.classList.remove('video-player--ready');
    event.preventDefault();
}

VideoPlayer.prototype.redirectToHref = function () {
    if (this.$player.ready == false) {
        this.sendEvent('video_redirection', function () {
            window.location.href = this.$href;
        })
    }
}
VideoPlayer.prototype.play = function (event) {

    var that = this;
    if (this.$player == undefined) {
        this.initPlayer();

        window.setTimeout(that.redirectToHref.bind(this), 3500)

        this.$player.on('ready', function () {
            that.iOSSetup();
            that.$player.play();
        });
    }

    this.$videoWrap.classList.add('video-player__playing');
    this.$module.classList.add('js-video-player__playing');

    if (this.$player.ready) {
        that.iOSSetup();
        that.$player.play();
    }
    window.addEventListener('keydown', function (e) {
        if ((e.key == 'Escape' || e.key == 'Esc')) {
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
    this.$player.on('play', function (event) {
        if (that.$player.currentTime == 0) {
            that.sendEvent('video_started');
        }
        else {
            that.sendEvent('video_play');
        }

        that.$playingTimer = setInterval(that.sendPlayingEvent.bind(that, that), that.$playingTimerTimespan);
    });

    this.$player.on('ended', function (event) {
        that.sendEvent('video_ended');
        clearInterval(that.$playingTimer);
    });

    this.$player.on('pause', function (event) {
        that.sendEvent('video_paused');
        clearInterval(that.$playingTimer);
    });

}
VideoPlayer.prototype.sendEvent = function (event, callback) {
    //only send the event if there is a GTM instance to send it to.
    if (this.$gtm != null) {
        var properties = {
            'currentTimestamp': round(this.$player.currentTime, 1),
            'totalVideoPlayed': round(this.$player.currentTime / this.$player.duration, 2),
            'totalVideoDuration': this.$player.duration,
            'videoId': this.$player.embed.getVideoData().video_id
        }
        if (callback != null) {
            properties.eventCallback = callback;
        }
        this.$gtm.sendEvent(event, properties)
    }
}

VideoPlayer.prototype.sendPlayingEvent = function (vp) {
    vp.sendEvent('video_playing')
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

VideoPlayer.prototype.iOSSetup = function () {
    if (this.$iOS == true) {
        this.$unmuteButton = document.getElementById('unmute-' + this.$videoPlayerId);
        this.$unmuteButton.addEventListener('click', this.unmute.bind(this));
        this.$unmuteButton.classList.add('video-player--ready');

        this.$player.muted = true;
    }
}

export default VideoPlayer
