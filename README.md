# Telephone Management System Server

Welcome to the Telephone Transaction Management System Server! This README will guide you through the process of setting up the server locally using Docker.

## Prerequisites

Before you get started, make sure you have the following prerequisites installed on your system:

- [Docker](https://docs.docker.com/get-docker/)

## How to setup the codebase locally

Follow these steps to set up the project locally:

1. Clone the repository to your local machine

```bash
git clone https://github.com/Magowtham/Telephone-Management-System-Server.git
```

2. Change the directory to the project's root

```bash
cd Telephone-Management-System-Server/Server
```

3. Build the Docker image for the server

```bash
docker build -t telephone-server .
```

4. Pull the database from the Docker Hub

```bash
docker pull mongo
```

5. Create the volume for MongoDB in Docker

```bash
docker volume create telephone-volume
```

6. Create the network in Docker

```bash
docker network create telephone-network
```

7. Run the Docker database container

```bash
docker run -v telephone-volume:/data/db --network telephone-network --name telephone-db -p 27017:27017 mongo
```

8. Run the Docker server container

```bash
docker run --network telephone-network -p 9000:9000 telephone-server
```

## How to access the api end points

### 1. Add new user to the database

- **Method:** POST
  - **URL:** `https://telephone-transaction-management-system.onrender.com/admin/add_user`
  - **Headers:**`{"Content-Type": "application/json"}`
  - **Body:** `{"rfid":"student_new_rfid","name":"student_fullname","rollNumber":"student_rollNumber"}`

### 2. Recharge the user account

- **Method:** POST
  - **URL:** `https://telephone-transaction-management-system.onrender.com/telephone/recharge`
  - **Headers:**`{"Content-Type": "application/json"}`
  - **Body:**`{"rfid":"student_rfid","amount":"student_recharge_amount","key":"alvas123"}`

### 3. Start the call

- **Method:** POST
  - **URL:** `https://telephone-transaction-management-system.onrender.com/telephone/start_call`
  - **Headers:** `{"Content-Type": "application/json"}`
  - **Body:**`{"rfid":"student_rfid","key":"alvas123"}`

### 4. End the call

- **Method:** POST
  - **URL:** `https://telephone-transaction-management-system.onrender.com/telephone/end_call`
  - **Headers:** `{"Content-Type": "application/json"}`
  - **Body:** `{"rfid":"student_rfid","balance":"reducted_balance_amount","key":"alvas123"}`
