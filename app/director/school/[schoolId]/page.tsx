"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "../../../admin";

export type AttendanceStatus = "present" | "absent" | "late";
export type Student = { id: string; name: string; standard?: string; classId?: string; schoolId: string };
export type School = { id: string; name: string; email: string };
export type Class = { id: string; name: string; schoolId: string };
export type ClassAssignments = Record<string, string[]>;
export type AttendanceMap = Record<
  string,
  Record<string, Record<string, AttendanceStatus>>
>;

export default function DirectorSchoolView({ params }: { params: Promise<{ schoolId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const schoolId = resolvedParams.schoolId;

  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<ClassAssignments>({});
  const [attendance, setAttendance] = useState<AttendanceMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSchoolData() {
      try {
        setLoading(true);

        // Fetch to see if this school belongs to this director (we can piggyback on classes API which has the RBAC check)
        const classesRes = await fetch(`/api/classes?schoolId=${schoolId}`);
        
        if (classesRes.status === 403 || classesRes.status === 401) {
          setError("Unauthorized: You do not have access to this school.");
          setLoading(false);
          return;
        }

        // Fetch actual school details
        const schoolsRes = await fetch('/api/schools');
        const allSchools = await schoolsRes.json();
        const schoolObj = allSchools.find((s: School) => s.id === schoolId);

        if (!schoolObj) {
            setError("School not found");
            setLoading(false);
            return;
        }

        setSelectedSchool(schoolObj);

        const studentsRes = await fetch(`/api/students?schoolId=${schoolId}`);
        const attendanceRes = await fetch(`/api/attendance?schoolId=${schoolId}`);

        const classesData = await classesRes.json();
        const studentsData = await studentsRes.json();
        const attendanceData = await attendanceRes.json();

        setClasses(classesData);
        setStudents(studentsData);

        // Build assignments map
        const assignmentsMap: ClassAssignments = {};
        studentsData.forEach((s: Student) => {
          if (s.classId) {
            assignmentsMap[s.classId] = assignmentsMap[s.classId] || [];
            assignmentsMap[s.classId].push(s.id);
          }
        });
        setAssignments(assignmentsMap);

        // Build attendance map
        const attendanceMap: AttendanceMap = {};
        if (Array.isArray(attendanceData)) {
          attendanceData.forEach((r: any) => {
            if (!r.classId) return;
            attendanceMap[r.classId] = attendanceMap[r.classId] || {};
            attendanceMap[r.classId][r.date] = attendanceMap[r.classId][r.date] || {};
            attendanceMap[r.classId][r.date][r.studentId] = r.status;
          });
        }
        setAttendance(attendanceMap);
      } catch (err) {
        console.error("Failed to load school data:", err);
        setError("Failed to load school data.");
      } finally {
        setLoading(false);
      }
    }

    fetchSchoolData();
  }, [schoolId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white text-xl font-medium animate-pulse">Loading School Data...</div>
      </div>
    );
  }

  if (error || !selectedSchool) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-8">
        <div className="bg-[#1C1C1E] p-8 rounded-2xl border border-red-500/20 max-w-md w-full text-center">
          <p className="text-red-400 font-medium text-lg mb-4">{error}</p>
          <button
            onClick={() => router.push("/director")}
            className="px-6 py-2 bg-[#3A86FF] hover:bg-[#2A76EF] transition-colors rounded-lg text-white font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center border-b border-[#333]">
            <div className="text-sm font-medium text-[#888]">
              Director View <span className="mx-2">/</span> {selectedSchool.name}
            </div>
            <button
              onClick={() => router.push("/director")}
              className="text-sm font-medium text-[#3A86FF] hover:text-[#5C9DFF] transition-colors"
            >
              ← Back to Dashboard
            </button>
        </div>
        <AdminDashboard
            goBack={() => router.push("/director")}
            school={selectedSchool}
            classes={classes}
            setClasses={setClasses}
            students={students}
            setStudents={setStudents}
            assignments={assignments}
            setAssignments={setAssignments}
            attendance={attendance}
            setAttendance={setAttendance}
        />
    </div>
  );
}
