import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import './Privacy.css'

const Privacy = () => {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <div className="legal-header-container">
          <Link to="/" className="legal-logo">
            <Logo size="medium" showText={true} />
          </Link>
          <nav className="legal-nav">
            <Link to="/">Home</Link>
            <Link to="/terms">Terms of Service</Link>
          </nav>
        </div>
      </header>

      <main className="legal-main">
        <div className="legal-container">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: November 15, 2025</p>

          <section className="legal-section">
            <h2>1. Introduction</h2>
            <p>
              BlockAttend ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our blockchain-based attendance management system.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Information We Collect</h2>
            <h3>2.1 Blockchain Data</h3>
            <p>
              Our application stores attendance records on the Ethereum blockchain. This includes:
            </p>
            <ul>
              <li>Student wallet addresses</li>
              <li>Attendance records (present/absent status)</li>
              <li>Class and section information</li>
              <li>Teacher and admin wallet addresses</li>
            </ul>
            <p>
              All data stored on the blockchain is publicly accessible and immutable.
            </p>

            <h3>2.2 Wallet Information</h3>
            <p>
              When you connect your MetaMask wallet, we access:
            </p>
            <ul>
              <li>Your wallet address (public key)</li>
              <li>Network information (Chain ID)</li>
            </ul>
            <p>
              We do not store or have access to your private keys.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Record and manage attendance data</li>
              <li>Verify user roles (Admin, Teacher, Student)</li>
              <li>Display attendance statistics and analytics</li>
              <li>Ensure system security and prevent unauthorized access</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Blockchain Transparency</h2>
            <p>
              All attendance records are stored on the Ethereum blockchain, which means:
            </p>
            <ul>
              <li>Data is publicly verifiable</li>
              <li>Records cannot be altered or deleted</li>
              <li>Transactions are transparent and traceable</li>
            </ul>
            <p>
              By using our service, you acknowledge that your attendance data will be publicly accessible on the blockchain.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Data Security</h2>
            <p>
              We implement security measures to protect your information:
            </p>
            <ul>
              <li>Smart contract access controls</li>
              <li>Role-based permissions</li>
              <li>Secure wallet connections via MetaMask</li>
            </ul>
            <p>
              However, no method of transmission over the internet or electronic storage is 100% secure.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your attendance records</li>
              <li>Verify data accuracy on the blockchain</li>
              <li>Disconnect your wallet at any time</li>
            </ul>
            <p>
              Note: Once data is recorded on the blockchain, it cannot be deleted due to blockchain immutability.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Third-Party Services</h2>
            <p>
              We use the following third-party services:
            </p>
            <ul>
              <li><strong>MetaMask:</strong> For wallet connection and transaction signing</li>
              <li><strong>Ethereum Network:</strong> For blockchain data storage</li>
              <li><strong>Infura:</strong> For blockchain network access</li>
            </ul>
            <p>
              Please review their privacy policies separately.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Children's Privacy</h2>
            <p>
              Our service is intended for educational institutions. If you are under 18, please ensure you have parental or guardian consent before using our service.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us through your educational institution's administration.
            </p>
          </section>
        </div>
      </main>

      <footer className="legal-footer">
        <div className="legal-footer-container">
          <div className="legal-footer-copyright">© 2025 BlockAttend. All Rights Reserved.</div>
          <div className="legal-footer-links">
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Privacy

