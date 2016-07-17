var AFFDEX_SRV_URL = window.__env__.AFFDEX_JS_SDK_URL+'/';
var TEST_DATA_SRV_URL = window.__env__.TEST_DATA_SRV_URL+'/';
var FACE_FILE_URL = "videos/web_face_video.mp4";
var BLACK_FILE_URL = "videos/black.mp4";

describe("common detector tests", function() {
  var detectors = ["Detector", "FrameDetector", "PhotoDetector", "CameraDetector"];

  for(var i in detectors) {
    it(detectors[i]+" reset failure callback is called correctly", function(done) {
      var observer = {success: function(){}, failure: function(){}};
      spyOn(observer, "success");
      spyOn(observer, "failure");
      var detector = new affdex[detectors[i]]();
      detector.addEventListener("onResetSuccess", observer.success);
      detector.addEventListener("onResetFailure", observer.failure);
      detector.reset();

      setTimeout(function() {
        expect(observer.success).not.toHaveBeenCalled();
        expect(observer.failure).toHaveBeenCalled();
        done();
      }, 500);
    });

    it(detectors[i]+" stop failure callback is called correctly", function(done) {
      var observer = {success: function(){}, failure: function(){}};
      spyOn(observer, "success");
      spyOn(observer, "failure");
      var detector = new affdex[detectors[i]]();
      detector.addEventListener("onStopSuccess", observer.success);
      detector.addEventListener("onStopFailure", observer.failure);
      detector.stop();

      setTimeout(function() {
        expect(observer.success).not.toHaveBeenCalled();
        expect(observer.failure).toHaveBeenCalled();
        done();
      }, 500);
    });

    it("all expressions metrics are turned on when detectAllExpressions function called", function () {
      var detector = new affdex[detectors[i]]();
      detector.detectAllExpressions();
      for (var metric in detector.detectExpressions) {
        expect(detector.detectExpressions[metric]).toBe(true);
      }
      for (metric in detector.detectEmotions) {
        expect(detector.detectEmotions[metric]).toBe(false);
      }
      for (metric in detector.detectAppearance) {
        expect(detector.detectAppearance[metric]).toBe(false);
      }
    });

    it("all emotions metrics are turned on when detectAllEmotions function called", function () {
      var detector = new affdex[detectors[i]]();
      detector.detectAllEmotions();
      for (var metric in detector.detectEmotions) {
        expect(detector.detectEmotions[metric]).toBe(true);
      }
      for (metric in detector.detectExpressions) {
        expect(detector.detectExpressions[metric]).toBe(false);
      }
      for (metric in detector.detectAppearance) {
        expect(detector.detectAppearance[metric]).toBe(false);
      }
    });

    it("all appearance metrics are turned on when detectAllAppearance function called", function () {
      var detector = new affdex[detectors[i]]();
      detector.detectAllAppearance();
      for (var metric in detector.detectAppearance) {
        expect(detector.detectAppearance[metric]).toBe(true);
      }
      for (metric in detector.detectEmotions) {
        expect(detector.detectEmotions[metric]).toBe(false);
      }
      for (metric in detector.detectExpressions) {
        expect(detector.detectExpressions[metric]).toBe(false);
      }
    });

    it("emoji metrics are turned on when detectAllEmojis function called", function () {
      var detector = new affdex[detectors[i]]();
      detector.detectAllEmojis();
      for (var metric in detector.detectAppearance) {
        expect(detector.detectEmojis).toBe(true);
      }
      for (metric in detector.detectExpressions) {
        expect(detector.detectExpressions[metric]).toBe(false);
      }
      for (metric in detector.detectEmotions) {
        expect(detector.detectEmotions[metric]).toBe(false);
      }
    });

    it("all metrics are turned off by default", function () {
      var detector = new affdex[detectors[i]]();
      var claZZ = ["detectExpressions", "detectAppearance", "detectEmotions"];
      for (var indx in claZZ) {
        for (var metric in detector[claZZ[indx]]) {
          expect(detector[claZZ[indx]][metric]).toBe(false);
        }
      }
    });

    it("get callback returns the correct callback", function () {
      var detector = new affdex[detectors[i]]();
      var callbacks = [{"event":"onReset"},
                       {"event": "onWebcamConnect"},
                       {"event": "onInitialize"},
                       {"event": "onStop"}];
      // Stage data
      for (var indx in callbacks) {
        var bools = [true, false];
        for (var b in bools) {
          callbacks[indx].status = b;
          callbacks[indx].statusStr = b? "Success" : "Failure";
        }
      }

      for (indx in callbacks) {
        var eventName = callbacks[indx].event+callbacks[indx].statusStr;
        detector.addEventListener(eventName, function(){
          return eventName;
        });
        expect(detector.getCallback(callbacks[indx].event, callbacks[indx].status)()).toBe(eventName);

      }
    });

    it("add event listener adds the callback", function () {
      var detector = new affdex[detectors[i]]();
      var callbacks = ["onResetSuccess", "onImageResults", "onWebcamConnectFailure",
                       "onWebcamConnectSuccess", "onInitializeSuccess", "onStopSuccess"];
      for (var indx in callbacks) {
        detector.addEventListener(callbacks[indx], function(){return callbacks[indx]});
        expect(detector.callbacks[callbacks[indx]]()).toBe(callbacks[indx]);

      }
    });

    it("remove event listener removes the callback", function () {
      var detector = new affdex[detectors[i]]();
      var callbacks = ["onResetSuccess", "onImageResults", "onWebcamConnectFailure",
                       "onWebcamConnectSuccess", "onInitializeSuccess", "onStopSuccess"];
      for (var indx in callbacks) {
        detector.addEventListener(callbacks[indx], function(){return callbacks[indx]});
        expect(detector.callbacks[callbacks[indx]]()).toBe(callbacks[indx]);
      }

      for (indx in callbacks) {
        detector.removeEventListener(callbacks[indx]);
        expect(detector.callbacks[callbacks[indx]]).toBe(undefined);
      }
    });
  }

});

