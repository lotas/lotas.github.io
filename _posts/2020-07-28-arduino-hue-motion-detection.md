
# Controlling Phillips HUE lights with Arduino

I have a bunch of HUE lamps at home that are mainly controlled from the app.

Playing with Arduino, I thought that I can easily add some motion detection and remote control for some of the lamps.

## Hardware

What we have is:

* [Arduino Nano 33 IoT](https://create.arduino.cc/projecthub/products/arduino-nano-33-iot) which comes with WiFi and Bluetooth
* Infrared Motion Sensor (HC-SR501)
* Phillips HUE Bridge API integration

## Hue Bridge API

One has to [obtain new access](https://developers.meethue.com/develop/get-started-2/) token in order to have access to the lights API.

Once the key is obtained, lights can be turned on and off by doing `PUT` requests to the bridge:

```sh
curl -X PUT 'http://YOUR-BRIDGE-IP/api/YOUR-API-TOKEN/lights/3/state'  -d '{"on": true, "sat": 54, "bri": 130 ,"hue": 33}'
```

It is possible to change color, brightness and on/off state. For our scenario, we are only interested in `{"on": true}` or `{"on": false}`

## Assembly

PIR sensor has 3 connections:

* VCC -> `+5V`
* GND -> GND
* OUT -> `2` (2nd pin in my case)

Note about `+5V` which was required by sensor: Arduino Nano 33 IoT have `+5V` disabled by default (!).
And it can only be operated if powered by USB.
In order to get this `+5V` on the pin, one need to solder (connect) two `VUSB` connectors next to it.

## Code

Setup phase consists of setting up pins and connecting to WiFi.

```c
#define SENSOR_PIN 2
#define SECRET_SSID "home-ssid"
#define SECRET_PASS "home-pass"

int status = WL_IDLE_STATUS;

char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;

int sensorValue = 0;
int oldValue = 0;

WiFiClient client;

void setup() {
  Serial.begin(9600);
  // When debugging locally following line can be uncommented, so we can see whole output from the device
  // while (!Serial);

  Serial.println("Setup pins");
  pinMode(SENSOR_PIN, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);

  // check for the WiFi module:
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    // don't continue
    while (true);
  }

  String fv = WiFi.firmwareVersion();
  if (fv < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("Please upgrade the firmware");
  }

  // attempt to connect to Wifi network:
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(ssid);
    status = WiFi.begin(ssid, pass);
    // wait 10 seconds for connection:
    delay(5000);
  }
  Serial.println("Connected to wifi");
}
```

Once connected, we can listen for the sensor value to change:

```c
void loop() {
  sensorValue = digitalRead(SENSOR_PIN);

  if (sensorValue == HIGH) {
    if (oldValue == LOW) {
     Serial.println("State changed to: High :)");
     digitalWrite(LED_BUILTIN, HIGH);
     sendCommand(true);
    }
  } else {
    if (oldValue == HIGH) {
      digitalWrite(LED_BUILTIN, LOW);
      Serial.println("State changed to: Low :(");
      sendCommand(false);
    }
  }
  oldValue = sensorValue;
  delay(50);  // Not really necessary, but some delay wouldn't hurt
}
```

Last thing is to actually send a HTTP request to the bridge to turn on/off the lamp:

```c

IPAddress server(192,168,2,225); // IP of the bridge
const int port = 80;
const char apiUrl[] = "PUT /api/TOKEN/lights/14/state HTTP/1.1"; // URL with the lamp id to control

void sendCommand(bool isOn) {
  String content = "{\"on\": false}";
  if (isOn == true) {
    Serial.println("Turning lamp on");
    content = "{\"on\": true}";
  } else {
    Serial.println("Turning lamp off");
  }

  client.stop(); // if previous request is active, it can be stopped

  if (client.connect(server, port)) {
    Serial.println("Connected to server");
    client.println(apiUrl);
    client.println("Accept: application/json");
    client.println("Content-Type: application/json");
    client.println("Content-length: " + String(content.length()));
    client.println();
    client.println(content);
    Serial.println("Sent: " + content);
  } else {
    Serial.println("Connection failed");
  }
}
```

And that should be it.


## Notes

* PIR sensor turned out to be quite a stubborn one. It has two dials to control sensitivity and delay, and it was tricky to find the proper combination that would work in my room.
* Code is missing the check for the daylight, as it will make no sense to run it during the day. It can either require additional photo sensor, to see if it is bright enough in order not to switch lamp on.
* As the next step, It would probably be better to connect to the MQTT and send messages there, because:
  *  It would make this client simpler, and would save us from talking to the bridge directly.
  * external listeners could use additional information to control the lights
  * it could all be connected to the [Home Assistant](https://www.home-assistant.io/) for extra fun, and tracked history of events

