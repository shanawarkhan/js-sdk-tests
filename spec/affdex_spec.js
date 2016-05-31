var AFFDEX_SRV_URL = window.__env__.AFFDEX_JS_SDK_URL+'/';
var TEST_DATA_SRV_URL = window.__env__.TEST_DATA_SRV_URL+'/';
var FACE_FILE_URL = "videos/web_face_video.mp4";
var BLACK_FILE_URL = "videos/black.mp4";

describe("common detector tests", function() {
  var detectors = ["Detector", "FrameDetector", "PhotoDetector", "CameraDetector"];

  for(var i in detectors) {
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
      var callbacks = ["onReset", "onImageResults", "onWebcamDenied",
                       "onWebcamAllowed", "onInitialized", "onStopped"];
      for (var indx in callbacks) {
        detector.addEventListener(callbacks[indx], function(){return callbacks[indx]});
        expect(detector.getCallback([callbacks[indx]])()).toBe(callbacks[indx]);

      }
    });

    it("add event listener adds the callback", function () {
      var detector = new affdex[detectors[i]]();
      var callbacks = ["onReset", "onImageResults", "onWebcamDenied",
                       "onWebcamAllowed", "onInitialized", "onStopped"];
      for (var indx in callbacks) {
        detector.addEventListener(callbacks[indx], function(){return callbacks[indx]});
        expect(detector.callbacks[callbacks[indx]]()).toBe(callbacks[indx]);

      }
    });

    it("remove event listener removes the callback", function () {
      var detector = new affdex[detectors[i]]();
      var callbacks = ["onReset", "onImageResults", "onWebcamDenied",
                       "onWebcamAllowed", "onInitialized", "onStopped"];
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
    var processFPS = 5;
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

    var observer = {onWebcamDenied: function(){}};
    spyOn(observer, "onWebcamDenied");
    spyOn(navigator, "getMedia").and.callFake(function() {
      detector.getCallback("onWebcamDenied")();
    });
    var detector = new affdex.CameraDetector(newElement, width, height, processFPS);
    detector.addEventListener("onWebcamDenied", observer.onWebcamDenied);
    detector.start();
    expect(newElement.appendChild).toHaveBeenCalled();
    expect(navigator.getMedia).toHaveBeenCalledWith({video: true, audio: false},
                              jasmine.any(Function), observer.onWebcamDenied);
    expect(observer.onWebcamDenied).toHaveBeenCalled();
  });

  it("camera allowed callback is called if user allowed the camera", function () {
    spyOn(newElement, "appendChild");
    var detector = new affdex.CameraDetector(newElement, width, height, processFPS);
    var observer = {onWebcamAllowed: function(){}};
    spyOn(observer, "onWebcamAllowed");
    detector.addEventListener("onWebcamAllowed", observer.onWebcamAllowed);
    spyOn(detector, "onWebcamReady").and.callFake(function(stream) {
      detector.getCallback("onWebcamAllowed")();
    });
    spyOn(navigator, "getMedia").and.callFake(function() {
      detector.onWebcamReady(new Blob());
    });
    detector.start();
    expect(newElement.appendChild).toHaveBeenCalled();
    expect(navigator.getMedia).toHaveBeenCalledWith({video: true, audio: false},
                              jasmine.any(Function), jasmine.any(Function));
    expect(observer.onWebcamAllowed).toHaveBeenCalled();
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
     var observer = {onInitialized: function(){}};
     spyOn(observer, "onInitialized");
     var detector = new affdex.PhotoDetector();
     detector.addEventListener("onInitialized", observer.onInitialized);
     detector.detectAllExpressions();
     detector.start();

      setTimeout(function() {
        expect(observer.onInitialized).toHaveBeenCalled();
        done();
      }, timeout);
    });

    it("frame detector is started callback is called correctly", function(done) {
      var observer = {onInitialized: function(){}};
      spyOn(observer, "onInitialized");
      var detector = new affdex.FrameDetector();
      detector.addEventListener("onInitialized", observer.onInitialized);
      detector.detectAllExpressions();
      detector.start();

       setTimeout(function() {
         expect(observer.onInitialized).toHaveBeenCalled();
         done();
       }, timeout);
     });
});
