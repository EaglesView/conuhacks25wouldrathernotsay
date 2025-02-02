#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "Reseau";
const char* password = "reseautest";
const char* serverUrl = "http://192.168.102.86:8080/"; // Replace with your actual endpoint

const int buttonPin = 32; // Define the pin number for the button

void setup() {
  Serial.begin(115200); // Start serial communication
  pinMode(buttonPin, INPUT_PULLUP); // Set pin as input with internal pull-up resistor
  
  // Connect to Wi-Fi
  Serial.print("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");
    Serial.print("IP Address: ");
  Serial.println(WiFi.localIP()); // Print the IP address
}

void sendButtonPress() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    String jsonPayload = "{\"name\": user1}";
    int httpResponseCode = http.POST(jsonPayload);
    
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    
    http.end();
  } else {
    Serial.println("WiFi not connected");
  }
}

void loop() {
  if (digitalRead(buttonPin) == LOW) { // Check if button is pressed (assuming active LOW button)
    Serial.println("true");
    sendButtonPress(); // Send data to the server
    delay(200); // Debounce delay
  }
}
