
import cv2
import numpy as np
import mediapipe as mp
import math
import threading
import http.server
import socketserver
import base64
import json
import asyncio
import time

# Global state for players
pressed_player1 = False
pressed_player2 = False
loop = True
game_result = {"score": 0.0, "message": ""}
countdownStart = True
stopwatch_running = False
start_time = None
end_time = None
winner_text = ""  # Variable to hold the winner text

# Create an asyncio event loop for the countdown
countdown_loop = asyncio.new_event_loop()

async def countdown():
    """Async function that performs a countdown before the game starts."""
    global stopwatch_running, start_time
    for i in range(13, 0, -1):  # Countdown from 9 to 1 seconds
        print(f"Countdown: {i} seconds remaining")
        await asyncio.sleep(1)

    print("Countdown finished! Starting game...")
    stopwatch_running = True
    start_time = time.time()

def start_countdown():
    """Starts the countdown in a separate thread without blocking execution."""
    asyncio.set_event_loop(countdown_loop)
    countdown_loop.run_until_complete(countdown())

# Create a separate thread for countdown handling
countdown_thread = threading.Thread(target=start_countdown, daemon=True)

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_POST(self):
        global pressed_player1, pressed_player2, loop, countdownStart, countdown_thread
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode("utf-8", errors="replace")

        if "user1" in post_data:
            pressed_player1 = True
        elif "user2" in post_data:
            pressed_player2 = True
        elif "start" in post_data:
            print("STAAAART")
            loop = True
            countdownStart = True

            # Only start the countdown thread if it hasn't already started
            if not countdown_thread.is_alive():
                countdown_thread = threading.Thread(target=start_countdown, daemon=True)
                countdown_thread.start()

        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps({"status": "OK"}).encode("utf-8"))

    def do_GET(self):
        global loop, game_result
        if not loop:
            response = {
                "score": game_result["score"],
                "message": game_result["message"]
            }
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(response).encode("utf-8"))
        else:
            self.send_response(204)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()

def start_http_server(port=8080):
    with socketserver.TCPServer(("0.0.0.0", port), MyHandler) as httpd:
        httpd.serve_forever()

# Start HTTP server in a separate thread
server_thread = threading.Thread(target=start_http_server, daemon=True)
server_thread.start()

class Node:
    def __init__(self, landmark, frame):
        self.pos_x = int(landmark.x * frame.shape[1])
        self.pos_y = int(landmark.y * frame.shape[0])

    def get_position(self):
        return self.pos_x, self.pos_y

def calculate_angle(node1, node2):
    x1, y1 = node1.get_position()
    x2, y2 = node2.get_position()
    angle_deg = math.degrees(math.atan2(y2 - y1, x2 - x1))
    if angle_deg < 0:
        angle_deg += 360
    return angle_deg

mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

pose_left = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)
pose_right = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    height, width, _ = frame.shape
    half_w = width // 2

    left_view = frame[:, 0:half_w, :]
    right_view = frame[:, half_w:width, :]

    left_rgb = cv2.cvtColor(left_view, cv2.COLOR_BGR2RGB)
    right_rgb = cv2.cvtColor(right_view, cv2.COLOR_BGR2RGB)

    results_left = pose_left.process(left_rgb)
    results_right = pose_right.process(right_rgb)

    touch_player1, touch_player2 = False, False

    # Process Player 2 (left side)
    if results_left.pose_landmarks:
        mp_drawing.draw_landmarks(left_view, results_left.pose_landmarks, [(mp_pose.PoseLandmark.RIGHT_ELBOW, mp_pose.PoseLandmark.RIGHT_WRIST)])
        elbow = results_left.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_ELBOW]
        wrist = results_left.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_WRIST]
        angle = calculate_angle(Node(elbow, left_view), Node(wrist, left_view))
        if angle >= 330 or angle <= 30:
            touch_player2 = True

    # Process Player 1 (right side)
    if results_right.pose_landmarks:
        mp_drawing.draw_landmarks(right_view, results_right.pose_landmarks, [(mp_pose.PoseLandmark.RIGHT_ELBOW, mp_pose.PoseLandmark.RIGHT_WRIST)])
        elbow = results_right.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_ELBOW]
        wrist = results_right.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_WRIST]
        angle = calculate_angle(Node(elbow, right_view), Node(wrist, right_view))
        if 150 <= angle <= 210:
            touch_player1 = True

    # Determine Winner (fixing issue)
    if touch_player1 and pressed_player1 and loop:
        end_time = time.time()
        print("🍎 Player 1 wins!")
        loop = False
        pressed_player1 = False  # Only reset after confirming the win
        game_result = {"score": f"0", "message": "Player 1 win!"}
        winner_text = "Player 1 wins!"  # Set winner text
        stopwatch_running = False
        start_time = None

    elif touch_player2 and pressed_player2 and loop:
        end_time = time.time()
        print("🍊 Player 2 wins!")
        loop = False
        pressed_player2 = False  # Only reset after confirming the win
        game_result = {"score": f"0", "message": "Player 2 win!"}
        winner_text = "Player 2 wins!"  # Set winner text
        stopwatch_running = False
        start_time = None

    # Reset if "R" key is pressed
    if cv2.waitKey(1) & 0xFF == ord('r'):  # Check if 'R' is pressed
        loop = True
        countdownStart = True
        winner_text = ""  # Clear winner text
        print("🔄 Resetting game...")

    # Display the winner text on the frame if available
    if winner_text != "":
        cv2.putText(frame, winner_text, (int(width // 15), int(height // 2)), cv2.FONT_HERSHEY_SIMPLEX, 3, (0, 0, 255), 5, cv2.LINE_AA)

    # Combine left and right views with skeleton overlay
    combined = np.hstack((left_view, right_view))
    flipped = cv2.flip(combined, 1)

    cv2.imshow("Final Output", combined)

    if cv2.waitKey(1) & 0xFF == ord('q'):  # Exit on 'q' press
        break

cap.release()
cv2.destroyAllWindows()
 
