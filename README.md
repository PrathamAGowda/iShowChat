# iShowChat

## Steps to Launch Application (For Windows)

1. **Clone the Repository**

    ```bash
    git clone https://github.com/PrathamAGowda/iShowChat.git
    ```

2. **Navigate to the Project Directory**

    ```bash
    cd iShowChat
    ```

3. **Run `launchServer.bat` and `launchClient.bat`**

## Steps to Launch Application (Not Windows)

1. **Clone the Repository**

    ```bash
    git clone https://github.com/PrathamAGowda/iShowChat.git
    ```

2. **Navigate to the Project Directory**

    ```bash
    cd iShowChat
    ```

3. **Install Dependencies**

    For Server:

    ```bash
    cd ./server
    npm ci
    ```

    For Client:

    ```bash
    cd ./client
    npm ci
    ```

4. **Start the Client**

    ```bash
    cd ./client
    npm start
    ```

    **Start the Server**

    ```bash
    cd ./server
    node server.js
    ```

    The app will run at `http://localhost:3000`.
