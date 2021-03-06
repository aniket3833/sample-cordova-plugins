app.browser = {
    options: {
        location: 'yes',
        hidden: 'no',
        clearcache: 'yes',
        clearsessioncache: 'yes',
        zoom: 'no',
        hardwareback: 'no',
        mediaPlaybackRequiresUserAction: 'yes',
        closebuttoncaption: 'close',
        disallowoverscroll: 'yes',
        enableViewportScale: 'yes',
        allowInlineMediaPlayback: 'yes',
        keyboardDisplayRequiresUserInteraction: 'no',
        suppressIncrementalRendering: 'yes',
        presentationstyle: 'fullscreen',
        transitionstyle: 'coververtical',
        toolbarposition: 'bottom',
        fullscreen: 'yes'
    },
    
    // initialize the view
    init: function () {
        $('open').addEventListener('click', this.open.bind(this));
    },
    
    open: function() {
        var param = getOptions(this.options);
        this.ref = cordova.InAppBrowser.open('http://cordova.apache.org', '_blank', param);
        this.ref.addEventListener('loadstart', this.callBack.bind(this));
        this.ref.removeEventListener('loadstart', this.callback.bind(this));
    },
    
    callBack: function(e) {
        console.log(e);
    }
};

function getOptions(options) {
    var value = "";
    for(var key in options) {
        value += key + "=" + options[key] + "," ;
    }
    return value;
}

app.browser.init();