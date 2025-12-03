const dotenv = require('dotenv');
dotenv.config();

async function testAPI() {
  try {
    // Test schools API
    console.log('Testing schools API...');
    const schoolsRes = await fetch('http://localhost:3000/api/schools');
    const schools = await schoolsRes.json();
    console.log('Schools:', schools);

    if (schools.length > 0) {
      const schoolId = schools[0].id;
      console.log(`Using school ID: ${schoolId}`);

      // Test classes API
      console.log('\nTesting classes API...');
      const classesRes = await fetch(`http://localhost:3000/api/classes?schoolId=${schoolId}`);
      const classes = await classesRes.json();
      console.log('Classes:', classes);

      // Test students API
      console.log('\nTesting students API...');
      const studentsRes = await fetch(`http://localhost:3000/api/students?schoolId=${schoolId}`);
      const students = await studentsRes.json();
      console.log('Students count:', students.length);

      // Test attendance API
      console.log('\nTesting attendance API...');
      const attendanceRes = await fetch(`http://localhost:3000/api/attendance?schoolId=${schoolId}`);
      const attendance = await attendanceRes.json();
      console.log('Attendance records count:', attendance.length);
    }
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testAPI();