import cv2
from flask import Flask, Response

app = Flask(__name__)

def generate_frames():
    cap = cv2.VideoCapture(0)  # Access the webcam
    while cap.isOpened():
        ret, frame = cap.read()  # Read a frame
        if not ret:
            break

        # Flip the frame horizontally (left to right)

        print("ARE YOYU AADWA D")
        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()

        # Yield the MJPEG stream format
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    cap.release()  # Release the video capture when done

@app.route('/video_feed')
def video_feed():
    # Stream the flipped frames using MJPEG
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    # Run the app, accessible on localhost:5000
    app.run(host='0.0.0.0', port=5000, debug=False)
