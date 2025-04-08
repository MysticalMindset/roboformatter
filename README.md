# Robot Formatter

## Overview

This project serves as a formatter for multiple robots, providing a structured way to manage and process data for different robotic systems. Currently, the formatter is designed to support **KUKA** robots, but it is built with future extensibility in mind to accommodate other robot models as well.

## Features

- **KUKA Robot Support:** Currently configured to handle the specific data formats and requirements of KUKA robots.
- **Extensibility:** Designed with the capability to easily add support for other robotic systems in the future.
- **Data Formatting:** Standardizes the data input and output for robot communication, making it easier to interact with the robot’s control system.
- **Modular Architecture:** The code is modular to facilitate easy integration with other robot systems in the future.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/robot-formatter.git
   ```

2. Install the necessary dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Configure your robot settings (currently only KUKA is supported).

## Usage

- To use the formatter for KUKA robots, simply run the main script with the appropriate configuration file.
  
  Example:

  ```bash
  python formatter.py --robot kuka --config kuka_config.json
  ```

- The formatter will process the data and output the formatted result for KUKA robots.

## Future Development

- Support for additional robot models will be added in future updates. Contributions are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
