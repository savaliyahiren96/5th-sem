import { StudentRecord, AssessmentSchemeConfig } from '../types';

export const DEFAULT_ASSESSMENT_SCHEME: AssessmentSchemeConfig = {
  midsemMaxRaw: 60,
  midsemWeight: 20,
  otherComponentsWeight: 20,
  otherComponents: {
    assignments: 5,
    weeklyTests: 5,
    clinicalLogbook: 5,
    attendance: 5,
  },
  totalMax: 40,
};

// Formula to calculate internal marks:
// Midsem contribution = (Obtained marks / 60) * 20
// Other components = Assignments + Weekly Tests + Clinical Logbook + Attendance = 20
// Final Internal Marks = Midsem contribution + Other components (Max = 40)
export function calculateInternalScore(
  midsemRaw: number,
  assignments: number,
  weeklyTests: number,
  logbook: number,
  attendance: number,
  scheme: AssessmentSchemeConfig = DEFAULT_ASSESSMENT_SCHEME
): { midsemConverted: number; totalInternal: number } {
  const midsemConverted = Number(((midsemRaw / scheme.midsemMaxRaw) * scheme.midsemWeight).toFixed(2));
  const otherSum = assignments + weeklyTests + logbook + attendance;
  const totalInternal = Number((midsemConverted + otherSum).toFixed(2));
  return { midsemConverted, totalInternal };
}

const FIRST_NAMES = [
  'Aarav', 'Ananya', 'Rohan', 'Priya', 'Aditya', 'Sneha', 'Vivek', 'Pooja', 'Rahul', 'Diya',
  'Ishaan', 'Tanvi', 'Manish', 'Kavya', 'Siddharth', 'Bhavna', 'Dhruv', 'Riya', 'Kunal', 'Meera',
  'Arjun', 'Simran', 'Varun', 'Nisha', 'Gaurav', 'Shreya', 'Chirag', 'Khushi', 'Harsh', 'Isha',
  'Pranav', 'Kruti', 'Parth', 'Jhanvi', 'Jay', 'Vidhi', 'Nirav', 'Ruchi', 'Dev', 'Avani',
  'Smit', 'Swati', 'Karan', 'Drashti', 'Akash', 'Shruti', 'Hiren', 'Kinjal', 'Meet', 'Payal',
];

const LAST_NAMES = [
  'Patel', 'Shah', 'Sharma', 'Joshi', 'Mehta', 'Panchal', 'Desai', 'Trivedi', 'Dave', 'Pandya',
  'Chauhan', 'Rathod', 'Solanki', 'Vaghela', 'Parmar', 'Gohil', 'Zala', 'Makwana', 'Barot', 'Raval',
];

const WARDS = [
  'Neuro Rehabilitation Ward',
  'Orthopaedic Trauma & Post-Op Ward',
  'Surgery & ICU Clinical Unit',
  'Outpatient Musculoskeletal Rehab (OPD)',
  'Paediatric & Child Physiotherapy Unit',
  'Cardio-Respiratory & Step-Down ICU',
];

export function generateInitialStudents(count: number = 102): StudentRecord[] {
  const students: StudentRecord[] = [];

  for (let i = 1; i <= count; i++) {
    const rollNo = `PU-BPT24-${String(i).padStart(3, '0')}`;
    const firstName = FIRST_NAMES[(i - 1) % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i - 1 + Math.floor(i / 10)) % LAST_NAMES.length];
    const fullName = `${firstName} ${lastName}`;
    const gender: 'Male' | 'Female' = i % 2 === 0 ? 'Female' : 'Male';
    const postingWard = WARDS[(i - 1) % WARDS.length];

    // Seeded variations
    const seed = (i * 17) % 100;
    const attendancePercent = Math.min(98, Math.max(68, 80 + (seed % 19) - 3));
    const midsemRaw = Math.min(58, Math.max(28, Math.round(36 + (seed % 23))));
    const weeklyTestAvg = Number((12 + (seed % 8)).toFixed(1)); // out of 20

    const assignments = Number(Math.min(5, Math.max(3.2, 4.0 + ((seed % 10) / 10) - 0.3)).toFixed(1));
    const tests = Number(Math.min(5, Math.max(2.8, (weeklyTestAvg / 20) * 5)).toFixed(1));
    const clinicalLogbook = Number(Math.min(5, Math.max(3.0, 4.2 + ((seed % 8) / 10) - 0.2)).toFixed(1));
    const attendanceMarks = Number(Math.min(5, Math.max(3.0, (attendancePercent / 100) * 5)).toFixed(1));

    const { midsemConverted, totalInternal } = calculateInternalScore(
      midsemRaw,
      assignments,
      tests,
      clinicalLogbook,
      attendanceMarks
    );

    students.push({
      id: `stud-${i}`,
      rollNo,
      name: fullName,
      gender,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@piptr.paruluniversity.ac.in`,
      postingWard,
      attendancePercent,
      weeklyTestAvg,
      midsemRaw,
      midsemConverted,
      otherAssessmentMarks: {
        assignments,
        tests,
        clinicalLogbook,
        attendance: attendanceMarks,
      },
      totalInternal,
      practicalScore: Math.min(48, Math.max(26, Math.round(32 + (seed % 17)))),
      clinicalLogbookEntriesCount: Math.min(24, Math.max(8, 14 + (seed % 11))),
    });
  }

  return students;
}

export const INITIAL_STUDENTS: StudentRecord[] = generateInitialStudents(102);
