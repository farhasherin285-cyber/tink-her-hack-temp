<p align="center">
  <img src="./img.png" alt="Project Banner" width="100%">
</p>

# [TinkCare] 🎯

## Basic Details

### Team Name: [Code starters]

### Team Members
- Member 1: [Farha Sherin] - [Jyothi engineering college]
- Member 2: [Athulya K M] - [Jyothi engineering college]

### Hosted Project Link
[https://tink-her-hack-temp-alpha.vercel.app/chatbot.html]

### Project Description
[TinkCare is a smart IoT-based health monitoring system designed for construction site workers in India. It uses wearable sensors to track vital parameters like heart rate, body temperature, dehydration, and fall detection, and sends real-time data to a web app dashboard. The system provides instant alerts to supervisors and includes an AI chatbot, CareBot, to assist workers with health-related guidance and preventive care.]

### The Problem statement
[Construction site workers in India are exposed to extreme heat, long working hours, heavy PPE, and physically demanding tasks, which increase the risk of dehydration, heat stress, fatigue, and sudden health emergencies. Currently, there is no real-time health monitoring system to detect early warning signs and prevent accidents. This lack of proactive health tracking leads to unsafe working conditions and delayed medical response on sites.]

### The Solution
[To address this issue, we propose TinkCare, an IoT-based health monitoring system for construction site workers. The solution includes a wearable sensor device that continuously tracks vital parameters such as heart rate, body temperature, hydration level, and motion (fall detection).

The collected data is transmitted to a web-based dashboard where supervisors can monitor workers in real time, receive abnormal health alerts, and take immediate action. Additionally, the integrated CareBot provides instant health guidance and preventive suggestions, creating a proactive safety ecosystem rather than a reactive response system.]

---

## Technical Details
hardware which is a sensor connected to a web app

### Technologies/Components Used

**For Software:**
- Languages used: [html,css.js.json,md]
- Frameworks used: [vs code]
- Libraries used: [dashboard,index.chatbot]
- Tools used: [open ai]

**For Hardware:**
- Main components: [Heart Rate & SpO₂ Sensor
MAX30102,Microcontroller
ESP32,Body Temperature Sensor,DS18B20 / LM35,Dehydration / Stress Sensor
GSR (Galvanic Skin Response) Sensor,Motion / Fall Detection Sensor
MPU6050 (Accelerometer + Gyroscope),Power Supply]
- Specifications: [1.Microcontroller – ESP32
	•	Operating Voltage: 3.0V – 3.6V
	•	Processor: Dual-core 32-bit
	•	Clock Speed: Up to 240 MHz
	•	Connectivity: WiFi (802.11 b/g/n) + Bluetooth 4.2
	•	Low power deep sleep mode supported

2.Heart Rate & SpO₂ Sensor – MAX30102
	•	Measurement: Heart Rate (30–240 bpm)
	•	SpO₂ Range: 70% – 100%
	•	Accuracy: ±2% (SpO₂)
	•	Low power consumption
	•	I2C communication
3. Body Temperature Sensor – DS18B20
	•	Measurement Range: -55°C to +125°C
	•	Accuracy: ±0.5°C (between -10°C to 85°C)
	•	Digital output
	•	Waterproof variant available 

4. GSR Sensor (Hydration/Stress Monitoring)
	•	Measures skin conductance
	•	Operating Voltage: 3.3V – 5V
	•	Analog output
	•	Used to detect dehydration & stress levels

5.  Motion Sensor – MPU6050
	•	3-axis Accelerometer + 3-axis Gyroscope
	•	Operating Voltage: 3V – 5V
	•	Detects fall, sudden movement, dizziness
	•	I2C communication

6. Power System
	•	3.7V Lithium Polymer Battery
	•	Capacity: 800mAh – 1200mAh
	•	Backup: 8–12 hours (one site shift)
	•	USB rechargeable

7. Physical Design (Proposed)
	•	Form: Wrist band / Smart band
	•	Lightweight (<100 grams)
	•	Sweat-resistant casing
	•	Comfortable for long working hours]
- Tools required: []

---

## Features

List the key features of your project:
- Feature 1: [Real-Time Health Monitoring

The wearable device continuously tracks vital parameters such as heart rate, body temperature, hydration level, and motion to detect early signs of fatigue, heat stress, or medical emergencies.]
- Feature 2: [Instant Alert System

If abnormal health conditions are detected, the system automatically sends alerts to the supervisor through the TinkCare web dashboard, enabling quick response and preventing accidents.]
- Feature 3: [Centralized Web Dashboard

All worker health data is recorded and displayed in a structured dashboard, allowing supervisors to monitor multiple workers simultaneously and analyze health trends.]
- Feature 4: [.CareBot – AI Health Assistant

An integrated chatbot that provides immediate health guidance, first-aid suggestions, hydration reminders, and preventive advice based on worker symptoms]

---

## Implementation

### For Software:

#### Installation
```bash
[Installation commands - e.g., npm install, pip install -r requirements.txt]
```

#### Run
```bash
[Run commands - e.g., npm start, python app.py]
```

### For Hardware:

#### Components Required
[List all components needed with specifications]

#### Circuit Setup
[Explain how to set up the circuit]

---

## Project Documentation

### For Software:

#### Screenshots (Add at least 3)

![<img width="1920" height="1080" alt="Screenshot 2026-02-14 100641" src="https://github.com/user-attachments/assets/9a36c3d5-7cca-4bb9-ae9c-abb0ef4ac058" />
](Add screenshot 1 here with proper name)
*home page*

![<img width="1920" height="1080" alt="Screenshot 2026-02-14 100701" src="https://github.com/user-attachments/assets/18bd4f17-469c-4c99-bf0f-10fa5f95c2d6" />
](Add screenshot 2 here with proper name)
*carebot*

![<img width="1920" height="1080" alt="Screenshot 2026-02-14 100726" src="https://github.com/user-attachments/assets/ed111297-4950-4cd0-a7d1-f952fdc89b0e" />
](Add screenshot 3 here with proper name)
*dashboard*

#### Diagrams

**System Architecture:**

![Architecture Diagram](docs/architecture.png)
*Explain your system architecture - components, data flow, tech stack interaction*

**Application Workflow:**

![Workflow](docs/workflow.png)
*Add caption explaining your workflow*

---

### For Hardware:

#### Schematic & Circuit

![Circuit](Add your circuit diagram here)
*Add caption explaining connections*

![Schematic](Add your schematic diagram here)
*Add caption explaining the schematic*

#### Build Photos

![Team](Add photo of your team here)

![Components](Add photo of your components here)
*List out all components shown*

![Build](Add photos of build process here)
*Explain the build steps*

![Final](Add photo of final product here)
*Explain the final build*

---

## Additional Documentation

### For Web Projects with Backend:

#### API Documentation

**Base URL:** `https://api.yourproject.com`

##### Endpoints

**GET /api/endpoint**
- **Description:** [What it does]
- **Parameters:**
  - `param1` (string): [Description]
  - `param2` (integer): [Description]
- **Response:**
```json
{
  "status": "success",
  "data": {}
}
```

**POST /api/endpoint**
- **Description:** [What it does]
- **Request Body:**
```json
{
  "field1": "value1",
  "field2": "value2"
}
```
- **Response:**
```json
{
  "status": "success",
  "message": "Operation completed"
}
```

[Add more endpoints as needed...]

---

### For Mobile Apps:

#### App Flow Diagram

![App Flow](docs/app-flow.png)
*Explain the user flow through your application*

#### Installation Guide

**For Android (APK):**
1. Download the APK from [Release Link]
2. Enable "Install from Unknown Sources" in your device settings:
   - Go to Settings > Security
   - Enable "Unknown Sources"
3. Open the downloaded APK file
4. Follow the installation prompts
5. Open the app and enjoy!

**For iOS (IPA) - TestFlight:**
1. Download TestFlight from the App Store
2. Open this TestFlight link: [Your TestFlight Link]
3. Click "Install" or "Accept"
4. Wait for the app to install
5. Open the app from your home screen

**Building from Source:**
```bash
# For Android
flutter build apk
# or
./gradlew assembleDebug

# For iOS
flutter build ios
# or
xcodebuild -workspace App.xcworkspace -scheme App -configuration Debug
```

---

### For Hardware Projects:

#### Bill of Materials (BOM)

| Component | Quantity | Specifications | Price | Link/Source |
|-----------|----------|----------------|-------|-------------|
| Arduino Uno | 1 | ATmega328P, 16MHz | ₹450 | [Link] |
| LED | 5 | Red, 5mm, 20mA | ₹5 each | [Link] |
| Resistor | 5 | 220Ω, 1/4W | ₹1 each | [Link] |
| Breadboard | 1 | 830 points | ₹100 | [Link] |
| Jumper Wires | 20 | Male-to-Male | ₹50 | [Link] |
| [Add more...] | | | | |

**Total Estimated Cost:** ₹[Amount]

#### Assembly Instructions

**Step 1: Prepare Components**
1. Gather all components listed in the BOM
2. Check component specifications
3. Prepare your workspace
![Step 1](images/assembly-step1.jpg)
*Caption: All components laid out*

**Step 2: Build the Power Supply**
1. Connect the power rails on the breadboard
2. Connect Arduino 5V to breadboard positive rail
3. Connect Arduino GND to breadboard negative rail
![Step 2](images/assembly-step2.jpg)
*Caption: Power connections completed*

**Step 3: Add Components**
1. Place LEDs on breadboard
2. Connect resistors in series with LEDs
3. Connect LED cathodes to GND
4. Connect LED anodes to Arduino digital pins (2-6)
![Step 3](images/assembly-step3.jpg)
*Caption: LED circuit assembled*

**Step 4: [Continue for all steps...]**

**Final Assembly:**
![Final Build](images/final-build.jpg)
*Caption: Completed project ready for testing*

---

### For Scripts/CLI Tools:

#### Command Reference

**Basic Usage:**
```bash
python script.py [options] [arguments]
```

**Available Commands:**
- `command1 [args]` - Description of what command1 does
- `command2 [args]` - Description of what command2 does
- `command3 [args]` - Description of what command3 does

**Options:**
- `-h, --help` - Show help message and exit
- `-v, --verbose` - Enable verbose output
- `-o, --output FILE` - Specify output file path
- `-c, --config FILE` - Specify configuration file
- `--version` - Show version information

**Examples:**

```bash
# Example 1: Basic usage
python script.py input.txt

# Example 2: With verbose output
python script.py -v input.txt

# Example 3: Specify output file
python script.py -o output.txt input.txt

# Example 4: Using configuration
python script.py -c config.json --verbose input.txt
```

#### Demo Output

**Example 1: Basic Processing**

**Input:**
```
This is a sample input file
with multiple lines of text
for demonstration purposes
```

**Command:**
```bash
python script.py sample.txt
```

**Output:**
```
Processing: sample.txt
Lines processed: 3
Characters counted: 86
Status: Success
Output saved to: output.txt
```

**Example 2: Advanced Usage**

**Input:**
```json
{
  "name": "test",
  "value": 123
}
```

**Command:**
```bash
python script.py -v --format json data.json
```

**Output:**
```
[VERBOSE] Loading configuration...
[VERBOSE] Parsing JSON input...
[VERBOSE] Processing data...
{
  "status": "success",
  "processed": true,
  "result": {
    "name": "test",
    "value": 123,
    "timestamp": "2024-02-07T10:30:00"
  }
}
[VERBOSE] Operation completed in 0.23s
```

---

## Project Demo

### Video
[https://drive.google.com/drive/folders/1TslqoJvIBpKHEVw7FQS_85_eiLsxrJX8?usp=sharing]

*Explain what the video demonstrates - key features, user flow, technical highlights*

### Additional Demos
[Add any extra demo materials/links - Live site, APK download, online demo, etc.]

---

## AI Tools Used (Optional - For Transparency Bonus)

If you used AI tools during development, document them here for transparency:

**Tool Used:** [e.g., GitHub Copilot, v0.dev, Cursor, ChatGPT, Claude]

**Purpose:** [What you used it for]
- Example: "Generated boilerplate React components"
- Example: "Debugging assistance for async functions"
- Example: "Code review and optimization suggestions"

**Key Prompts Used:**
- "Create a REST API endpoint for user authentication"
- "Debug this async function that's causing race conditions"
- "Optimize this database query for better performance"

**Percentage of AI-generated code:** [Approximately X%]

**Human Contributions:**
- Architecture design and planning
- Custom business logic implementation
- Integration and testing
- UI/UX design decisions

*Note: Proper documentation of AI usage demonstrates transparency and earns bonus points in evaluation!*

---

## Team Contributions

- [Name 1]: [Specific contributions - e.g., Frontend development, API integration, etc.]
- [Name 2]: [Specific contributions - e.g., Backend development, Database design, etc.]
- [Name 3]: [Specific contributions - e.g., UI/UX design, Testing, Documentation, etc.]

---

## License

This project is licensed under the [LICENSE_NAME] License - see the [LICENSE](LICENSE) file for details.

**Common License Options:**
- MIT License (Permissive, widely used)
- Apache 2.0 (Permissive with patent grant)
- GPL v3 (Copyleft, requires derivative works to be open source)

---

Made with ❤️ at TinkerHub
