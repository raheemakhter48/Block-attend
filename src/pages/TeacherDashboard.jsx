import React, { useState, useEffect } from 'react'
import { useWeb3 } from '../context/Web3Context'
import { fetchClassesWithSections, fetchSectionStudents, isContractDeployed, formatError } from '../utils/contractUtils'
import { ethers } from 'ethers'
import Loading from '../components/Loading'
import './TeacherDashboard.css'

const TeacherDashboard = () => {
  const { account, contract, provider, isConnected, connectWallet, loading: web3Loading } = useWeb3()
  const [isTeacher, setIsTeacher] = useState(false)
  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [sectionStudents, setSectionStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loadingStudents, setLoadingStudents] = useState(false)

  // Form state
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedStudents, setSelectedStudents] = useState({}) // address => present/absent

  useEffect(() => {
    if (isConnected && contract && account && provider) {
      setInitialLoading(true)
      Promise.all([
        checkTeacherRole(),
        loadClassesData()
      ]).finally(() => {
        setInitialLoading(false)
      })
    } else if (!isConnected) {
      setInitialLoading(false)
    }
  }, [isConnected, contract, account, provider])

  const checkTeacherRole = async () => {
    try {
      const teacher = await contract.isTeacher(account)
      const admin = await contract.isAdmin(account)
      setIsTeacher(teacher || admin)
    } catch (err) {
      console.error('Error checking teacher role:', err)
    }
  }

  const loadSectionStudentsData = async (classId, sectionId) => {
    try {
      setLoadingStudents(true)
      if (!contract || !classId || !sectionId) {
        setSectionStudents([])
        return
      }

      const studentsInSection = await fetchSectionStudents(contract, classId, sectionId)
      setSectionStudents(studentsInSection)
      setSelectedStudents({})
    } catch (err) {
      console.error('Error loading section students:', err)
      setSectionStudents([])
    } finally {
      setLoadingStudents(false)
    }
  }

  const loadClassesData = async () => {
    try {
      if (!contract) {
        setClasses([])
        setSections([])
        setSectionStudents([])
        return
      }

      const classData = await fetchClassesWithSections(contract)
      setClasses(classData)

      if (classData.length === 0) {
        setSelectedClass('')
        setSections([])
        setSelectedSection('')
        setSectionStudents([])
        return
      }

      const defaultClassId = selectedClass && classData.some(cls => cls.id === selectedClass)
        ? selectedClass
        : classData[0].id

      setSelectedClass(defaultClassId)

      const classObj = classData.find(cls => cls.id === defaultClassId)
      const sectionsList = classObj ? classObj.sections : []
      setSections(sectionsList)

      if (sectionsList.length === 0) {
        setSelectedSection('')
        setSectionStudents([])
        return
      }

      const defaultSectionId = selectedSection && sectionsList.some(sec => sec.id === selectedSection)
        ? selectedSection
        : sectionsList[0].id

      setSelectedSection(defaultSectionId)
      await loadSectionStudentsData(defaultClassId, defaultSectionId)
    } catch (err) {
      console.error('Error loading classes:', err)
      setClasses([])
      setSections([])
      setSectionStudents([])
    }
  }

  const handleClassChange = async (event) => {
    const classId = event.target.value
    setSelectedClass(classId)

    const classObj = classes.find(cls => cls.id === classId)
    if (classObj && classObj.sections.length > 0) {
      const firstSection = classObj.sections[0].id
      setSelectedSection(firstSection)
      await loadSectionStudentsData(classId, firstSection)
    } else {
      setSelectedSection('')
      setSectionStudents([])
    }
  }

  const handleSectionChange = async (event) => {
    const sectionId = event.target.value
    setSelectedSection(sectionId)

    if (selectedClass && sectionId) {
      await loadSectionStudentsData(selectedClass, sectionId)
    }
  }

  const handleMarkAttendance = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      if (!selectedClass) {
        setError('Please select a class')
        return
      }

      if (!selectedSection) {
        setError('Please select a section')
        return
      }

      const classObj = classes.find(c => c.id === selectedClass)
      const sectionObj = sections.find(s => s.id === selectedSection)
      const subject = classObj && sectionObj ? `${classObj.name || classObj.label} - ${sectionObj.name}` : selectedClass

      const studentAddresses = Object.keys(selectedStudents)
      const attendanceStatuses = studentAddresses.map(addr => selectedStudents[addr] === 'present')

      if (studentAddresses.length === 0) {
        setError('Please add at least one student')
        return
      }

      const tx = await contract.markBulkAttendance(
        studentAddresses,
        attendanceStatuses,
        subject
      )

      await tx.wait()
      setSuccess('Attendance marked successfully!')
      setSelectedStudents({})
      
      // Reload students to get updated attendance
      await loadSectionStudentsData(selectedClass, selectedSection)
      
      setTimeout(() => {
        setSuccess(null)
      }, 3000)

    } catch (err) {
      setError(formatError(err))
      console.error('Error marking attendance:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStudentToggle = (address, status) => {
    setSelectedStudents(prev => ({
      ...prev,
      [address]: status
    }))
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  if (initialLoading && isConnected) {
    return <Loading message="Please wait while loading your details..." />
  }

  if (!isConnected) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Mark Attendance</h1>
        </div>
        <div className="wallet-connect-card">
          <div className="wallet-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2>Connect Your Wallet</h2>
          <p>Please connect your MetaMask wallet to access the teacher dashboard.</p>
          <button onClick={connectWallet} className="btn-connect" disabled={web3Loading}>
            {web3Loading ? 'Connecting...' : 'Connect MetaMask'}
          </button>
        </div>
      </div>
    )
  }

  if (!isTeacher) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Mark Attendance</h1>
        </div>
        <div className="access-instructions-card">
          <div className="error-icon">⚠️</div>
          <h2>Access Denied</h2>
          <p className="error-message">
            Aap is page ko access nahi kar sakte. Sirf teachers aur admins hi attendance mark kar sakte hain.
          </p>
          <div className="instructions-box">
            <h3>Teacher Access Kaise Milega?</h3>
            <ol className="steps-list">
              <li>
                <strong>Admin Se Contact Karein:</strong> Kisi admin se request karein ke wo aapko teacher register karein
              </li>
              <li>
                <strong>Admin Dashboard:</strong> Admin ko Admin Dashboard par jana hoga
              </li>
              <li>
                <strong>Register Teacher:</strong> Admin "Add User" button click karein aur "Teacher" select karein
              </li>
              <li>
                <strong>Wallet Address:</strong> Apna MetaMask wallet address admin ko dein
              </li>
              <li>
                <strong>Name:</strong> Apna naam admin ko dein
              </li>
              <li>
                <strong>Wait for Registration:</strong> Admin aapko register karne ke baad, aap teacher dashboard access kar sakte hain
              </li>
            </ol>
            <div className="help-text">
              <p><strong>Quick Check:</strong> Agar aap admin hain, to aap directly access kar sakte hain.</p>
              <p>Agar aap contract deploy karne wale account se connected hain, to aap automatically admin hain.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Mark Attendance</h1>
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

      <div className="attendance-card">
        <h2>Mark Student Attendance</h2>
        <p className="card-description">Select a class and date to mark attendance.</p>

        <div className="form-row">
          <div className="form-group">
            <label>Class</label>
            <select value={selectedClass} onChange={handleClassChange}>
              <option value="">Select a class...</option>
              {classes.map(classItem => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name} ({classItem.id})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Section</label>
            <select value={selectedSection} onChange={handleSectionChange}>
              <option value="">Select a section...</option>
              {sections.map(section => (
                <option key={section.id} value={section.id}>
                  {section.name} ({section.id})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <div className="date-input-container">
              <svg className="date-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-input"
              />
              <span className="date-display">{formatDate(selectedDate)}</span>
            </div>
          </div>
        </div>

        <div className="students-section">
          <h3>Students</h3>
          
          {loadingStudents ? (
            <div className="loading-students">Loading students...</div>
          ) : sectionStudents.length > 0 ? (
            <div className="students-list-registered">
              <p className="students-help-text">Select students from the list below:</p>
              <div className="registered-students-grid">
                {sectionStudents.map((student) => (
                  <div 
                    key={student.address} 
                    className={`student-card ${selectedStudents[student.address] ? 'selected' : ''}`}
                    onClick={() => {
                      if (!selectedStudents[student.address]) {
                        handleStudentToggle(student.address, 'present')
                      }
                    }}
                  >
                    <div className="student-card-info">
                      <div className="student-card-name">{student.name}</div>
                      <div className="student-card-address">{student.address.slice(0, 10)}...{student.address.slice(-8)}</div>
                    </div>
                    {selectedStudents[student.address] && (
                      <div className="student-card-status">
                        {selectedStudents[student.address] === 'present' ? '✓ Present' : '✗ Absent'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-students">
              <p>No students assigned to this section yet. Please ask an admin to assign students first.</p>
            </div>
          )}

          <div className="manual-entry">
            <label>Or Add Student by Wallet Address</label>
            <div className="address-input-group">
              <input
                type="text"
                placeholder="0x..."
                className="address-input"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const address = e.target.value.trim()
                    if (address && ethers.isAddress(address) && !selectedStudents[address]) {
                      const existsInSection = sectionStudents.some(student => student.address.toLowerCase() === address.toLowerCase())
                      if (existsInSection) {
                        handleStudentToggle(address, 'present')
                        e.target.value = ''
                      } else {
                        setError('This student is not part of the selected section.')
                      }
                    } else if (address && !ethers.isAddress(address)) {
                      setError('Please enter a valid wallet address')
                    }
                  }
                }}
              />
              <button
                className="btn-add"
                onClick={(e) => {
                  const input = e.target.previousElementSibling
                  const address = input.value.trim()
                  if (address && ethers.isAddress(address) && !selectedStudents[address]) {
                    const existsInSection = sectionStudents.some(student => student.address.toLowerCase() === address.toLowerCase())
                    if (existsInSection) {
                      handleStudentToggle(address, 'present')
                      input.value = ''
                    } else {
                      setError('This student is not part of the selected section.')
                    }
                  } else if (address && !ethers.isAddress(address)) {
                    setError('Please enter a valid wallet address')
                  }
                }}
              >
                Add Student
              </button>
            </div>
          </div>

          {Object.keys(selectedStudents).length > 0 && (
            <div className="selected-students">
              <h4>Selected Students ({Object.keys(selectedStudents).length})</h4>
              <div className="student-list">
                {Object.entries(selectedStudents).map(([address, status]) => (
                  <div key={address} className="student-item">
                    <span className="student-address">{address.slice(0, 10)}...{address.slice(-8)}</span>
                    <div className="attendance-buttons">
                      <button
                        className={`btn-status ${status === 'present' ? 'btn-present active' : 'btn-present'}`}
                        onClick={() => handleStudentToggle(address, 'present')}
                      >
                        Present
                      </button>
                      <button
                        className={`btn-status ${status === 'absent' ? 'btn-absent active' : 'btn-absent'}`}
                        onClick={() => handleStudentToggle(address, 'absent')}
                      >
                        Absent
                      </button>
                      <button
                        className="btn-remove"
                        onClick={() => {
                          const newSelected = { ...selectedStudents }
                          delete newSelected[address]
                          setSelectedStudents(newSelected)
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleMarkAttendance}
          className="btn-mark-attendance"
          disabled={loading || !selectedClass || !selectedSection || Object.keys(selectedStudents).length === 0}
        >
          {loading ? 'Marking Attendance...' : 'Mark Attendance'}
        </button>
      </div>
    </div>
  )
}

export default TeacherDashboard
