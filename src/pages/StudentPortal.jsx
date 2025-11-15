import React, { useState, useEffect } from 'react'
import { useWeb3 } from '../context/Web3Context'
import { format } from 'date-fns'
import { isContractDeployed, formatError } from '../utils/contractUtils'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Loading from '../components/Loading'
import './StudentPortal.css'

const StudentPortal = () => {
  const { account, contract, isConnected, connectWallet, loading: web3Loading } = useWeb3()
  const [studentInfo, setStudentInfo] = useState(null)
  const [attendanceHistory, setAttendanceHistory] = useState([])
  const [attendancePercentage, setAttendancePercentage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState(null)
  const [subjectStats, setSubjectStats] = useState([])

  const COLORS = ['#3B82F6', '#2563EB', '#1D4ED8', '#60A5FA']

  useEffect(() => {
    if (isConnected && contract && account) {
      setInitialLoading(true)
      loadStudentData().finally(() => {
        setInitialLoading(false)
      })
    } else if (!isConnected) {
      setInitialLoading(false)
    }
  }, [isConnected, contract, account])

  const loadStudentData = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!contract) {
        setError('Contract is not available. Please connect your wallet and ensure the contract is deployed.')
        setLoading(false)
        return
      }

      const contractAddress = contract.target || contract.address
      if (!isContractDeployed(contractAddress)) {
        setError('Contract is not deployed. Please deploy the contract first.')
        setLoading(false)
        return
      }

      // Check if user is a registered student
      const isStudent = await contract.isStudent(account)
      if (!isStudent) {
        setError('')
        setLoading(false)
        return
      }

      // Get student info
      const student = await contract.getStudentInfo(account)
      setStudentInfo({
        address: student.studentAddress,
        name: student.name,
        studentId: student.studentId,
        totalClasses: student.totalClasses.toString(),
        attendedClasses: student.attendedClasses.toString()
      })

      // Get attendance percentage
      const percentage = await contract.getAttendancePercentage(account)
      setAttendancePercentage(Number(percentage))

      // Get attendance history
      const history = await contract.getAttendanceHistory(account)
      const formattedHistory = history.map(record => ({
        timestamp: Number(record.timestamp) * 1000,
        date: format(new Date(Number(record.timestamp) * 1000), 'yyyy-MM-dd HH:mm'),
        isPresent: record.isPresent,
        subject: record.subject,
        markedBy: record.markedBy
      }))
      setAttendanceHistory(formattedHistory.reverse())

      // Calculate subject statistics
      const subjects = [...new Set(formattedHistory.map(r => r.subject))].filter(Boolean)
      const stats = await Promise.all(subjects.map(async (subject) => {
        const presentCount = await contract.getSubjectAttendance(account, subject)
        const totalClassesForSubject = formattedHistory.filter(r => r.subject === subject).length
        const present = Number(presentCount)
        const total = totalClassesForSubject
        const absent = Math.max(total - present, 0)
        const percentage = total > 0 ? Math.round((present / total) * 100) : 0
        return {
          subject,
          present,
          total,
          absent,
          percentage
        }
      }))
      setSubjectStats(stats)

    } catch (err) {
      setError(formatError(err))
      console.error('Error loading student data:', err)
    } finally {
      setLoading(false)
    }
  }

  const attendanceChartData = [
    { name: 'Present', value: studentInfo ? Number(studentInfo.attendedClasses) : 0 },
    { name: 'Absent', value: studentInfo ? Number(studentInfo.totalClasses) - Number(studentInfo.attendedClasses) : 0 }
  ]

  const subjectChartData = subjectStats.map((stat) => ({
    subject: stat.subject,
    attendance: stat.present,
    total: stat.total
  }))

  if (!isConnected) {
    return (
      <div className="dashboard-container">
        <div className="wallet-connect-card">
          <div className="wallet-icon-large">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2>Connect Your Wallet</h2>
          <p>To view your secure attendance records, please connect your MetaMask wallet.</p>
          <button onClick={connectWallet} className="btn-connect-large" disabled={web3Loading}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {web3Loading ? 'Connecting...' : 'Connect MetaMask'}
          </button>
        </div>
      </div>
    )
  }

  if (initialLoading && isConnected) {
    return <Loading message="Please wait while loading your details..." />
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <Loading message="Loading your attendance data..." />
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="student-portal">
        <div className="dashboard-header">
          <h1>Student Portal</h1>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {!studentInfo && !loading && !error && (
          <div className="access-instructions-card">
            <div className="error-icon">📚</div>
            <h2>Student Registration Required</h2>
            <p className="error-message">
              Aap abhi registered student nahi hain. Apni attendance dekhne ke liye pehle registration karein.
            </p>
            <div className="instructions-box">
              <h3>Student Registration Kaise Hogi?</h3>
              <ol className="steps-list">
                <li>
                  <strong>Admin Se Contact Karein:</strong> Kisi admin se request karein ke wo aapko student register karein
                </li>
                <li>
                  <strong>Admin Dashboard:</strong> Admin ko Admin Dashboard par jana hoga
                </li>
                <li>
                  <strong>Register Student:</strong> Admin "Add User" button click karein aur "Student" select karein
                </li>
                <li>
                  <strong>Wallet Address:</strong> Apna MetaMask wallet address admin ko dein
                </li>
                <li>
                  <strong>Name & Student ID:</strong> Apna naam aur Student ID admin ko dein
                </li>
                <li>
                  <strong>Wait for Registration:</strong> Admin aapko register karne ke baad, aap apni attendance dekh sakte hain
                </li>
              </ol>
              <div className="help-text">
                <p><strong>Note:</strong> Registration ke baad aap yahan wapas aake apni attendance dekh sakte hain.</p>
              </div>
            </div>
          </div>
        )}

        {studentInfo && (
          <>
            <div className="student-info-card card">
              <h2>Student Information</h2>
              <div className="student-details">
                <p><strong>Name:</strong> {studentInfo.name}</p>
                <p><strong>Student ID:</strong> {studentInfo.studentId}</p>
                <p><strong>Wallet Address:</strong> {studentInfo.address}</p>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>{attendancePercentage}%</h3>
                <p>Attendance Percentage</p>
              </div>
              <div className="stat-card">
                <h3>{studentInfo.totalClasses}</h3>
                <p>Total Classes</p>
              </div>
              <div className="stat-card">
                <h3>{studentInfo.attendedClasses}</h3>
                <p>Classes Attended</p>
              </div>
              <div className="stat-card">
                <h3>{studentInfo.totalClasses - studentInfo.attendedClasses}</h3>
                <p>Classes Missed</p>
              </div>
            </div>

            <div className="charts-grid">
              <div className="card">
                <h3>Attendance Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={attendanceChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {attendanceChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {subjectChartData.length > 0 && (
                <div className="card">
                  <h3>Attendance by Subject</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={subjectChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis allowDecimals={false} />
                      <Tooltip formatter={(value, name) => {
                        if (name === 'attendance') {
                          return [`${value} classes present`, 'Present']
                        }
                        if (name === 'total') {
                          return [`${value} total classes`, 'Total']
                        }
                        return [value, name]
                      }} />
                      <Legend />
                      <Bar dataKey="attendance" name="Present" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="total" name="Total" fill="#dfe4ff" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {subjectStats.length > 0 && (
              <div className="card">
                <h3>Subject-wise Attendance Status</h3>
                <div className="subject-attendance-grid">
                  {subjectStats.map((stat) => (
                    <div key={stat.subject} className="subject-attendance-card">
                      <div className="subject-attendance-header">
                        <h4>{stat.subject}</h4>
                        <span className={`badge ${stat.percentage >= 75 ? 'badge-success' : stat.percentage >= 50 ? 'badge-warning' : 'badge-danger'}`}>
                          {stat.percentage}% attendance
                        </span>
                      </div>
                      <div className="subject-attendance-body">
                        <div className="subject-attendance-stat">
                          <span className="label">Present</span>
                          <span className="value">{stat.present}</span>
                        </div>
                        <div className="subject-attendance-stat">
                          <span className="label">Absent</span>
                          <span className="value">{stat.absent}</span>
                        </div>
                        <div className="subject-attendance-stat">
                          <span className="label">Total Classes</span>
                          <span className="value">{stat.total}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="card">
              <h3>Attendance History</h3>
              {attendanceHistory.length > 0 ? (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Subject</th>
                        <th>Status</th>
                        <th>Marked By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceHistory.map((record, index) => (
                        <tr key={index}>
                          <td>{record.date}</td>
                          <td>{record.subject}</td>
                          <td>
                            <span className={`badge ${record.isPresent ? 'badge-success' : 'badge-danger'}`}>
                              {record.isPresent ? 'Present' : 'Absent'}
                            </span>
                          </td>
                          <td>{record.markedBy.slice(0, 10)}...</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No attendance records found.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default StudentPortal

