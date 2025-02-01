import cv2
import mediapipe as mp
import numpy as np
import math

class Node:
    def __init__(self, landmark, frame):
        self.pos_x = int(landmark.x * frame.shape[1])
        self.pos_y = int(landmark.y * frame.shape[0])

    def get_position(self):
        return self.pos_x, self.pos_y

# Initialize MediaPipe Pose model
counter = 0
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

# Open webcam
cap = cv2.VideoCapture(1)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Convert image to RGB for MediaPipe
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Process frame with Mediapipe Pose
    results = pose.process(rgb_frame)

    # Create a blank mask (black image) with the same size as the frame
    mask = np.zeros_like(frame)

    # Draw arm landmarks (elbow, wrist)
    if results.pose_landmarks:
        # Draw the arm lines
        mp_drawing.draw_landmarks(
            mask, 
            results.pose_landmarks, 
            connections=[
                (mp_pose.PoseLandmark.LEFT_ELBOW, mp_pose.PoseLandmark.LEFT_WRIST),
                (mp_pose.PoseLandmark.RIGHT_ELBOW, mp_pose.PoseLandmark.RIGHT_WRIST)
            ]
        )

        # Create Node objects for elbow and wrist landmarks
        nodes = {}
        for landmark in [mp_pose.PoseLandmark.LEFT_ELBOW, mp_pose.PoseLandmark.LEFT_WRIST,
                         mp_pose.PoseLandmark.RIGHT_ELBOW, mp_pose.PoseLandmark.RIGHT_WRIST,
                         mp_pose.PoseLandmark.NOSE,
                         mp_pose.PoseLandmark.RIGHT_ANKLE, mp_pose.PoseLandmark.LEFT_ANKLE]:
            landmark_pos = results.pose_landmarks.landmark[landmark]
            nodes[landmark] = Node(landmark_pos, frame)
            x, y = nodes[landmark].get_position()
            cv2.circle(mask, (x, y), 10, (255, 255, 255), -1)

        # Calculate angles between elbow and wrist (2D only, no z-axis)
        def calculate_angle(node1, node2):
            x1, y1 = node1.get_position()
            x2, y2 = node2.get_position()

            # Calculate angle between the wrist and elbow relative to the horizontal axis (ignoring z-axis)
            angle = math.degrees(math.atan2(y2 - y1, x2 - x1))
            if angle < 0:
                angle += 360
            return angle

        if counter % 50 == 0:
        # Calculate angles for left arm
            if mp_pose.PoseLandmark.LEFT_ELBOW in nodes and mp_pose.PoseLandmark.LEFT_WRIST in nodes:
                LEFT_angle = calculate_angle(nodes[mp_pose.PoseLandmark.LEFT_ELBOW], nodes[mp_pose.PoseLandmark.LEFT_WRIST])
                print(f"Left Arm Angle: {LEFT_angle:.2f} degrees")

            # Calculate angles for right arm
            if mp_pose.PoseLandmark.RIGHT_ELBOW in nodes and mp_pose.PoseLandmark.RIGHT_WRIST in nodes:
                RIGHT_angle = calculate_angle(nodes[mp_pose.PoseLandmark.RIGHT_ELBOW], nodes[mp_pose.PoseLandmark.RIGHT_WRIST])
                print(f"Right Arm Angle: {RIGHT_angle:.2f} degrees")
            
        counter+= 1

        # Show the isolated arms
        cv2.imshow("Joints View", mask)

    # Exit on 'q' key
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
