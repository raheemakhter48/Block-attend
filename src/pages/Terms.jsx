import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import './Terms.css'

const Terms = () => {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <div className="legal-header-container">
          <Link to="/" className="legal-logo">
            <Logo size="medium" showText={true} />
          </Link>
          <nav className="legal-nav">
            <Link to="/">Home</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </nav>
        </div>
      </header>

      <main className="legal-main">
        <div className="legal-container">
          <h1>Terms of Service</h1>
          <p className="last-updated">Last Updated: November 15, 2025</p>

          <section className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using BlockAttend, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Description of Service</h2>
            <p>
              BlockAttend is a blockchain-based attendance management system that allows educational institutions to:
            </p>
            <ul>
              <li>Record student attendance on the Ethereum blockchain</li>
              <li>Manage user roles (Admin, Teacher, Student)</li>
              <li>Track attendance statistics and analytics</li>
              <li>Ensure data immutability and transparency</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. User Responsibilities</h2>
            <h3>3.1 Wallet Security</h3>
            <p>
              You are solely responsible for:
            </p>
            <ul>
              <li>Maintaining the security of your MetaMask wallet</li>
              <li>Protecting your private keys</li>
              <li>All transactions made from your wallet address</li>
            </ul>
            <p>
              We are not responsible for any loss of funds or unauthorized access to your wallet.
            </p>

            <h3>3.2 Accurate Information</h3>
            <p>
              You agree to provide accurate and complete information when using the service. Providing false information may result in termination of access.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Blockchain Transactions</h2>
            <p>
              All operations on BlockAttend require blockchain transactions, which:
            </p>
            <ul>
              <li>Incur gas fees (network transaction costs)</li>
              <li>Are irreversible once confirmed on the blockchain</li>
              <li>Are publicly visible on the blockchain explorer</li>
            </ul>
            <p>
              You are responsible for all gas fees associated with your transactions.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Role-Based Access</h2>
            <h3>5.1 Admin</h3>
            <p>
              Administrators can:
            </p>
            <ul>
              <li>Register students and teachers</li>
              <li>Create classes and sections</li>
              <li>Manage user permissions</li>
            </ul>

            <h3>5.2 Teacher</h3>
            <p>
              Teachers can:
            </p>
            <ul>
              <li>Mark attendance for students</li>
              <li>View attendance records</li>
              <li>Access assigned classes and sections</li>
            </ul>

            <h3>5.3 Student</h3>
            <p>
              Students can:
            </p>
            <ul>
              <li>View their own attendance records</li>
              <li>Access attendance statistics</li>
              <li>Verify attendance data on the blockchain</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. Data Immutability</h2>
            <p>
              All attendance records are stored on the Ethereum blockchain, which means:
            </p>
            <ul>
              <li>Data cannot be altered or deleted once recorded</li>
              <li>All records are permanent and publicly verifiable</li>
              <li>Historical data is preserved indefinitely</li>
            </ul>
            <p>
              By using this service, you acknowledge and accept the permanent nature of blockchain records.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Prohibited Uses</h2>
            <p>You may not use BlockAttend to:</p>
            <ul>
              <li>Violate any laws or regulations</li>
              <li>Impersonate another person or entity</li>
              <li>Manipulate or attempt to manipulate attendance records</li>
              <li>Interfere with the operation of the service</li>
              <li>Access accounts or data you are not authorized to access</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>8. Network Availability</h2>
            <p>
              BlockAttend depends on:
            </p>
            <ul>
              <li>Ethereum network availability</li>
              <li>MetaMask wallet functionality</li>
              <li>Third-party RPC providers (Infura, Alchemy, etc.)</li>
            </ul>
            <p>
              We are not responsible for service interruptions due to network issues or third-party service outages.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Limitation of Liability</h2>
            <p>
              BlockAttend is provided "as is" without warranties of any kind. We shall not be liable for:
            </p>
            <ul>
              <li>Loss of funds due to wallet security issues</li>
              <li>Network congestion or transaction failures</li>
              <li>Data loss or corruption</li>
              <li>Unauthorized access to accounts</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>10. Smart Contract Risks</h2>
            <p>
              Our service uses smart contracts on the Ethereum blockchain. You acknowledge that:
            </p>
            <ul>
              <li>Smart contracts may contain bugs or vulnerabilities</li>
              <li>Blockchain technology is still evolving</li>
              <li>There may be risks associated with smart contract interactions</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>11. Modifications to Service</h2>
            <p>
              We reserve the right to modify, suspend, or discontinue the service at any time without prior notice. We are not liable to you or any third party for any modification, suspension, or discontinuation.
            </p>
          </section>

          <section className="legal-section">
            <h2>12. Termination</h2>
            <p>
              We may terminate or suspend your access to the service immediately, without prior notice, for any breach of these Terms of Service. However, your attendance records will remain on the blockchain.
            </p>
          </section>

          <section className="legal-section">
            <h2>13. Governing Law</h2>
            <p>
              These Terms of Service shall be governed by and construed in accordance with applicable laws. Any disputes arising from these terms shall be resolved through appropriate legal channels.
            </p>
          </section>

          <section className="legal-section">
            <h2>14. Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact your educational institution's administration or technical support team.
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

export default Terms

