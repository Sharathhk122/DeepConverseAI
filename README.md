# 🚀 ChatGPT DApp 🎙️
## 🌐 Live Demo - DeepConverse AI

🚀 Check out the live deployed DeepConverse AI application here:  
👉 [DeepConverse AI Live](https://deepconverseai-sharath.onrender.com/)

A fully decentralized ChatGPT membership DApp powered by **React**, **Hardhat**, **ethers.js**, **MetaMask**, and integrated with **DeepSeek API** for AI-powered conversations. This project combines blockchain technology with AI to provide secure, subscription-based access to a decentralized chatbot.

---



## ✨ Features

- 🤖 **Decentralized AI Chatbot** — Interact with DeepSeek-powered AI
- 💳 **Membership Plans** — One Month, Six Months, One Year subscriptions
- 🔗 **Web3 Integration** — MetaMask wallet connection & secure transactions
- 🔐 **Smart Contract** — Deployed on Hardhat local blockchain
- 🔒 **Secure Payments** — Transactions via Ethereum smart contracts
- 🌐 **User-Friendly Interface** — Smooth, clean UI for users
- 🎁 **Free Trial Option** — Test the chatbot before purchasing
- 🔥 **Real-Time Updates** — Live membership status & chat interactions
- 🖥️ **Optimized for Microsoft Edge**

---

## 🌐 Tech Stack

| Frontend  | Backend | Blockchain | API |
|-----------|---------|------------|------|
| React 18  | Node.js | Hardhat | DeepSeek API |
| Next.js 12 | Express.js | Ethers.js | Axios |
| Web3Modal | Nodemon | MetaMask |  |

---

## 🔑 API

> ✅ This project uses **DeepSeek API** for AI chat functionalities.

---

## 🚀 Getting Started

Follow these simple steps to run the project locally:

---

### 🖥️ 1. Download Project

- 📦 Download ZIP from [GitHub Repository](https://github.com/your-repo-link)
- 📂 Extract contents to your local machine.

---

### 🛠️ 2. Install Visual Studio Code

- 🔧 Download [VS Code](https://code.visualstudio.com/)

> ⚠️ Please ensure you're using the correct versions below for full compatibility!

---

### 📦 3. Dependency Versions

```bash
chatapp@0.1.0 D:\chatgpt-dapp\final-gpt-dapp
├── @nomicfoundation/hardhat-toolbox@2.0.0
├── @openzeppelin/contracts@4.9.3
├── axios@1.7.7
├── ethers@5.7.2
├── hardhat@2.12.0
├── next@12.3.1
├── react-dom@18.2.0
├── react-icons@4.10.1
├── react@18.2.0
└── web3modal@1.9.9
````

---

### 📂 4. Install Client Dependencies

1️⃣ Open terminal
2️⃣ Navigate to project root:

```bash
cd final-gpt-dapp
npm install
```

---

### 📂 5. Install Server Dependencies

1️⃣ Navigate to server directory:

```bash
cd server
npm install
```

---

### 🔥 6. Start Server

```bash
npx nodemon server
```

Open Microsoft Edge and visit 👉 [http://localhost:4000](http://localhost:4000)

---

### 💻 7. Start Frontend

```bash
npm run dev
```

Visit 👉 [http://localhost:3000](http://localhost:3000)

---

### ⚙️ 8. Setup MetaMask & Hardhat

#### 📲 Install MetaMask on Microsoft Edge

#### 🚀 Start Hardhat Node

```bash
npx hardhat node
```

#### 📤 Deploy Smart Contract

```bash
npx hardhat run --network localhost scripts/deploy.js
```

#### 🔗 Add Hardhat Network to MetaMask

| Field              | Value                                          |
| ------------------ | ---------------------------------------------- |
| Network Name       | Hardhat Localhost                              |
| New RPC URL        | [http://127.0.0.1:8545](http://127.0.0.1:8545) |
| Chain ID           | 31337                                          |
| Currency Symbol    | ETH                                            |
| Block Explorer URL | (leave empty)                                  |

#### 🔑 Import Hardhat Accounts into MetaMask

* Copy private key from Hardhat terminal
* In MetaMask → Import Account → Paste Private Key

---

### 💼 9. Modify Membership Pricing

In `context/index.js`, modify:

#### One Month:

```javascript
const amount = 1;
const MEMBERSHIP_NAME = "One Month";
```

#### Six Months:

```javascript
const amount = 3;
const MEMBERSHIP_NAME = "Six Months";
```

#### One Year:

```javascript
const amount = 5;
const MEMBERSHIP_NAME = "One Year";
```

---

### 💬 10. Access Chat

Visit 👉 [http://localhost:3000/chat](http://localhost:3000/chat)

* Select membership
* Approve MetaMask transactions
* Start chatting with AI 🤖

---

## 🖼️ Screenshots

| Preview                                                                                                  | Description                                       |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| ![Front Page](https://github.com/Sharathhk122/ChatBot/blob/main/Screenshot%20\(940\).png)                | Front page                                        |
| ![Membership Options](https://github.com/Sharathhk122/ChatBot/blob/main/Screenshot%20\(941\).png)        | Membership Options                                |
| ![Transaction Confirmations](https://github.com/Sharathhk122/ChatBot/blob/main/Screenshot%20\(942\).png) | MetaMask Confirmations                            |
| ![Chat page](https://github.com/Sharathhk122/DeepConverseAI/blob/main/Screenshot%20(1038).png)                |Chat page                                    |
| ![Chat page](https://github.com/Sharathhk122/DeepConverseAI/blob/main/Screenshot%20(1039).png)        | chat psge                                   |
| ![chat page](https://github.com/Sharathhk122/DeepConverseAI/blob/main/Screenshot%20(1040).png) | chat code       
![Chat page](https://github.com/Sharathhk122/DeepConverseAI/blob/main/Screenshot%20(1041).png) | chat  code    |                                                                                         
| ![Feature 1](https://github.com/Sharathhk122/ChatBot/blob/main/Screenshot%20(943).png) | Feature screenshot |
| ![Feature 2](https://github.com/Sharathhk122/ChatBot/blob/main/Screenshot%20(944).png) | Another feature screenshot |
| ![Feature 3](https://github.com/Sharathhk122/ChatBot/blob/main/Screenshot%20(945).png) | Another feature screenshot |
| ![Feature 4](https://github.com/Sharathhk122/ChatBot/blob/main/Screenshot%20(946).png) | Another feature screenshot |
| ![Feature 5](https://github.com/Sharathhk122/ChatBot/blob/main/Screenshot%20(947).png) | Another feature screenshot |
| ![Feature 6](https://github.com/Sharathhk122/ChatBot/blob/main/Screenshot%20(948).png) | Another feature screenshot |
| ![Feature 7](https://github.com/Sharathhk122/ChatBot/blob/main/Screenshot%20(949).png) | Another feature screenshot |
| ![Feature 9](https://github.com/Sharathhk122/ChatBot/blob/main/Screenshot%20(951).png) | Another feature screenshot |
| ![Feature 10](https://github.com/Sharathhk122/ChatBot/blob/main/Screenshot%20(952).png) | Another feature screenshot |
| ![Feature 11](https://github.com/Sharathhk122/ChatBot/blob/main/Screenshot%20(953).png) | Another feature screenshot |
| ![Feature 12](https://github.com/Sharathhk122/ChatBot/blob/main/Screenshot%20(954).png) | Another feature screenshot |
| ![Feature 13](https://github.com/Sharathhk122/ChatBot/blob/main/Screenshot%20(955).png) | Another feature screenshot |
| ![Feature 14](https://github.com/Sharathhk122/ChatBot/blob/main/Screenshot%20(956).png) | Another feature screenshot |
| ![Feature 15](https://github.com/Sharathhk122/ChatBot/blob/main/Screenshot%20(957).png) | Another feature screenshot |
| ![Feature 16](https://github.com/Sharathhk122/ChatBot/blob/main/Screenshot%20(958).png) | Another feature screenshot |
| ![Feature 17](https://github.com/Sharathhk122/ChatBot/blob/main/Screenshot%20(959).png) | Another feature screenshot |
| ![Feature 18](https://github.com/Sharathhk122/ChatBot/blob/main/Screenshot%20(960).png) | Another feature screenshot |

---

## 📂 Project Folder Structure

```bash
final-gpt-dapp/
│
├── client/ (React Frontend)
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── server/ (Node.js Backend)
│   ├── routes/
│   ├── controllers/
│   ├── server.js
│   └── package.json
│
├── contracts/ (Smart Contracts)
│   ├── GPTMembership.sol
│
├── scripts/ (Deployment Scripts)
│   └── deploy.js
│
├── hardhat.config.js
└── README.md
```

---

## 🏗️ Project Architecture

```
User ↔ React Frontend ↔ Node.js Backend ↔ DeepSeek API
            ↕
         Hardhat Local Blockchain ↔ Smart Contracts ↔ MetaMask Wallet
```

---

## ✅ Notes

* ✅ This project fully supports local development.
* ✅ Microsoft Edge browser recommended for MetaMask compatibility.

---

## 🙏 Credits

Made with ❤️ by [Sharath HK](https://github.com/Sharathhk122)

---

