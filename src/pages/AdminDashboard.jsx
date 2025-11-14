import React, { useState, useEffect } from 'react'
import { useWeb3 } from '../context/Web3Context'
import { fetchAllUsers, isContractDeployed, formatError, fetchClassesWithSections, fetchSectionStudents } from '../utils/contractUtils'
import { verifyContractDeployment, getNetworkInfo } from '../utils/verifyContract'
import ConnectionStatus from '../components/ConnectionStatus'
import AccountDebug from '../components/AccountDebug'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const { account, contract, provider, isConnected, connectWallet, loading: web3Loading } = useWeb3()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [users, setUsers] = useState([])
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [userType, setUserType] = useState('student') // 'student' or 'teacher'

  // Form states
  const [studentAddress, setStudentAddress] = useState('')
  const [studentName, setStudentName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [teacherAddress, setTeacherAddress] = useState('')
  const [teacherName, setTeacherName] = useState('')

  // Class & Section management states
  const [classes, setClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedSectionId, setSelectedSectionId] = useState('')
  const [sectionStudents, setSectionStudents] = useState([])
  const [newClassId, setNewClassId] = useState('')
  const [newClassName, setNewClassName] = useState('')
  const [sectionClassId, setSectionClassId] = useState('')
  const [newSectionId, setNewSectionId] = useState('')
  const [newSectionName, setNewSectionName] = useState('')
  const [assignStudentAddress, setAssignStudentAddress] = useState('')

  useEffect(() => {
    if (isConnected && contract && account) {
      checkAdminRole()
      loadUsers()
      loadClasses()
    }
  }, [isConnected, contract, account])

  const checkAdminRole = async () => {
    try {
      if (!contract || !account) {
        console.log('Contract or account not available')
        setIsAdmin(false)
        return
      }
      
      const contractAddress = contract.target || contract.address
      console.log('=== Admin Role Check ===')
      console.log('Account:', account)
      console.log('Contract address:', contractAddress)
      
      // Verify contract deployment
      if (provider) {
        console.log('Verifying contract deployment...')
        const verification = await verifyContractDeployment(provider)
        console.log('Verification result:', verification)
        
        if (verification.status === 'rate_limited') {
          console.warn('Contract verification rate limited:', verification.error)
          setError(`Contract verification skipped temporarily:\n${verification.error}\n\nTips:\n• Hardhat node ko restart karein agar idle ho gaya\n• MetaMask se Hardhat local network disconnect/reconnect karein\n• Kuch seconds wait karke page refresh karein`)
        } else if (verification.status === 'not_found' || verification.status === 'not_configured') {
          console.error('Contract not found/configured:', verification.error)
          setError(`Contract verification failed:\n${verification.error}\n\nPlease ensure:\n1. Hardhat node is running (npm run node)\n2. Contract is deployed (npm run deploy:local)\n3. You're on Hardhat Local network (Chain ID: 1337)`)
          setIsAdmin(false)
          return
        } else if (verification.status === 'error' && verification.deployed !== true) {
          console.error('Contract verification error:', verification.error)
          setError(`Contract verification error:\n${verification.error || 'Unknown error'}\n\nPlease restart Hardhat node aur page refresh karein.`)
          setIsAdmin(false)
          return
        } else {
          console.log('Contract verification successful or skipped:', verification.status)
          // Clear any stale errors from earlier runs
          if (!error) {
            setError(null)
          }
        }

        // Check network (only if provider available)
        const networkInfo = await getNetworkInfo(provider)
        console.log('Network info:', networkInfo)

        if (networkInfo.status === 'error') {
          console.error('Network info error:', networkInfo.error)
          setError(`Network check failed:\n${networkInfo.error}\n\nPlease ensure you're connected to the correct network.`)
          setIsAdmin(false)
          return
        }
        
        if (!networkInfo.isCorrectNetwork) {
          console.error(`Wrong network. Expected Chain ID: ${networkInfo.expectedChainId}, Got: ${networkInfo.chainId}`)
          setError(`Wrong network detected.\n\nExpected: ${networkInfo.expectedNetworkName} (Chain ID: ${networkInfo.expectedChainId})\nCurrent: ${networkInfo.name} (Chain ID: ${networkInfo.chainId})\n\nPlease switch to ${networkInfo.expectedNetworkName} in MetaMask.`)
          setIsAdmin(false)
          return
        }
      }
      
      if (!isContractDeployed(contractAddress)) {
        console.error('Contract address invalid:', contractAddress)
        setError('Contract is not deployed. Please run: npm run deploy:local')
        setIsAdmin(false)
        return
      }

      // Check admin role
      console.log('Calling isAdmin function...')
      const deployerAccount = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
      const isDeployer = account?.toLowerCase() === deployerAccount.toLowerCase()
      console.log('Is deployer account?', isDeployer)
      
      try {
        const admin = await contract.isAdmin(account)
        console.log('✅ Admin check result:', admin)
        setIsAdmin(admin)
        
        if (!admin) {
          console.log('❌ Account is not admin')
          if (!isDeployer) {
            console.log('💡 Current account is not the deployer account')
            console.log('💡 Switch to Account #0 in MetaMask (the deployer account)')
          } else {
            console.log('⚠️ Deployer account is not admin - this should not happen!')
            console.log('💡 Try redeploying the contract: npm run deploy:local')
          }
        } else {
          console.log('✅ Account is admin! Access granted.')
          setError(null) // Clear any previous errors
        }
      } catch (callErr) {
        console.error('❌ Contract call error:', callErr)
        if (callErr.message && callErr.message.includes('could not decode result data')) {
          setError(`Contract call failed. The contract might not be deployed at this address.\n\nPlease:\n1. Ensure Hardhat node is running: npm run node\n2. Deploy contract: npm run deploy:local\n3. Check deployment.json has correct address\n4. Verify you're on Hardhat Local network (Chain ID: 1337)`)
        } else if (callErr.message && callErr.message.includes('network')) {
          setError(`Network error: ${callErr.message}\n\nPlease check:\n1. Hardhat node is running\n2. MetaMask is on Hardhat Local network\n3. Network settings are correct`)
        } else {
          setError(`Contract call error: ${callErr.message}\n\nPlease check console for more details.`)
        }
        setIsAdmin(false)
      }
    } catch (err) {
      console.error('❌ Error checking admin role:', err)
      setError(`Error: ${err.message || 'Unknown error'}\n\nPlease check console for details.`)
      setIsAdmin(false)
    }
  }

  const loadUsers = async () => {
    try {
      if (!contract || !provider) {
        setUsers([])
        return
      }

      const allUsers = await fetchAllUsers(contract, provider)
      setUsers(allUsers)
    } catch (err) {
      console.error('Error loading users:', err)
      setUsers([])
    }
  }

  const loadSectionStudents = async (classId, sectionId) => {
    try {
      if (!contract || !classId || !sectionId) {
        setSectionStudents([])
        return
      }

      const studentsInSection = await fetchSectionStudents(contract, classId, sectionId)
      setSectionStudents(studentsInSection)
    } catch (err) {
      console.error('Error loading section students:', err)
      setSectionStudents([])
    }
  }

  const loadClasses = async () => {
    try {
      if (!contract) {
        setClasses([])
        return
      }

      const classData = await fetchClassesWithSections(contract)
      setClasses(classData)

      if (classData.length === 0) {
        setSelectedClassId('')
        setSelectedSectionId('')
        setSectionStudents([])
        return
      }

      const currentClassId = selectedClassId && classData.some(cls => cls.id === selectedClassId)
        ? selectedClassId
        : classData[0].id

      setSelectedClassId(currentClassId)
      if (!sectionClassId || !classData.some(cls => cls.id === sectionClassId)) {
        setSectionClassId(currentClassId)
      }

      const classObj = classData.find(cls => cls.id === currentClassId)
      if (!classObj || classObj.sections.length === 0) {
        setSelectedSectionId('')
        setSectionStudents([])
        return
      }

      const currentSectionId = selectedSectionId && classObj.sections.some(sec => sec.id === selectedSectionId)
        ? selectedSectionId
        : classObj.sections[0].id

      setSelectedSectionId(currentSectionId)
      await loadSectionStudents(currentClassId, currentSectionId)
    } catch (err) {
      console.error('Error loading classes:', err)
      setClasses([])
      setSectionStudents([])
    }
  }

  const handleRegisterStudent = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      if (!studentAddress || !studentName || !studentId) {
        setError('Please fill in all fields')
        return
      }

      const tx = await contract.registerStudent(studentAddress, studentName, studentId)
      await tx.wait()

      setSuccess('Student registered successfully!')
      setStudentAddress('')
      setStudentName('')
      setStudentId('')
      setShowAddUserModal(false)
      
      // Add to users list
      setUsers(prev => [...prev, {
        address: studentAddress,
        name: studentName,
        email: `${studentId.toLowerCase()}@university.edu`,
        role: 'Student'
      }])

      setTimeout(() => {
        setSuccess(null)
      }, 3000)

    } catch (err) {
      setError(err.message)
      console.error('Error registering student:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterTeacher = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      if (!teacherAddress || !teacherName) {
        setError('Please fill in all fields')
        return
      }

      const tx = await contract.registerTeacher(teacherAddress, teacherName)
      await tx.wait()

      setSuccess('Teacher registered successfully!')
      setTeacherAddress('')
      setTeacherName('')
      setShowAddUserModal(false)

      // Add to users list
      setUsers(prev => [...prev, {
        address: teacherAddress,
        name: teacherName,
        email: `${teacherName.toLowerCase().replace(/\s+/g, '.')}@university.edu`,
        role: 'Teacher'
      }])

      setTimeout(() => {
        setSuccess(null)
      }, 3000)

    } catch (err) {
      setError(err.message)
      console.error('Error registering teacher:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddClass = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      if (!newClassId || !newClassName) {
        setError('Please provide both Class ID and Class Name')
        return
      }

      const tx = await contract.addClass(newClassId, newClassName)
      await tx.wait()

      setSuccess('Class added successfully!')
      setNewClassId('')
      setNewClassName('')
      await loadClasses()

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(formatError(err))
      console.error('Error adding class:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSection = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      if (!sectionClassId) {
        setError('Please select a class for the new section')
        return
      }

      if (!newSectionId || !newSectionName) {
        setError('Please provide section ID and name')
        return
      }

      const tx = await contract.addSection(sectionClassId, newSectionId, newSectionName)
      await tx.wait()

      setSuccess('Section added successfully!')
      setNewSectionId('')
      setNewSectionName('')
      await loadClasses()

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(formatError(err))
      console.error('Error adding section:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAssignStudent = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      if (!selectedClassId || !selectedSectionId) {
        setError('Please select a class and section first')
        return
      }

      if (!assignStudentAddress) {
        setError('Please select a student to assign')
        return
      }

      const tx = await contract.assignStudentToSection(assignStudentAddress, selectedClassId, selectedSectionId)
      await tx.wait()

      setSuccess('Student assigned to section successfully!')
      setAssignStudentAddress('')
      await Promise.all([loadClasses(), loadSectionStudents(selectedClassId, selectedSectionId)])

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(formatError(err))
      console.error('Error assigning student:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClassSelectionChange = async (event) => {
    const classId = event.target.value
    setSelectedClassId(classId)

    const classObj = classes.find(cls => cls.id === classId)
    if (classObj && classObj.sections.length > 0) {
      const firstSectionId = classObj.sections[0].id
      setSelectedSectionId(firstSectionId)
      await loadSectionStudents(classId, firstSectionId)
    } else {
      setSelectedSectionId('')
      setSectionStudents([])
    }
  }

  const handleSectionSelectionChange = async (event) => {
    const sectionId = event.target.value
    setSelectedSectionId(sectionId)
    if (selectedClassId && sectionId) {
      await loadSectionStudents(selectedClassId, sectionId)
    }
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getAvatarColor = (name) => {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a']
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  const studentOptions = users.filter(user => user.role === 'Student')
  const selectedClass = classes.find(cls => cls.id === selectedClassId)
  const selectedSection = selectedClass?.sections.find(sec => sec.id === selectedSectionId)

  if (!isConnected) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>User Management</h1>
        </div>
        <ConnectionStatus />
        <div className="wallet-connect-card">
          <div className="wallet-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2>Connect Your Wallet</h2>
          <p>Please connect your MetaMask wallet to access the admin dashboard.</p>
          <button onClick={connectWallet} className="btn-connect" disabled={web3Loading}>
            {web3Loading ? 'Connecting...' : 'Connect MetaMask'}
          </button>
          <div className="troubleshooting-info">
            <h4>Troubleshooting:</h4>
            <ul>
              <li>Ensure Hardhat node is running: <code>npm run node</code></li>
              <li>Check MetaMask is on Hardhat Local network (Chain ID: 1337)</li>
              <li>Verify contract is deployed: <code>npm run deploy:local</code></li>
              <li>Use the account that deployed the contract (it's automatically admin)</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin && isConnected && contract) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>User Management</h1>
        </div>
        <AccountDebug />
        {error && (
          <div className="alert alert-error" style={{ whiteSpace: 'pre-line' }}>
            {error}
          </div>
        )}
        <div className="access-instructions-card">
          <div className="error-icon">⚠️</div>
          <h2>Access Denied</h2>
          <p className="error-message">
            Aap is page ko access nahi kar sakte. Sirf admins hi users ko manage kar sakte hain.
          </p>
          <div className="instructions-box">
            <h3>Admin Access Kaise Milega?</h3>
            <ol className="steps-list">
              <li>
                <strong>Hardhat Node Check Karein:</strong> Hardhat node running hai?
                <div className="code-block">npm run node</div>
                <p className="help-text-small">Hardhat node terminal mein "Started HTTP and WebSocket JSON-RPC server" dikhna chahiye</p>
              </li>
              <li>
                <strong>Contract Deploy Karein:</strong> Contract deployed hai?
                <div className="code-block">npm run deploy:local</div>
                <p className="help-text-small">Deployment successful hone ke baad contract address dikhna chahiye</p>
              </li>
              <li>
                <strong>Deployment.json Check Karein:</strong> Contract address sahi hai?
                <div className="code-block">frontend/src/contracts/deployment.json</div>
                <p className="help-text-small">Address zero (0x0000...) nahi hona chahiye</p>
              </li>
              <li>
                <strong>MetaMask Network Check Karein:</strong> Hardhat Local network select hai?
                <p className="help-text-small">Chain ID: 1337, RPC: http://127.0.0.1:8545</p>
              </li>
              <li>
                <strong>Deployer Account Use Karein:</strong> Jo account contract deploy karta hai, woh automatically admin hota hai
                <p className="help-text-small">Hardhat node terminal se Account #0 ka private key copy karein</p>
              </li>
              <li>
                <strong>Browser Refresh Karein:</strong> Page refresh karein (F5)
                <p className="help-text-small">Agar changes kiye hain, to hard refresh karein (Ctrl+Shift+R)</p>
              </li>
            </ol>
            <div className="help-text">
              <p><strong>Debug Steps:</strong></p>
              <ol>
                <li>Browser console (F12) check karein - errors dikhenge</li>
                <li>Hardhat node terminal check karein - running hai?</li>
                <li>Contract address verify karein - deployment.json mein sahi hai?</li>
                <li>MetaMask network check karein - Hardhat Local select hai?</li>
                <li>Account verify karein - deployer account use kar rahe hain?</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin && !isConnected) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>User Management</h1>
        </div>
        <div className="wallet-connect-card">
          <div className="wallet-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2>Connect Your Wallet</h2>
          <p>Please connect your MetaMask wallet to access the admin dashboard.</p>
          <button onClick={connectWallet} className="btn-connect" disabled={web3Loading}>
            {web3Loading ? 'Connecting...' : 'Connect MetaMask'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>User Management</h1>
        </div>
        <button className="btn-add-user" onClick={() => setShowAddUserModal(true)}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="users-section">
        <div className="users-card">
          <h2>Users</h2>
          <p className="users-description">Manage teachers and students on the platform.</p>
          
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="no-users">
                      No users registered yet. Click "Add User" to register a student or teacher.
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={index}>
                      <td>
                        <div className="user-info">
                          <div 
                            className="user-avatar" 
                            style={{ backgroundColor: getAvatarColor(user.name) }}
                          >
                            {getInitials(user.name)}
                          </div>
                          <span>{user.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge ${user.role.toLowerCase()}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <button className="table-action-btn">
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="class-management">
        <h2>Classes & Sections</h2>
        <p className="classes-description">
          Create classes, add sections, aur students ko assign karein. Teachers sirf apne section ke students ki attendance mark kar sakenge.
        </p>

        <div className="class-management-grid">
          <div className="class-card">
            <h3>Add Class</h3>
            <form onSubmit={handleAddClass}>
              <div className="form-group">
                <label>Class ID</label>
                <input
                  type="text"
                  value={newClassId}
                  onChange={(e) => setNewClassId(e.target.value)}
                  placeholder="CS101"
                  required
                />
              </div>
              <div className="form-group">
                <label>Class Name</label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="Introduction to Blockchain"
                  required
                />
              </div>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Class'}
              </button>
            </form>
          </div>

          <div className="class-card">
            <h3>Add Section</h3>
            <form onSubmit={handleAddSection}>
              <div className="form-group">
                <label>Select Class</label>
                <select
                  value={sectionClassId}
                  onChange={(e) => setSectionClassId(e.target.value)}
                  required
                >
                  <option value="">Choose class...</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.id})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Section ID</label>
                <input
                  type="text"
                  value={newSectionId}
                  onChange={(e) => setNewSectionId(e.target.value)}
                  placeholder="A"
                  required
                />
              </div>
              <div className="form-group">
                <label>Section Name</label>
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="Morning Batch"
                  required
                />
              </div>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Section'}
              </button>
            </form>
          </div>

          <div className="class-card">
            <h3>Assign Student to Section</h3>
            <form onSubmit={handleAssignStudent}>
              <div className="form-group">
                <label>Class</label>
                <select value={selectedClassId} onChange={handleClassSelectionChange} required>
                  <option value="">Select class...</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.id})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Section</label>
                <select value={selectedSectionId} onChange={handleSectionSelectionChange} required>
                  <option value="">Select section...</option>
                  {selectedClass?.sections?.map(section => (
                    <option key={section.id} value={section.id}>
                      {section.name} ({section.id})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Student</label>
                <select
                  value={assignStudentAddress}
                  onChange={(e) => setAssignStudentAddress(e.target.value)}
                  required
                >
                  <option value="">Select student...</option>
                  {studentOptions.length === 0 && <option value="" disabled>No students registered yet</option>}
                  {studentOptions.map(student => (
                    <option key={student.address} value={student.address}>
                      {student.name} ({student.studentId || student.address.slice(0, 6) + '...' + student.address.slice(-4)})
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Assigning...' : 'Assign Student'}
              </button>
            </form>
          </div>
        </div>

        <div className="class-overview">
          <h3>Class Overview</h3>
          {classes.length === 0 ? (
            <p className="no-classes">Abhi tak koi class create nahi ki gayi.</p>
          ) : (
            <div className="class-overview-grid">
              {classes.map(cls => (
                <div key={cls.id} className="class-overview-card">
                  <div className="class-overview-header">
                    <h4>{cls.name}</h4>
                    <span className="class-id">{cls.id}</span>
                  </div>
                  {cls.sections.length === 0 ? (
                    <p className="no-sections">No sections yet. Add one to get started.</p>
                  ) : (
                    <ul className="section-list">
                      {cls.sections.map(section => (
                        <li key={section.id}>
                          <div>
                            <strong>{section.name}</strong> <span className="section-id">({section.id})</span>
                          </div>
                          <span className="section-count">{section.studentCount} students</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedClassId && selectedSectionId && (
          <div className="class-section-students">
            <h3>
              {selectedClass?.name || selectedClassId} — {selectedSection?.name || selectedSectionId}
            </h3>
            <p className="section-description">
              Total students: {sectionStudents.length}. Teacher jab ye section select karega, to sirf yehi students dikhenge.
            </p>

            {sectionStudents.length === 0 ? (
              <div className="no-students">
                <p>Is section mein abhi koi student assign nahi hai.</p>
              </div>
            ) : (
              <div className="users-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Student ID</th>
                      <th>Wallet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sectionStudents.map(student => (
                      <tr key={student.address}>
                        <td>{student.name}</td>
                        <td>{student.studentId}</td>
                        <td>{student.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {showAddUserModal && (
        <div className="modal-overlay" onClick={() => setShowAddUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add User</h2>
              <button className="modal-close" onClick={() => setShowAddUserModal(false)}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="user-type-selector">
                <button
                  className={`type-btn ${userType === 'student' ? 'active' : ''}`}
                  onClick={() => setUserType('student')}
                >
                  Student
                </button>
                <button
                  className={`type-btn ${userType === 'teacher' ? 'active' : ''}`}
                  onClick={() => setUserType('teacher')}
                >
                  Teacher
                </button>
              </div>

              {userType === 'student' ? (
                <form onSubmit={handleRegisterStudent}>
                  <div className="form-group">
                    <label>Student Wallet Address</label>
                    <input
                      type="text"
                      value={studentAddress}
                      onChange={(e) => setStudentAddress(e.target.value)}
                      placeholder="0x..."
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Student Name</label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Student ID</label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="STU001"
                      required
                    />
                  </div>
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register Student'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegisterTeacher}>
                  <div className="form-group">
                    <label>Teacher Wallet Address</label>
                    <input
                      type="text"
                      value={teacherAddress}
                      onChange={(e) => setTeacherAddress(e.target.value)}
                      placeholder="0x..."
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Teacher Name</label>
                    <input
                      type="text"
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                      placeholder="Dr. Jane Smith"
                      required
                    />
                  </div>
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register Teacher'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
