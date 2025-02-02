import cv2
import numpy as np
import mediapipe as mp
import math
import threading
import http.server
import socketserver
import base64
import json
import time


from database.model import *

# Global state for players (optional)
pressed_player1 = False
pressed_player2 = False
loop = False

##Countdown
time1_s = 7
time2_s = 3
time_counter = time.time()
time_to_shoot = False
chrono = None
##

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")  # Allow all origins or specify your frontend URL
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_POST(self):
        global pressed_player1, pressed_player2, loop, user1_name, user2_name
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode("utf-8", errors="replace")

        if "user1" in post_data:
            pressed_player1 = True
        elif "user2" in post_data:
            pressed_player2 = True
        elif "start" in post_data:
            print("STAAAART")
            loop = True

        
        elif "user1_name" in post_data:
            user1_name = post_data.split("=")[1]
            create_user(user1_name)
        elif "user2_name" in post_data:
            user2_name = post_data.split("=")[1]
            create_user(user2_name)



        ret, frame = cap.read()
        if not ret:
            return

        _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 60])
        jpg_as_base64 = base64.b64encode(buffer).decode('utf-8')

        response = {
            "status": "OK",
            "image": jpg_as_base64
        }

        # Send CORS headers and response
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")  # Allow all origins or specify your frontend URL
        self.end_headers()
        self.wfile.write(json.dumps(response).encode("utf-8"))

def start_http_server(port=8080):
    with socketserver.TCPServer(("0.0.0.0", port), MyHandler) as httpd:
        httpd.serve_forever()

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
###


cap = cv2.VideoCapture(0)
while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    _, buffer = cv2.imencode('.jpg', frame)
    jpg_as_base64 = base64.b64encode(buffer).decode('utf-8')


    ####
    height, width, channels = frame.shape
    half_w = width // 2

    left_view = frame[:, 0:half_w, :]
    right_view = frame[:, half_w:width, :]

    left_rgb = cv2.cvtColor(left_view, cv2.COLOR_BGR2RGB)
    right_rgb = cv2.cvtColor(right_view, cv2.COLOR_BGR2RGB)

    results_left = pose_left.process(left_rgb)
    touch_player2 = False
    if results_left.pose_landmarks:
        mp_drawing.draw_landmarks(
            left_view,
            results_left.pose_landmarks,
            connections=[(mp_pose.PoseLandmark.RIGHT_ELBOW, mp_pose.PoseLandmark.RIGHT_WRIST)]
        )
        nodes_left = {}
        for landmark in [mp_pose.PoseLandmark.RIGHT_ELBOW, mp_pose.PoseLandmark.RIGHT_WRIST]:
            lmk = results_left.pose_landmarks.landmark[landmark]
            nodes_left[landmark] = Node(lmk, left_view)
            x, y = nodes_left[landmark].get_position()
            cv2.circle(left_view, (x, y), 10, (255, 255, 255), -1)
        if (mp_pose.PoseLandmark.RIGHT_ELBOW in nodes_left and
            mp_pose.PoseLandmark.RIGHT_WRIST in nodes_left):
            angle_left = calculate_angle(
                nodes_left[mp_pose.PoseLandmark.RIGHT_ELBOW],
                nodes_left[mp_pose.PoseLandmark.RIGHT_WRIST]
            )
            if angle_left >= 330 or angle_left <= 30:
                touch_player2 = True

    results_right = pose_right.process(right_rgb)
    touch_player1 = False
    if results_right.pose_landmarks:
        mp_drawing.draw_landmarks(
            right_view,
            results_right.pose_landmarks,
            connections=[(mp_pose.PoseLandmark.RIGHT_ELBOW, mp_pose.PoseLandmark.RIGHT_WRIST)]
        )
        nodes_right = {}
        for landmark in [mp_pose.PoseLandmark.RIGHT_ELBOW, mp_pose.PoseLandmark.RIGHT_WRIST]:
            lmk = results_right.pose_landmarks.landmark[landmark]
            nodes_right[landmark] = Node(lmk, right_view)
            x, y = nodes_right[landmark].get_position()
            cv2.circle(right_view, (x, y), 10, (255, 255, 255), -1)
        if (mp_pose.PoseLandmark.RIGHT_ELBOW in nodes_right and
            mp_pose.PoseLandmark.RIGHT_WRIST in nodes_right):
            angle_right = calculate_angle(
                nodes_right[mp_pose.PoseLandmark.RIGHT_ELBOW],
                nodes_right[mp_pose.PoseLandmark.RIGHT_WRIST]
            )
            if 150 <= angle_right <= 210:
                touch_player1 = True
###############################
    if loop:
        if time.time() - time_counter >= time_ms:
        time_to_shoot = True
        time_counter = time.time()
    
    if time_to_shoot:
        if chrono is None:
            chrono = time.time()
        
        if time.time() - chrono >= 3:
            chrono = None
            time_to_shoot = False
###############################
        if touch_player1 and pressed_player1 and loop:
            print("🍎🍎🍎🍎🍎🍎🍎🍎")


            score = get_user_score(user1_name)
            update_user_score(user1_name, score+100)
            update_user_speed(user1_name, chrono)


            loop = False
            pressed_player1 = False
        elif pressed_player1 and not touch_player1:
            pressed_player1 = False

        if touch_player2 and pressed_player2 and loop:
            print("🍊🍊🍊🍊🍊🍊🍊🍊🍊")


            score = get_user_score(user2_name)
            update_user_score(user2_name, score+100)
            update_user_speed(user2_name, chrono)


            loop = False
            pressed_player2 = False
        elif pressed_player2 and not touch_player2:
            pressed_player2 = False

    combined = np.hstack((left_view, right_view))
    flipped = cv2.flip(combined, 1)
    ###

    ### flip cest frame modifier
    cv2.imshow("Final Output", flipped)
    print(loop)
    ###
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

###
cap.release()
cv2.destroyAllWindows()