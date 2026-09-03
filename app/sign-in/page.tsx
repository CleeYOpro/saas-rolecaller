"use client";

import { useState, useEffect } from "react";
import AdminDashboard from "../admin";
import { ShinyButton } from "@/components/ui/shiny-button";
import { useRouter } from 'next/navigation';

// ──────────────────────────────────────────────────────────────
// Types (same as before)
export type AttendanceStatus = "present" | "absent" | "late";
export type Student = { id: string; name: string; standard?: string; classId?: string; schoolId: string };
export type School = { id: string; name: string; email: string };
export type Class = { id: string; name: string; schoolId: string };
export type ClassAssignments = Record<string, string[]>; // classId -> [studentId]
export type AttendanceMap = Record<
    string, // classId
    Record<string, Record<string, AttendanceStatus>> // date -> studentId -> status
>;
// ──────────────────────────────────────────────────────────────

export default function LoginPage() {
    // Force admin flow from the start
    const [loginType, setLoginType] = useState<"admin" | "director">("admin");
    const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
    const [schoolEmail, setSchoolEmail] = useState("");
    const [schoolPassword, setSchoolPassword] = useState("");

    // Director state
    const [directorUsername, setDirectorUsername] = useState("");
    const [directorPassword, setDirectorPassword] = useState("");
    const [showDirectorPassword, setShowDirectorPassword] = useState(false); // State to toggle password visibility

    const [isAuthed, setIsAuthed] = useState(false);
    const [error, setError] = useState("");
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const [schools, setSchools] = useState<School[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [assignments, setAssignments] = useState<ClassAssignments>({});
    const [attendance, setAttendance] = useState<AttendanceMap>({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Fetch schools on mount
    useEffect(() => {
        async function fetchSchools() {
            try {
                const res = await fetch("/api/schools");
                const data = await res.json();
                if (Array.isArray(data)) setSchools(data);
                else setSchools([]);
            } catch (err) {
                console.error("Failed to fetch schools:", err);
                setSchools([]);
            }
        }
        fetchSchools();
    }, []);

    // Fetch school data when authenticated
    useEffect(() => {
        if (!isAuthed || !selectedSchool) return;

        async function fetchSchoolData() {
            try {
                setLoading(true);

                // Add null check for selectedSchool
                if (!selectedSchool) return;

                const [classesRes, studentsRes, attendanceRes] = await Promise.all([
                    fetch(`/api/classes?schoolId=${selectedSchool.id}`),
                    fetch(`/api/students?schoolId=${selectedSchool.id}`),
                    fetch(`/api/attendance?schoolId=${selectedSchool.id}`),
                ]);

                const [classesJson, studentsJson, attendanceData] = await Promise.all([
                    classesRes.json(),
                    studentsRes.json(),
                    attendanceRes.json(),
                ]);

                const classesData: Class[] = classesRes.ok && Array.isArray(classesJson) ? classesJson : [];
                const studentsData: Student[] = studentsRes.ok && Array.isArray(studentsJson) ? studentsJson : [];

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

                // Check if attendanceData is actually an array before using forEach
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
                setToastMessage("Failed to load school data");
            } finally {
                setLoading(false);
            }
        }

        fetchSchoolData();
    }, [isAuthed, selectedSchool]);

    // Toast auto-dismiss
    useEffect(() => {
        if (toastMessage) {
            const t = setTimeout(() => setToastMessage(null), 3000);
            return () => clearTimeout(t);
        }
    }, [toastMessage]);

    const goBack = () => {
        setSelectedSchool(null);
        setSchoolEmail("");
        setSchoolPassword("");
        setError("");
        setIsAuthed(false);
    };

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSchool) return setError("Please select a school");

        try {
            const res = await fetch("/api/auth/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    schoolId: selectedSchool.id,
                    email: schoolEmail,
                    password: schoolPassword,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setIsAuthed(true);
                setError("");
                setToastMessage("Admin login successful");
            } else {
                setError(data.error || "Invalid credentials");
                setToastMessage("Login failed");
            }
        } catch (err) {
            setError("Login failed");
            setToastMessage("Login failed");
        }
    };

    const handleDirectorLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/auth/director", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: directorUsername,
                    password: directorPassword,
                }),
            });

            const data = await res.json();

            if (data.success) {
                // Redirect directly to director dashboard
                router.push('/director');
            } else {
                setError(data.error || "Invalid credentials");
                setToastMessage("Login failed");
            }
        } catch (err) {
            setError("Login failed");
            setToastMessage("Login failed");
        }
    };

    // ────────────────────── Admin Dashboard ──────────────────────
    if (isAuthed && selectedSchool) {
        if (loading) {
            return (
                <div className="min-h-screen bg-[#121212] flex items-center justify-center">
                    <div className="text-white text-xl">Loading...</div>
                </div>
            );
        }

        return (
            <AdminDashboard
                goBack={goBack}
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
        );
    }

    // ────────────────────── Admin Login Screen (direct) ──────────────────────
    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4 sm:p-6">
            {/* Toast */}
            {toastMessage && (
                <div
                    className="fixed top-4 right-4 bg-gradient-to-r from-[#3A86FF] to-[#4361EE] text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in font-semibold"
                    role="alert"
                    aria-live="polite"
                >
                    {toastMessage}
                </div>
            )}

            <div className="w-11/12 max-w-md mx-auto bg-[#1C1C1E] rounded-xl p-8 flex flex-col gap-8 shadow-lg">
                {/* Welcome headline */}
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">
                        Hi, welcome to <span className="text-[#3A86FF]">rolecaller!</span>
                    </h1>
                </div>

                <div className="flex bg-[#121212] p-1 rounded-lg">
                    <button
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${loginType === "admin" ? "bg-[#3A86FF] text-white" : "text-[#888] hover:text-white"}`}
                        onClick={() => { setLoginType("admin"); setError(""); }}
                    >
                        School Admin
                    </button>
                    <button
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${loginType === "director" ? "bg-[#3A86FF] text-white" : "text-[#888] hover:text-white"}`}
                        onClick={() => { setLoginType("director"); setError(""); }}
                    >
                        Director
                    </button>
                </div>

                {schools.length === 0 && loginType === "admin" ? (
                    <>
                        <div className="p-4 bg-[#451A1A] border border-[#D32F2F] rounded-lg text-sm">
                            <p className="text-[#ff4d4f] font-semibold mb-2">No schools found</p>
                            <p className="text-[#EAEAEA]">
                                Create a school first via <code className="bg-[#121212] px-2 py-1 rounded">POST /api/schools</code>
                            </p>
                        </div>
                        <ShinyButton onClick={() => router.push('/')} variant="secondary" className="w-full" >
                            Back
                        </ShinyButton>
                    </>
                ) : loginType === "admin" ? (
                    <form onSubmit={handleAdminLogin} className="flex flex-col gap-5">
                        <select
                            value={selectedSchool?.id || ""}
                            onChange={(e) => {
                                const school = schools.find((s) => s.id === e.target.value);
                                setSelectedSchool(school || null);
                                if (school) setSchoolEmail(school.email);
                            }}
                            className="w-full px-4 py-3 rounded-xl bg-[#121212] text-white border border-[#333] focus:border-[#3A86FF] focus:outline-none"
                            required
                        >
                            <option value="">Select a school</option>
                            {schools.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="email"
                            value={schoolEmail}
                            onChange={(e) => setSchoolEmail(e.target.value)}
                            placeholder="School email"
                            className="w-full px-4 py-3 rounded-xl bg-[#121212] text-white border border-[#333] focus:border-[#3A86FF] focus:outline-none placeholder-[#888]"
                            required
                        />

                        <input
                            type="password"
                            value={schoolPassword}
                            onChange={(e) => setSchoolPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full px-4 py-3 rounded-xl bg-[#121212] text-white border border-[#333] focus:border-[#3A86FF] focus:outline-none placeholder-[#888]"
                            required
                        />

                        {error && (
                            <p className="text-[#ff4d4f] bg-[#451A1A] px-3 py-2 rounded-lg text-sm" role="alert">
                                {error}
                            </p>
                        )}

                        <div>
                            <ShinyButton className="w-full py-3 text-lg">
                                Login as Admin
                            </ShinyButton>
                        </div>

                        <div onClick={goBack}>
                            <ShinyButton onClick={() => router.push('/')} variant="secondary" className="w-full" >
                                Back
                            </ShinyButton>
                        </div>
                    </form>
                    ) : (
                        <form onSubmit={handleDirectorLogin} className="flex flex-col gap-5">
                            <input
                                type="text"
                                value={directorUsername}
                                onChange={(e) => setDirectorUsername(e.target.value)}
                                placeholder="Director Username"
                                className="w-full px-4 py-3 rounded-xl bg-[#121212] text-white border border-[#333] focus:border-[#3A86FF] focus:outline-none placeholder-[#888]"
                                required
                            />

                                <div className="relative">
                                    <input
                                        type={showDirectorPassword ? "text" : "password"}
                                        value={directorPassword}
                                        onChange={(e) => setDirectorPassword(e.target.value)}
                                        placeholder="Password"
                                        className="w-full px-4 py-3 rounded-xl bg-[#121212] text-white border border-[#333] focus:border-[#3A86FF] focus:outline-none placeholder-[#888]"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowDirectorPassword(!showDirectorPassword)}
                                        aria-label={showDirectorPassword ? "Hide password" : "Show password"}
                                    >
                                        {showDirectorPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer">
                                                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                                                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                                                <path d="M6.61 6.61A13.5 13.5 0 0 0 2 12s3 7 10 7a13.5 13.5 0 0 0 6.61-2.39"></path>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a10 10 0 0 1 3.34-4.66"></path>
                                                <path d="M12 12v.01"></path>
                                                <path d="M17 17l1.5-1.5"></path>
                                            </svg>
                                        )}
                                    </button>
                                </div>

                            {error && (
                                <p className="text-[#ff4d4f] bg-[#451A1A] px-3 py-2 rounded-lg text-sm" role="alert">
                                    {error}
                                </p>
                            )}

                            <div>
                                <ShinyButton className="w-full py-3 text-lg">
                                    Login as Director
                                </ShinyButton>
                            </div>

                            <div>
                                <ShinyButton onClick={() => router.push('/')} variant="secondary" className="w-full" >
                                    Back
                                </ShinyButton>
                            </div>
                        </form>
                )}
            </div>

            {/* Toast animation */}
            <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
        </div>
    );
}