describe("camera detector tests", function() {
  var width = 640;
  var height = 480;
  var processFPS = 5;
  var newElement = null;

  beforeEach(function(){
    newElement = document.createElement('div');
    newElement.id = "affdex_elements";
    document.body.appendChild(newElement);
    spyOn(affdex, "getAffdexDotJsLocation").and.callFake(function() {
      return AFFDEX_SRV_URL;
    });
  });

  afterEach(function(){
    var divRoot = document.getElementById("affdex_elements");
    document.body.removeChild(divRoot);
  });

  it("constructor parameters to be set properly", function () {
    var divRoot = document.getElementById("affdex_elements");
    var width = 640;
    var height = 480;
    var processFPS = 30;
    var detector = new affdex.CameraDetector(divRoot, width, height);
      expect(detector.processFPS).toBe(processFPS);
      expect(detector.isRunning).toBe(false);
      expect(detector.staticMode).toBe(false);
      expect(detector.detectEmojis).toBe(false);
      expect(detector.isWorkerInitialized).toBe(false);
      expect(detector.faceDetectorMode).toBe(affdex.FaceDetectorMode.LARGE_FACES);
  });

  it("all expressions metrics are turned on when detectAllExpressions function called", function () {
    var detector = new affdex.CameraDetector(newElement, width, height);
    detector.detectAllExpressions();
    for (var metric in detector.detectExpressions) {
      expect(detector.detectExpressions[metric]).toBe(true);
    }
    for (metric in detector.detectEmotions) {
      expect(detector.detectEmotions[metric]).toBe(false);
    }
    for (metric in detector.detectAppearance) {
      expect(detector.detectAppearance[metric]).toBe(false);
    }
  });

  it("start function initializes attempts to call _startCamera callback", function (done) {
    var detector = new affdex.CameraDetector(newElement, width, height);
    spyOn(detector, "_startCamera").and.callFake(function(){
      expect(detector.videoElement.id).toBe("face_video");
      done();
    });

    detector.start();
  });

  /*it("_startCamera calls navigator.mediaDevices.getUserMedia with correct parameters", function () {
    var detector = new affdex.CameraDetector(newElement, width, height);
    //navigator = {mediaDevices: {getUserMedia: function(){}}};
    spyOn(navigator.mediaDevices, 'getUserMedia').and.callFake(function() {
      return {
        then: function(callback) { return this; },
        catch: function(callback) {}
      };
    });
    detector._startCamera();
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({video: true, audio: false});
  });*/

  it("camera denied callback is called if user denied camera", function (done) {
    var detector = new affdex.CameraDetector(newElement, width, height);
    var observer = {onWebcamConnectFailure: function(){done();}};
    spyOn(detector, "_startCamera").and.callFake(function() {
      this.getCallback("onWebcamConnect", false)();
    });
    detector.addEventListener("onWebcamConnectFailure", observer.onWebcamConnectFailure);
    detector.start();
  });

  it("camera allowed callback is called if user allowed the camera", function (done) {
    var detector = new affdex.CameraDetector(newElement, width, height);
    var observer = {onWebcamConnectSuccess: function(){ done(); }};
    detector.addEventListener("onWebcamConnectSuccess", observer.onWebcamConnectSuccess);
    spyOn(detector, "onWebcamReady").and.callFake(function(stream) {
      detector.getCallback("onWebcamConnect", true)();
    });
    spyOn(detector, "_startCamera").and.callFake(function() {
      detector.onWebcamReady(new Blob());
    });
    detector.start();
  });

  it("photo detector constructor parameters to be set properly", function () {
    var detector = new affdex.PhotoDetector();
      expect(detector.isRunning).toBe(false);
      expect(detector.staticMode).toBe(true);
      expect(detector.detectEmojis).toBe(false);
      expect(detector.isWorkerInitialized).toBe(false);
      expect(detector.faceDetectorMode).toBe(affdex.FaceDetectorMode.SMALL_FACES);
  });

 });

 describe("long and slow tests", function() {
   beforeAll(function(){
     spyOn(affdex, "getAffdexDotJsLocation").and.callFake(function() {
       return AFFDEX_SRV_URL;
     });
   });

   jasmine.DEFAULT_TIMEOUT_INTERVAL = 80000;
   var timeout = 13000;

   it("photo detector is started callback is called correctly", function(done) {
     var observer = {success: function(){done();}};
     var detector = new affdex.PhotoDetector(affdex.FaceDetectorMode.SMALL_FACES);
     detector.addEventListener("onInitializeSuccess", observer.success);
     detector.start();
    });

    it("frame detector is started callback is called correctly", function(done) {
      var observer = {success: function(){done();}};
      var detector = new affdex.FrameDetector();
      detector.addEventListener("onInitializeSuccess", observer.success);
      detector.start();
     });

     var detectors = ["FrameDetector", "PhotoDetector"];
     for(var i in detectors) {
       it(detectors[i]+" process failure callback is called correctly", function(done) {
         var observer = {success: function(){}, failure: function(){}};
         spyOn(observer, "success");
         spyOn(observer, "failure");
         var detector = new affdex[detectors[i]]();
         detector.addEventListener("onImageResultsSuccess", observer.success);
         detector.addEventListener("onImageResultsFailure", observer.failure);
         detector.process(null);

         setTimeout(function() {
           expect(observer.success).not.toHaveBeenCalled();
           expect(observer.failure).toHaveBeenCalled();
           done();
         }, 500);
       });

       it(detectors[i]+" reset success callback is called correctly", function(done) {
         var observer = {
         onInitializeSuccess: function(){detector.reset();},
         onResetSuccess: function(){done();},
         onResetFailure: function(){throw "onResetFailure is not expected";}};
         var detector = new affdex[detectors[i]]();
         detector.addEventListener("onInitializeSuccess", observer.onInitializeSuccess);
         detector.addEventListener("onResetSuccess", observer.onResetSuccess);
         detector.addEventListener("onResetFailure", observer.onResetFailure);
         detector.start();
       });
     }
});


  var photos = [
  {
    "path": "/photos/bicentennial.jpg", "metrics" : {
    "appearance": { "gender": "Unknown", "glasses": "No" },
    "expressions": {},
    "emotions": {} }
  },
  {
    "path": "/photos/matt-czuchry.jpg", "metrics" : {
    "appearance": { "gender": "Male", "glasses": "No" },
    "expressions": {},
    "emotions": {} }
  },
  {
     "path": "/photos/merkel.jpg", "metrics" : {
     "appearance": { "glasses": "No" },
     "expressions": {"smile": 99},
     "emotions": {"joy": 99} }
  },
  {
      "path": "/photos/steve_disgust.bmp", "metrics" : {
      "appearance": { "gender": "Male", "glasses": "No" },
      "expressions": {"browFurrow": 99},
      "emotions": {"anger": 37} }
  },
  {
     "path": "/photos/steve_neutral.bmp", "metrics" : {
     "appearance": { "gender": "Male", "glasses": "No" },
     "expressions": {"smile": 0, "innerBrowRaise": 0, "browRaise": 0,
                     "browFurrow": 0, "noseWrinkle": 0, "upperLipRaise": 0,
                     "lipCornerDepressor": 0, "chinRaise": 0, "lipPucker": 0,
                     "lipPress": 0, "lipSuck": 0, "mouthOpen": 0,
                     "smirk": 0, "eyeClosure": 0, "attention": 0},
     "emotions": { "joy": 0, "fear": 0, "sadness": 0, "anger": 0,
                   "disgust": 0, "surprise": 0, "contempt": 0 } }
   },
   {
      "path": "/photos/steve_surprised.bmp", "metrics" : {
      "appearance": { "gender": "Male", "glasses": "No" },
      "expressions": {"browRaise": 99},
      "emotions": {"surprise": 49} }
    }
];

 describe("processing tests", function() {
   jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
   var detector = null;
   beforeAll(function(done){
     spyOn(affdex, "getAffdexDotJsLocation").and.callFake(function() {
       return AFFDEX_SRV_URL;
     });
    detector = new affdex.PhotoDetector(affdex.FaceDetectorMode.SMALL_FACES);
    detector.detectAllEmotions();
    detector.detectAllExpressions();
    detector.detectAllAppearance();
    detector.addEventListener("onInitializeSuccess", function() { done(); });
    detector.addEventListener("onInitializeFailure", function() {
       throw "unable to initialize photo detector";
       done();
     });
     detector.start();
   });

   afterAll(function(done){
     detector.addEventListener("onStopSuccess", function() { done(); });
     if (detector) detector.stop();
   });

   function testPhotos(path, metrics) {
     describe("Testing "+path, function(){
       var img = null;
       var results = null;
       beforeEach(function(done){
         img = new Image();
         var canvas = document.createElement('canvas');
         var ctx = canvas.getContext('2d');
         img.onload = function(){
           canvas.width = img.width;
           canvas.height = img.height;
           ctx.drawImage(img, 0, 0, img.width, img.height); // Or at whatever offset you like
           var imgData = ctx.getImageData(0, 0, img.width, img.height);
           detector.addEventListener("onImageResultsSuccess", function(faces, imgData, timestamp){
             expect(faces.length).toEqual(1);
             results = faces;
             done();
           });
           detector.process(imgData);
         };
         img.src = path;
       });

       it("Test appearance metrics", function(){
         //Test Appearance metrics
         for (var metric in metrics.expressions) {
           expect(results[0].appearance[metric]).toEqual(metrics.appearance[metric], metric);
         }
       });

       it("Test expressions metrics", function(){
         //Test Non discreet metrics
         for (var metric in metrics.expressions) {
           expect(results[0].expressions[metric]).toBeGreaterThan(metrics.expressions[metric], metric);
         }
       });

       it("test emotions metrics", function(){
         //Test Non discreet metrics
         for (var metric in metrics.emotions) {
           expect(results[0].emotions[metric]).toBeGreaterThan(metrics.emotions[metric], metric);
         }
       });
     });
   }

   for (var indx in photos) {
     testPhotos(photos[indx].path, photos[indx].metrics);
   }
 });
