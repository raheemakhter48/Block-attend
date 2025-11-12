Blockchain-Based Attendance Management System

This is a decentralized web app that helps manage student attendance using blockchain technology. It makes attendance records secure, transparent, and impossible to tamper with.

🎯 Key Features

✅ Blockchain Storage – Attendance data is stored permanently on the blockchain.

✅ Different User Roles – Separate dashboards for Admin, Teachers, and Students.

✅ Smart Contracts – Attendance marking and verification are handled automatically by Solidity smart contracts.

✅ Student Portal – Students can log in with MetaMask and instantly see their attendance.

✅ Real-Time Updates – Attendance changes appear instantly through blockchain events.

✅ Full Transparency – Every record is public and verifiable.

✅ Modern Design – A beautiful, responsive interface with data visualization.

🛠️ Technology Used

Frontend: React.js (Vite)

Blockchain: Ethereum (Solidity)

Wallet: MetaMask

Smart Contract Framework: Hardhat

Web3 Library: Ethers.js

Charts: Recharts

Styling: Modern CSS3 design

📋 Before You Start

You’ll need these installed:

Node.js (v16 or higher)

npm or yarn

MetaMask browser extension

Git

🚀 Setup Guide
1. Clone the Project
git clone <your-repo-url>
cd blockchain-attendance-system

2. Install Packages

For Smart Contracts:

npm install


For Frontend:

cd frontend
npm install
cd ..

3. Configure Environment File

Create a .env file in the root folder and add your blockchain details:

SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here

4. Compile Smart Contracts
npm run compile

5. Deploy Smart Contracts

For Local Network:

npm run node       # Run local blockchain
npm run deploy:local


For Sepolia Testnet:

npx hardhat run scripts/deploy.js --network sepolia


Then, update frontend/src/contracts/deployment.json with the deployed contract address.

6. Start the Frontend
cd frontend
npm run dev


Visit: http://localhost:3000

👨‍💼 How to Use the App
🧑‍💼 Admin Panel

Connect your MetaMask wallet.

Register students by adding their wallet address, name, and student ID.

Register teachers with their wallet address and name.

Optionally, add more admins.

👩‍🏫 Teacher Dashboard

Connect your wallet (make sure you’re registered as a teacher).

Enter the subject name.

Select students and mark them Present or Absent.

Submit and wait for blockchain confirmation.

👨‍🎓 Student Portal

Connect your registered MetaMask wallet.

See your attendance statistics and history.

View attendance breakdown by subject.

Analyze attendance through charts and graphs.

🧪 Testing

Run the test suite:

npm run test

📁 Folder Overview
blockchain-attendance-system/
├── contracts/              # Smart contracts
├── scripts/                # Deployment scripts
├── test/                   # Contract tests
├── frontend/               # React app
│   ├── components/         # UI components
│   ├── context/            # Web3 connection logic
│   ├── contracts/          # Contract ABIs & addresses
│   ├── pages/              # App pages
├── hardhat.config.js       # Hardhat setup
└── package.json

🔒 Security

Access control using OpenZeppelin’s AccessControl.

Protection against reentrancy attacks.

Input validation for all contract functions.

Immutable and transparent blockchain records.

🌐 Networks

Local Network:

RPC: http://127.0.0.1:8545

Chain ID: 1337

Testnet (Sepolia):

Chain ID: 11155111

Faucet: https://sepoliafaucet.com/

📊 Smart Contract Functions

Admin Functions

registerStudent(address, name, id)

registerTeacher(address, name)

addAdmin(address)

Teacher Functions

markAttendance(address, bool, subject)

markBulkAttendance(address[], bool[], subject)

Student View Functions

getStudentInfo(address)

getAttendanceHistory(address)

getAttendancePercentage(address)

getSubjectAttendance(address, subject)

🐛 Common Issues & Fixes

MetaMask not connecting?

Make sure MetaMask is unlocked and on the right network.

Clear cache and reload the page.

Contract not deploying?

Check your .env values.

Ensure you have enough ETH or test ETH.

Confirm Hardhat node is running.

Frontend not working?

Check the contract address in frontend/src/contracts/deployment.json.

Look for console errors in the browser.

🚀 Deployment

Frontend to Vercel:

cd frontend
npm run build
vercel deploy


Testnet Deployment:

Update Hardhat network config.

Deploy with:

npx hardhat run scripts/deploy.js --network sepolia


Update the frontend contract address.

Host the frontend on Vercel or another platform.

🔮 Future Features

QR Code attendance scanning

IPFS for student photos and files

PDF attendance reports

AI-based attendance analysis

Parent access portal

Mobile app version

📝 License

Licensed under the MIT License.

🤝 Contributing

Pull requests are welcome! Feel free to suggest improvements.

📧 Need Help?

Open an issue in the GitHub repository for support