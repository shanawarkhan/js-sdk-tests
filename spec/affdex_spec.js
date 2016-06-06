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
  var newElement = document.createElement('div');

  beforeEach(function(){
    spyOn(affdex, "getAffdexDotJsLocation").and.callFake(function() {
      return AFFDEX_SRV_URL;
    });
  });

  it("constructor parameters to be set properly", function () {
    var divRoot = document.getElementById("affdex_elements");
    var width = 640;
    var height = 480;
    var processFPS = 30;
    var detector = new affdex.CameraDetector(divRoot, width, height, processFPS);
      expect(detector.processFPS).toBe(processFPS);
      expect(detector.isRunning).toBe(false);
      expect(detector.staticMode).toBe(false);
      expect(detector.detectEmojis).toBe(false);
      expect(detector.isWorkerInitialized).toBe(false);
      expect(detector.faceDetectorMode).toBe(affdex.FaceDetectorMode.LARGE_FACES);
  });

  it("all expressions metrics are turned on when detectAllExpressions function called", function () {
    var detector = new affdex.CameraDetector(newElement, width, height, processFPS);
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

  it("start function initializes attempts to call navigator.getMedia with correct parameters", function () {
    spyOn(newElement, "appendChild");
    spyOn(navigator, "getMedia");
    var detector = new affdex.CameraDetector(newElement, width, height, processFPS);
    detector.start();
    expect(newElement.appendChild).toHaveBeenCalled();
    expect(navigator.getMedia).toHaveBeenCalledWith({video: true, audio: false},
                              jasmine.any(Function), jasmine.any(Function));
    expect(detector.videoElement.id).toBe("face_video");
  });

  it("camera denied callback is called if user denied camera", function () {
    spyOn(newElement, "appendChild");

    var observer = {onWebcamConnectFailure: function(){}};
    spyOn(observer, "onWebcamConnectFailure");
    spyOn(navigator, "getMedia").and.callFake(function() {
      detector.getCallback("onWebcamConnect", false)();
    });
    var detector = new affdex.CameraDetector(newElement, width, height, processFPS);
    detector.addEventListener("onWebcamConnectFailure", observer.onWebcamConnectFailure);
    detector.start();
    expect(newElement.appendChild).toHaveBeenCalled();
    expect(navigator.getMedia).toHaveBeenCalledWith({video: true, audio: false},
                              jasmine.any(Function), observer.onWebcamConnectFailure);
    expect(observer.onWebcamConnectFailure).toHaveBeenCalled();
  });

  it("camera allowed callback is called if user allowed the camera", function () {
    spyOn(newElement, "appendChild");
    var detector = new affdex.CameraDetector(newElement, width, height, processFPS);
    var observer = {onWebcamConnectSuccess: function(){}};
    spyOn(observer, "onWebcamConnectSuccess");
    detector.addEventListener("onWebcamConnectSuccess", observer.onWebcamConnectSuccess);
    spyOn(detector, "onWebcamReady").and.callFake(function(stream) {
      detector.getCallback("onWebcamConnect", true)();
    });
    spyOn(navigator, "getMedia").and.callFake(function() {
      detector.onWebcamReady(new Blob());
    });
    detector.start();
    expect(newElement.appendChild).toHaveBeenCalled();
    expect(navigator.getMedia).toHaveBeenCalledWith({video: true, audio: false},
                              jasmine.any(Function), jasmine.any(Function));
    expect(observer.onWebcamConnectSuccess).toHaveBeenCalled();
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
   beforeEach(function(){
     spyOn(affdex, "getAffdexDotJsLocation").and.callFake(function() {
       return AFFDEX_SRV_URL;
     });
   });

   jasmine.DEFAULT_TIMEOUT_INTERVAL = 80000;
   var timeout = 13000;

   it("photo detector is started callback is called correctly", function(done) {
     var observer = {onInitializeSuccess: function(){}};
     spyOn(observer, "onInitializeSuccess");
     var detector = new affdex.PhotoDetector();
     detector.addEventListener("onInitializeSuccess", observer.onInitializeSuccess);
     detector.detectAllExpressions();
     detector.start();

      setTimeout(function() {
        expect(observer.onInitializeSuccess).toHaveBeenCalled();
        done();
      }, timeout);
    });

    it("frame detector is started callback is called correctly", function(done) {
      var observer = {onInitializeSuccess: function(){}};
      spyOn(observer, "onInitializeSuccess");
      var detector = new affdex.FrameDetector();
      detector.addEventListener("onInitializeSuccess", observer.onInitializeSuccess);
      detector.detectAllExpressions();
      detector.start();

       setTimeout(function() {
         expect(observer.onInitializeSuccess).toHaveBeenCalled();
         done();
       }, timeout);
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
         var observer = {onInitializeSuccess: function(){
           detector.reset();
           setTimeout(function() {
             expect(observer.onResetSuccess).toHaveBeenCalled();
             done();
           }, timeout);
         },
         onResetSuccess: function(){}};
         spyOn(observer, "onResetSuccess");
         var detector = new affdex[detectors[i]]();
         detector.addEventListener("onInitializeSuccess", observer.onInitializeSuccess);
         detector.addEventListener("onResetSuccess", observer.onResetSuccess);
         detector.detectAllExpressions();
         detector.start();
       });
     }
});
