app.camera = {

    options: {
        quality: 50,
        // destinationType: navigator.camera.DestinationType.FILE_URI, // Will get the file path
        sourceType: navigator.camera.PictureSourceType.CAMERA,
        encodingType: navigator.camera.EncodingType.JPEG,
        mediaType: navigator.camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true, //Corrects Android orientation quirks
        destinationType: navigator.camera.DestinationType.DATA_URL  // will get the base64 content
    },
    
    // initialize the view
    init: function () {
        $('file-picker').addEventListener('click', this.filePicker.bind(this));
        $('get-picture').addEventListener('click', this.getPicture.bind(this));
        $('get-picture-thumbnail').addEventListener('click', this.thumbnails.bind(this));
    },
    
    // camera returned a photo
    success: function(img) {
        console.log('success: ', img);
        $('photo').style.backgroundImage = 'url('+ img + ')';
    },

    // camera returned an error
    error: function(msg) {
        alert(msg);
        console.error('error: ', msg);
    },
    
    // getPicture
    getPicture: function() {
        console.log('getPicture()');
        navigator.camera.getPicture(downloadFile, this.error, this.options);
    },
    
    // get file URI
    filePicker: function() {
        console.log('filePicker()');
        var o = this.options;
        o.sourceType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
        navigator.camera.getPicture(this.success, this.error, o);
    },
    
    // resize pictures as thumbnails
    thumbnails: function() {
        console.log('thumbnails()');
        var o = this.options;
        o.targetHeight = 100;
        o.targetWidth = 100;
        navigator.camera.getPicture(this.success, this.error, o);        
    }    
}

function downloadFile(fileUrl) {
    var blob = b64toBlob(fileUrl);
    console.log(blob);
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
        var absPath = cordova.file.externalRootDirectory;
        var fileDir = "cordova";
        var file_name = new Date().getTime() + ".jpeg";
        
        fs.root.getDirectory(fileDir, { create: true }, function (file) {
            // find the file otherwise create a new file
            file.getFile(file_name, { create: true, exclusive: false }, function (fileEntry) {
                writeFile(fileEntry, blob);
            }, app.camera.error);
        });
        
    });
}

function writeFile(fileEntry, data, isAppend) {
    // Create a FileWriter object for our FileEntry.
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            console.log("Successful file write...");
            if (data.type == "image/jpeg") {
                readBinaryFile(fileEntry);
            }
        };

        fileWriter.onerror = function(e) {
            console.log("Failed file write: " + e.toString());
        };

        fileWriter.write(data);
    });
}

function readBinaryFile(fileEntry) {
    fileEntry.file(function (file) {
        var reader = new FileReader();

        reader.onloadend = function() {
            console.log("Successful file write: " + this.result);
            var blob = new Blob([new Uint8Array(this.result)], { type: "image/jpeg" });
            var elem = document.getElementById('photo');
            elem.src = window.URL.createObjectURL(blob);
        };

        reader.readAsArrayBuffer(file);

    }, app.camera.error);
}

function b64toBlob(dataURI) {

    var byteString = atob(dataURI.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
}

app.camera.init();