const video = document.getElementById("video");

// Using this ---> calling all functions asynchronously parallaly
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("./models"), // calling face-detection api using the model with tinyFaceDetector
  faceapi.nets.faceLandmark68Net.loadFromUri("./models"), // Used To Detects --> Face parts
  faceapi.nets.faceRecognitionNet.loadFromUri("./models"), // Used To Detects ---> To recognize where my face is box around it
  faceapi.nets.faceExpressionNet.loadFromUri("./models"), // Used To Detects ---> To recognize the expressions of face
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    {
      video: {},
    },
    (stream) => (video.srcObject = stream),
    (err) => console.log(err)
  );
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video); // To draw the canvas on the video frame around our face
  document.body.append(canvas);

  const displaySize = { width: video.width, height: video.height };

  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    console.log(detections);

    const resizeDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizeDetections);

    faceapi.draw.drawFaceLandmarks(canvas, resizeDetections); // To draw canvas of face part marks on the canvas

    faceapi.draw.drawFaceExpressions(canvas, resizeDetections); // To draw the face expressions
  }, 100);
});
