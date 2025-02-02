import cv2
import numpy as np
import mediapipe as mp
import math
import threading
import base64
import asyncio
import websockets

### GLOBAL VARIABLES
pressed_player1 = False  
pressed_player2 = False  
clients = set()  # Store connected WebSocket clients

# Mediapipe setup
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
pose_left = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)
pose_right = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

cap = cv2.VideoCapture(0)

### WebSocket Server Handler
async def handle_client(websocket, path):
    global clients
    clients.add(websocket)
    try:
        async for message in websocket:
            pass  # Currently, the frontend won't send data
    finally:
        clients.remove(websocket)

async def send_frame():
    while True:
        ret, frame = cap.read()
        if not ret:
            continue
        
        # Encode frame as base64
        _, buffer = cv2.imencode('.jpg', frame)
        jpg_as_base64 = base64.b64encode(buffer).decode('utf-8')

        # Process the frame
        height, width, channels = frame.shape
        half_w = width // 2
        left_view = frame[:, 0:half_w, :]
        right_view = frame[:, half_w:width, :]

        left_rgb = cv2.cvtColor(left_view, cv2.COLOR_BGR2RGB)
        right_rgb = cv2.cvtColor(right_view, cv2.COLOR_BGR2RGB)

        results_left = pose_left.process(left_rgb)
        results_right = pose_right.process(right_rgb)

        touch_player1 = False
        touch_player2 = False

        # Detect Player 2 movement
        if results_left.pose_landmarks:
            mp_drawing.draw_landmarks(left_view, results_left.pose_landmarks)
            angle_left = math.degrees(math.atan2(
                results_left.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_WRIST].y -
                results_left.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_ELBOW].y,
                results_left.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_WRIST].x -
                results_left.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_ELBOW].x
            ))
            if angle_left >= 330 or angle_left <= 30:
                touch_player2 = True

        # Detect Player 1 movement
        if results_right.pose_landmarks:
            mp_drawing.draw_landmarks(right_view, results_right.pose_landmarks)
            angle_right = math.degrees(math.atan2(
                results_right.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_WRIST].y -
                results_right.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_ELBOW].y,
                results_right.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_WRIST].x -
                results_right.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_ELBOW].x
            ))
            if 150 <= angle_right <= 210:
                touch_player1 = True

        # Determine if a player has fired
        game_over = False
        if touch_player1 and pressed_player1:
            game_over = True
            pressed_player1 = False
        if touch_player2 and pressed_player2:
            game_over = True
            pressed_player2 = False

        # Send data to WebSocket clients
        data = {
            "image": jpg_as_base64,
            "game_over": game_over
        }
        json_data = str(data).replace("'", '"')  # Convert dict to JSON format

        if clients:
            await asyncio.wait([client.send(json_data) for client in clients])

        await asyncio.sleep(0.03)  # Send at ~30fps

# Start WebSocket server
start_server = websockets.serve(handle_client, "0.0.0.0", 8765)

# Run the WebSocket server and frame sending loop
async def main():
    await asyncio.gather(start_server, send_frame())

asyncio.run(main())
