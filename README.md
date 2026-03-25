# Monitoring System

## Architecture
- Agent (Node.js): collects CPU, memory, active app
- Backend (NestJS): API + processing
- Database (MongoDB): store metrics

## Features
- Real-time metric collection (5s interval)
- Retry mechanism
- Duplicate prevention
- Multi-client support (tested with 50 clients)

## Run

### Backend
npm install/npm i
npm run start

### Agent
node agent.js