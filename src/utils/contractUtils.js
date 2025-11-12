import { ethers } from 'ethers'

/**
 * Fetch all registered students from contract events
 */
export const fetchAllStudents = async (contract, provider) => {
  try {
    if (!contract) {
      return []
    }

    const contractAddress = contract.target || contract.address
    if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
      return []
    }

    const filter = contract.filters.StudentRegistered()
    const events = await contract.queryFilter(filter)
    
    const students = await Promise.all(
      events.map(async (event) => {
        try {
          const studentInfo = await contract.getStudentInfo(event.args.studentAddress)
          return {
            address: event.args.studentAddress,
            name: studentInfo.name,
            studentId: studentInfo.studentId,
            email: `${studentInfo.studentId.toLowerCase()}@university.edu`,
            role: 'Student',
            totalClasses: studentInfo.totalClasses.toString(),
            attendedClasses: studentInfo.attendedClasses.toString(),
            isRegistered: studentInfo.isRegistered
          }
        } catch (err) {
          console.error('Error fetching student info:', err)
          return null
        }
      })
    )

    return students.filter(s => s !== null && s.isRegistered)
  } catch (error) {
    console.error('Error fetching students:', error)
    return []
  }
}

/**
 * Fetch all registered teachers from contract events
 */
export const fetchAllTeachers = async (contract, provider) => {
  try {
    if (!contract) {
      return []
    }

    const contractAddress = contract.target || contract.address
    if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
      return []
    }

    const filter = contract.filters.TeacherRegistered()
    const events = await contract.queryFilter(filter)
    
    const teachers = await Promise.all(
      events.map(async (event) => {
        try {
          const isTeacher = await contract.isTeacher(event.args.teacherAddress)
          if (!isTeacher) return null

          // Try to get name from event args
          const name = event.args.name || 'Unknown Teacher'
          const emailName = name.toLowerCase().replace(/\s+/g, '.')
          
          return {
            address: event.args.teacherAddress,
            name: name,
            email: `${emailName}@university.edu`,
            role: 'Teacher',
            isRegistered: isTeacher
          }
        } catch (err) {
          console.error('Error fetching teacher info:', err)
          return null
        }
      })
    )

    return teachers.filter(t => t !== null && t.isRegistered)
  } catch (error) {
    console.error('Error fetching teachers:', error)
    return []
  }
}

/**
 * Fetch all users (students + teachers) from contract
 */
export const fetchAllUsers = async (contract, provider) => {
  try {
    const [students, teachers] = await Promise.all([
      fetchAllStudents(contract, provider),
      fetchAllTeachers(contract, provider)
    ])
    return [...students, ...teachers]
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

export const fetchClassesWithSections = async (contract) => {
  try {
    if (!contract) {
      return []
    }

    const classes = await contract.getClasses()
    const formatted = []

    for (const classInfo of classes) {
      try {
        const sections = await contract.getSections(classInfo.id)
        formatted.push({
          id: classInfo.id,
          name: classInfo.name,
          sections: sections.map(section => ({
            id: section.id,
            name: section.name,
            studentCount: Number(section.studentCount ?? 0)
          }))
        })
      } catch (sectionError) {
        console.error('Error fetching sections for class:', classInfo.id, sectionError)
        formatted.push({
          id: classInfo.id,
          name: classInfo.name,
          sections: []
        })
      }
    }

    return formatted
  } catch (error) {
    console.error('Error fetching classes:', error)
    return []
  }
}

export const fetchSectionStudents = async (contract, classId, sectionId) => {
  try {
    if (!contract || !classId || !sectionId) {
      return []
    }

    const students = await contract.getSectionStudents(classId, sectionId)

    return students
      .filter(student => student && student.isRegistered)
      .map(student => ({
        address: student.studentAddress,
        name: student.name,
        studentId: student.studentId,
        totalClasses: Number(student.totalClasses ?? 0),
        attendedClasses: Number(student.attendedClasses ?? 0)
      }))
  } catch (error) {
    console.error('Error fetching section students:', error)
    return []
  }
}

/**
 * Check if contract is deployed
 */
export const isContractDeployed = (contractAddress) => {
  return contractAddress && 
         contractAddress !== '0x0000000000000000000000000000000000000000' &&
         contractAddress.startsWith('0x')
}

/**
 * Format error message for display
 */
export const formatError = (error) => {
  if (typeof error === 'string') {
    return error
  }
  
  if (error.message) {
    // Handle common MetaMask errors
    if (error.message.includes('user rejected')) {
      return 'Transaction was rejected. Please try again.'
    }
    if (error.message.includes('insufficient funds')) {
      return 'Insufficient funds for gas. Please add more ETH to your wallet.'
    }
    if (error.message.includes('nonce')) {
      return 'Transaction error. Please try again.'
    }
    if (error.message.includes('revert')) {
      // Try to extract reason from error
      const reasonMatch = error.message.match(/reason="([^"]+)"/)
      if (reasonMatch) {
        return reasonMatch[1]
      }
      return 'Transaction failed. Please check your inputs and try again.'
    }
    return error.message
  }
  
  return 'An unexpected error occurred. Please try again.'
}

