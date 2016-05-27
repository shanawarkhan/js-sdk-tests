describe("camera detector tests", function() {
  var width = 640;
  var height = 480;
  var processFPS = 5;
  var newElement = document.createElement('div');
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

  it("all emotions metrics are turned on when detectAllEmotions function called", function () {
    var detector = new affdex.CameraDetector(newElement, width, height, processFPS);
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
    var detector = new affdex.CameraDetector(newElement, width, height, processFPS);
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
    var detector = new affdex.CameraDetector(newElement, width, height, processFPS);
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
    var detector = new affdex.CameraDetector(newElement, width, height, processFPS);
    var claZZ = ["detectExpressions", "detectAppearance", "detectEmotions"];
    for (var indx in claZZ) {
      for (var metric in detector[claZZ[indx]]) {
        expect(detector[claZZ[indx]][metric]).toBe(false);
      }
    }
  });

  it("get callback returns the correct callback", function () {
    var detector = new affdex.CameraDetector(newElement, width, height, processFPS);
    var callbacks = ["onReset", "onImageResults", "onWebcamDenied",
                     "onWebcamAllowed", "onInitialized", "onStopped"];
    for (var indx in callbacks) {
      detector.addEventListener(callbacks[indx], function(){return callbacks[indx]});
      expect(detector.getCallback([callbacks[indx]])()).toBe(callbacks[indx]);

    }
  });

  it("add event listener adds the callback", function () {
    var detector = new affdex.CameraDetector(newElement, width, height, processFPS);
    var callbacks = ["onReset", "onImageResults", "onWebcamDenied",
                     "onWebcamAllowed", "onInitialized", "onStopped"];
    for (var indx in callbacks) {
      detector.addEventListener(callbacks[indx], function(){return callbacks[indx]});
      expect(detector.callbacks[callbacks[indx]]()).toBe(callbacks[indx]);

    }
  });

  it("remove event listener removes the callback", function () {
    var detector = new affdex.CameraDetector(newElement, width, height, processFPS);
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
      detector.onWebcamReady(null);
    });
    detector.start();
    expect(newElement.appendChild).toHaveBeenCalled();
    expect(navigator.getMedia).toHaveBeenCalledWith({video: true, audio: false},
                              jasmine.any(Function), jasmine.any(Function));
    expect(observer.onWebcamAllowed).toHaveBeenCalled();
  });

 });
