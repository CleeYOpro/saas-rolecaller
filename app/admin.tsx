"use client";

import { useMemo, useState } from "react";
import type { School, Class, AttendanceMap, ClassAssignments, Student, AttendanceStatus } from "./sign-in/page";
import StudentSearchOverview from "./StudentSearchOverview";
import { ShinyButton } from "@/components/ui/shiny-button";
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function formatDateStr(date: Date): string {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
}

function DateNav({ date, onChange }: { date: Date; onChange: (date: Date) => void }) {
    const isToday = formatDateStr(date) === formatDateStr(new Date());

    const handlePrev = () => {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() - 1);
        onChange(nextDate);
    };

    const handleNext = () => {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        const today = new Date();
        if (nextDate.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0)) {
            onChange(nextDate);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={handlePrev}
                className="text-[#EAEAEA] hover:text-white transition-opacity"
                aria-label="Previous day"
            >
                <ArrowLeft size={20} strokeWidth={3} />
            </button>
            <span className="text-[#F1F1F1] font-medium min-w-[130px] text-center">
                {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <button
                onClick={handleNext}
                disabled={isToday}
                className={`transition-opacity ${isToday ? "text-[#EAEAEA]/30 cursor-not-allowed" : "text-[#EAEAEA] hover:text-white"}`}
                aria-label="Next day"
            >
                <ArrowRight size={20} strokeWidth={3} />
            </button>
        </div>
    );
}

type Granularity = 'week' | 'month';

// Key of the Monday that starts the week containing this date
function getWeekKey(dateStr: string): string {
    const d = new Date(`${dateStr}T00:00:00`);
    const day = d.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    d.setDate(d.getDate() + diff);
    return formatDateStr(d);
}

function getMonthKey(dateStr: string): string {
    return dateStr.slice(0, 7);
}

function formatWeekLabel(weekKey: string): string {
    const d = new Date(`${weekKey}T00:00:00`);
    return `Wk of ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

function formatMonthLabel(monthKey: string): string {
    const d = new Date(`${monthKey}-01T00:00:00`);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

const selectClassName = "px-4 py-1.5 rounded-lg text-sm font-semibold bg-[#121212] text-[#EAEAEA] border border-[#2D2D2D] focus:border-[#3A86FF] focus:outline-none";

function AttendanceTrendChart({
    attendance,
    classes,
    teacherClassId,
}: {
    attendance: AttendanceMap;
    classes: Class[];
    teacherClassId?: string;
}) {
    const [granularity, setGranularity] = useState<Granularity>('week');
    const [group, setGroup] = useState<'students' | 'teachers'>('students');
    const [classFilter, setClassFilter] = useState<string>('all');

    const studentClasses = useMemo(
        () => classes.filter((c) => c.id !== teacherClassId),
        [classes, teacherClassId]
    );

    const relevantClasses = useMemo(() => {
        if (group === 'teachers') {
            return teacherClassId ? classes.filter((c) => c.id === teacherClassId) : [];
        }
        return classFilter === 'all' ? studentClasses : studentClasses.filter((c) => c.id === classFilter);
    }, [group, classFilter, studentClasses, classes, teacherClassId]);

    const trendData = useMemo(() => {
        const buckets: Record<string, { present: number; absent: number }> = {};

        relevantClasses.forEach((cls) => {
            const dates = attendance[cls.id] ?? {};
            Object.entries(dates).forEach(([date, studentMap]) => {
                const key = granularity === 'week' ? getWeekKey(date) : getMonthKey(date);
                if (!buckets[key]) buckets[key] = { present: 0, absent: 0 };
                Object.values(studentMap).forEach((status) => {
                    if (status === 'present' || status === 'late') buckets[key].present += 1;
                    else if (status === 'absent') buckets[key].absent += 1;
                });
            });
        });

        return Object.entries(buckets)
            .map(([key, v]) => {
                const total = v.present + v.absent;
                const presentPct = total > 0 ? Math.round((v.present / total) * 100) : 0;
                return {
                    key,
                    label: granularity === 'week' ? formatWeekLabel(key) : formatMonthLabel(key),
                    presentPct,
                    absentPct: total > 0 ? 100 - presentPct : 0,
                };
            })
            .sort((a, b) => a.key.localeCompare(b.key))
            .slice(-12);
    }, [attendance, relevantClasses, granularity]);

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                <div className="flex flex-wrap gap-3">
                    <select
                        value={group}
                        onChange={(e) => setGroup(e.target.value as 'students' | 'teachers')}
                        className={selectClassName}
                    >
                        <option value="students">Students</option>
                        <option value="teachers" disabled={!teacherClassId}>Teachers</option>
                    </select>

                    {group === 'students' && (
                        <select
                            value={classFilter}
                            onChange={(e) => setClassFilter(e.target.value)}
                            className={selectClassName}
                        >
                            <option value="all">All Students</option>
                            {studentClasses.map((cls) => (
                                <option key={cls.id} value={cls.id}>{cls.name}</option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setGranularity('week')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors duration-200 ${granularity === 'week' ? 'bg-[#3A86FF] text-white' : 'bg-[#121212] text-[#EAEAEA] border border-[#2D2D2D]'}`}
                    >
                        Weekly
                    </button>
                    <button
                        onClick={() => setGranularity('month')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors duration-200 ${granularity === 'month' ? 'bg-[#3A86FF] text-white' : 'bg-[#121212] text-[#EAEAEA] border border-[#2D2D2D]'}`}
                    >
                        Monthly
                    </button>
                </div>
            </div>

            {trendData.length === 0 ? (
                <div className="h-[280px] flex items-center justify-center text-[#888]">
                    No attendance data yet.
                </div>
            ) : (
                <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trendData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" vertical={false} />
                            <XAxis dataKey="label" stroke="#888" tick={{ fill: "#EAEAEA", fontSize: 12 }} />
                            <YAxis domain={[0, 100]} stroke="#888" tick={{ fill: "#EAEAEA", fontSize: 12 }} unit="%" />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const d = payload[0].payload;
                                        return (
                                            <div className="bg-[#1E1E1E] border border-[#333] rounded-lg px-3 py-2 text-sm shadow-xl">
                                                <div className="text-white font-semibold mb-1">{d.label}</div>
                                                <div className="text-[#4CAF50]">Present: {d.presentPct}%</div>
                                                <div className="text-[#D32F2F]">Absent: {d.absentPct}%</div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                            />
                            <Bar dataKey="presentPct" stackId="a" fill="#4CAF50" name="Present" />
                            <Bar dataKey="absentPct" stackId="a" fill="#D32F2F" name="Absent" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

interface AdminProps {
    goBack: () => void;
    school: School;
    classes: Class[];
    setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
    students: Student[];
    setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
    assignments: ClassAssignments;
    setAssignments: React.Dispatch<React.SetStateAction<ClassAssignments>>;
    attendance: AttendanceMap;
    setAttendance: React.Dispatch<React.SetStateAction<AttendanceMap>>;
}

export default function AdminDashboard({
    goBack,
    school,
    classes,
    setClasses,
    students,
    setStudents,
    assignments,
    setAssignments,
    attendance,
    setAttendance,
}: AdminProps) {
    const [activeTab, setActiveTab] = useState<'view' | 'manage'>('view');
    const [manageSubTab, setManageSubTab] = useState<'classes' | 'students'>('classes');
    const router = useRouter();

    // Date navigation for the daily summary and teachers attendance cards
    const [summaryDate, setSummaryDate] = useState(new Date());
    const [teacherDate, setTeacherDate] = useState(new Date());
    const summaryDateStr = formatDateStr(summaryDate);
    const teacherDateStr = formatDateStr(teacherDate);
    const isSummaryToday = summaryDateStr === formatDateStr(new Date());
    const isTeacherToday = teacherDateStr === formatDateStr(new Date());

    // Daily attendance summary
    const dailyAttendanceSummary = useMemo(() => {
        const summary: Record<AttendanceStatus, number> = {
            present: 0,
            absent: 0,
            late: 0,
        };
        classes.forEach((cls) => {
            if (cls.name.trim().toUpperCase() === "TEACHERS ATTENDANCE") return;
            const map = attendance[cls.id]?.[summaryDateStr] ?? {};
            Object.values(map).forEach((status) => {
                if (status === "present" || status === "absent" || status === "late") {
                    summary[status] += 1;
                }
            });
        });
        return summary;
    }, [attendance, classes, summaryDateStr]);

    // Teachers attendance (reuses the class/student/attendance schema, with a class named "TEACHERS ATTENDANCE")
    const teacherClass = classes.find((c) => c.name.trim().toUpperCase() === "TEACHERS ATTENDANCE");
    const teacherStudents = useMemo(
        () => (teacherClass ? students.filter((s) => s.classId === teacherClass.id) : []),
        [students, teacherClass]
    );

    const teacherDayStatus = useMemo(() => {
        const map = teacherClass ? attendance[teacherClass.id]?.[teacherDateStr] ?? {} : {};
        return teacherStudents.map((t) => ({ name: t.name, status: map[t.id] ?? "unmarked" }));
    }, [attendance, teacherClass, teacherStudents, teacherDateStr]);

    const teacherAttendanceSummary = useMemo(() => {
        const summary: Record<AttendanceStatus, number> = { present: 0, absent: 0, late: 0 };
        teacherDayStatus.forEach(({ status }) => {
            if (status === "present" || status === "absent" || status === "late") {
                summary[status] += 1;
            }
        });
        return summary;
    }, [teacherDayStatus]);

    const [showTeacherCalendar, setShowTeacherCalendar] = useState(false);
    const [showStudentSearch, setShowStudentSearch] = useState(false);

    // Class management state
    const [newClassName, setNewClassName] = useState("");

    // Student management state
    const [studentName, setStudentName] = useState("");
    const [studentStandard, setStudentStandard] = useState("");
    const [studentClass, setStudentClass] = useState("");

    // CSV upload state
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState<string | null>(null);

    // Inline editing state
    const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<{
        name: string;
        standard: string;
        classId: string;
    }>({ name: "", standard: "", classId: "" });

    // Add class
    const addClass = async () => {
        const name = newClassName.trim();
        if (!name || classes.some(c => c.name === name)) return;

        try {
            const res = await fetch('/api/classes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, schoolId: school.id }),
            });

            if (res.ok) {
                const newClass = await res.json();
                setClasses((prev) => [...prev, newClass]);
                setNewClassName("");
            } else {
                const errorData = await res.json();
                alert(`Failed to add class: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error adding class:', error);
            alert(`Error adding class: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    // Delete class
    const deleteClass = async (classId: string) => {
        if (!confirm('Are you sure you want to delete this class?')) return;

        try {
            const res = await fetch(`/api/classes?id=${classId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setClasses((prev) => prev.filter((c) => c.id !== classId));
                setAssignments((prev) => {
                    const newAssignments = { ...prev };
                    delete newAssignments[classId];
                    return newAssignments;
                });
                setAttendance((prev) => {
                    const newAttendance = { ...prev };
                    delete newAttendance[classId];
                    return newAttendance;
                });
            }
        } catch (error) {
            console.error('Error deleting class:', error);
        }
    };

    // Add student
    const addStudent = async () => {
        const name = studentName.trim();
        const standard = studentStandard.trim();
        const className = studentClass.trim();

        if (!name) {
            alert("Student name is required");
            return;
        }

        // Generate a random ID (simple 6-digit number for now)
        let id = Math.floor(100000 + Math.random() * 900000).toString();
        // Ensure uniqueness locally (simple check)
        while (students.some((s) => s.id === id)) {
            id = Math.floor(100000 + Math.random() * 900000).toString();
        }

        try {
            const cls = classes.find(c => c.name === className);
            const classId = cls?.id || null;

            const res = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, name, standard, classId, schoolId: school.id }),
            });

            if (res.ok) {
                const newStudent = await res.json();
                setStudents((prev) => [...prev, newStudent]);
                if (classId) {
                    setAssignments((prev) => ({
                        ...prev,
                        [classId]: [...(prev[classId] ?? []), id],
                    }));
                }
                setStudentName("");
                setStudentStandard("");
                setStudentClass("");
            } else {
                const errorData = await res.json();
                alert(`Failed to add student: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error adding student:', error);
            alert(`Error adding student: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    // Delete student
    const deleteStudent = async (studentId: string) => {
        if (!confirm('Are you sure you want to delete this student?')) return;

        try {
            const res = await fetch(`/api/students?id=${studentId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setStudents((prev) => prev.filter((s) => s.id !== studentId));
                setAssignments((prev) => {
                    const newAssignments = { ...prev };
                    Object.keys(newAssignments).forEach((classId) => {
                        newAssignments[classId] = newAssignments[classId].filter((sid) => sid !== studentId);
                    });
                    return newAssignments;
                });
                setAttendance((prev) => {
                    const newAttendance = { ...prev };
                    Object.keys(newAttendance).forEach((classId) => {
                        Object.keys(newAttendance[classId] ?? {}).forEach((date) => {
                            if (newAttendance[classId][date][studentId]) {
                                delete newAttendance[classId][date][studentId];
                            }
                        });
                    });
                    return newAttendance;
                });
            }
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    // CSV Upload handler
    const handleCsvUpload = async () => {
        if (!csvFile) return;

        setUploading(true);
        setUploadMessage(null);

        try {
            const formData = new FormData();
            formData.append('file', csvFile);
            formData.append('schoolId', school.id);

            const res = await fetch('/api/students/csv', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setUploadMessage(`✅ Success! Created: ${data.results.created}, Updated: ${data.results.updated}, Classes Created: ${data.results.classesCreated}`);

                // Refresh students and classes
                const studentsRes = await fetch(`/api/students?schoolId=${school.id}`);
                const studentsData = await studentsRes.json();
                setStudents(studentsData);

                const classesRes = await fetch(`/api/classes?schoolId=${school.id}`);
                const classesData = await classesRes.json();
                setClasses(classesData);

                // Rebuild assignments
                const assignmentsMap: ClassAssignments = {};
                studentsData.forEach((student: Student) => {
                    if (student.classId) {
                        if (!assignmentsMap[student.classId]) {
                            assignmentsMap[student.classId] = [];
                        }
                        assignmentsMap[student.classId].push(student.id);
                    }
                });
                setAssignments(assignmentsMap);

                setCsvFile(null);
            } else {
                setUploadMessage(`❌ Error: ${data.error}${data.details ? ' - ' + data.details.join(', ') : ''}`);
            }
        } catch (error) {
            console.error('CSV upload error:', error);
            setUploadMessage('❌ Failed to upload CSV file');
        } finally {
            setUploading(false);
        }
    };

    // Start editing a student
    const startEdit = (student: Student) => {
        setEditingStudentId(student.id);
        setEditForm({
            name: student.name,
            standard: student.standard || "",
            classId: student.classId || "",
        });
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingStudentId(null);
        setEditForm({ name: "", standard: "", classId: "" });
    };

    // Save edited student
    const saveEdit = async (studentId: string) => {
        try {
            const res = await fetch('/api/students', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: studentId,
                    name: editForm.name,
                    standard: editForm.standard,
                    classId: editForm.classId || null,
                    schoolId: school.id,
                }),
            });

            if (res.ok) {
                const updatedStudent = await res.json();
                setStudents((prev) => prev.map((s) => s.id === studentId ? updatedStudent : s));

                // Update assignments
                setAssignments((prev) => {
                    const newAssignments = { ...prev };
                    // Remove from old class
                    Object.keys(newAssignments).forEach((classId) => {
                        newAssignments[classId] = newAssignments[classId].filter((sid) => sid !== studentId);
                    });
                    // Add to new class
                    if (editForm.classId) {
                        if (!newAssignments[editForm.classId]) {
                            newAssignments[editForm.classId] = [];
                        }
                        newAssignments[editForm.classId].push(studentId);
                    }
                    return newAssignments;
                });

                cancelEdit();
            } else {
                const errorData = await res.json();
                alert(`Failed to update student: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating student:', error);
            alert(`Error updating student: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    // Shared handler for updates made from either the student or teacher search/overview modal
    const handlePersonUpdate = (updatedPerson: Student) => {
        setStudents((prev) => prev.map((s) => s.id === updatedPerson.id ? updatedPerson : s));
        setAssignments((prev) => {
            const newAssignments = { ...prev };
            Object.keys(newAssignments).forEach((classId) => {
                newAssignments[classId] = newAssignments[classId].filter((sid) => sid !== updatedPerson.id);
            });
            if (updatedPerson.classId) {
                if (!newAssignments[updatedPerson.classId]) {
                    newAssignments[updatedPerson.classId] = [];
                }
                newAssignments[updatedPerson.classId].push(updatedPerson.id);
            }
            return newAssignments;
        });
    };

    return (
        <div className="min-h-screen bg-[#121212] p-6 md:p-12 font-sans text-[#EAEAEA]">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-[#F1F1F1] tracking-tight">
                            Admin Dashboard
                        </h1>
                        <p className="text-[#EAEAEA] mt-2 text-base">
                            {school.name} - Manage classes, students, and attendance
                        </p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-4 mb-8 border-b border-[#2D2D2D]">
                    <button
                        onClick={() => setActiveTab('view')}
                        className={`px-6 py-3 font-semibold text-lg transition-colors duration-200 ${activeTab === 'view'
                            ? 'text-[#3A86FF] border-b-2 border-[#3A86FF]'
                            : 'text-[#EAEAEA] hover:text-[#3A86FF]'
                            }`}
                    >
                        View Records
                    </button>
                    <button
                        onClick={() => setActiveTab('manage')}
                        className={`px-6 py-3 font-semibold text-lg transition-colors duration-200 ${activeTab === 'manage'
                            ? 'text-[#3A86FF] border-b-2 border-[#3A86FF]'
                            : 'text-[#EAEAEA] hover:text-[#3A86FF]'
                            }`}
                    >
                        Manage
                    </button>
                </div>

                {/* View Tab */}
                {activeTab === 'view' && (
                    <div className="space-y-8">
                        {/* Daily Summary */}
                        <div className="bg-[#1E1E1E] rounded-xl p-6 border border-[#2D2D2D]">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                                <h2 className="text-2xl font-bold text-[#F1F1F1]">
                                    {isSummaryToday ? "Today's Attendance Summary" : "Attendance Summary"}
                                </h2>
                                <DateNav date={summaryDate} onChange={setSummaryDate} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-[#121212] p-6 rounded-lg border border-[#2D2D2D]">
                                    <div className="text-[#4CAF50] text-4xl font-bold">{dailyAttendanceSummary.present}</div>
                                    <div className="text-[#EAEAEA] mt-2">Present</div>
                                </div>
                                <div className="bg-[#121212] p-6 rounded-lg border border-[#2D2D2D]">
                                    <div className="text-[#D32F2F] text-4xl font-bold">{dailyAttendanceSummary.absent}</div>
                                    <div className="text-[#EAEAEA] mt-2">Absent</div>
                                </div>
                            </div>

                            <ShinyButton onClick={() => setShowStudentSearch(true)} className="w-full py-2.5 mt-4">
                                View Student Attendance
                            </ShinyButton>
                        </div>

                        {/* Teachers Attendance */}
                        {teacherClass && (
                            <div className="bg-[#1E1E1E] rounded-xl p-6 border border-[#2D2D2D]">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                                    <h2 className="text-2xl font-bold text-[#F1F1F1]">
                                        {isTeacherToday ? "Today's Teachers Attendance" : "Teachers Attendance"}
                                    </h2>
                                    <DateNav date={teacherDate} onChange={setTeacherDate} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-[#121212] p-6 rounded-lg border border-[#2D2D2D]">
                                        <div className="text-[#4CAF50] text-4xl font-bold">{teacherAttendanceSummary.present}</div>
                                        <div className="text-[#EAEAEA] mt-2">Present</div>
                                    </div>
                                    <div className="bg-[#121212] p-6 rounded-lg border border-[#2D2D2D]">
                                        <div className="text-[#D32F2F] text-4xl font-bold">{teacherAttendanceSummary.absent}</div>
                                        <div className="text-[#EAEAEA] mt-2">Absent</div>
                                    </div>
                                </div>

                                <ShinyButton onClick={() => setShowTeacherCalendar(true)} className="w-full py-2.5">
                                    View Teacher Attendance
                                </ShinyButton>
                            </div>
                        )}

                        {/* Attendance Trends */}
                        <div className="bg-[#1E1E1E] rounded-xl p-6 border border-[#2D2D2D]">
                            <h2 className="text-2xl font-bold text-[#F1F1F1] mb-4">Attendance Trends</h2>
                            <AttendanceTrendChart
                                attendance={attendance}
                                classes={classes}
                                teacherClassId={teacherClass?.id}
                            />
                        </div>

                        {/* Excel Download */}
                        <div className="flex justify-end mt-4 mb-8">
                            <ShinyButton
                                onClick={async () => {
                                    try {
                                        const res = await fetch(`/api/attendance/export?schoolId=${school.id}`);
                                        if (!res.ok) throw new Error("Failed to generate report");
                                        const blob = await res.blob();
                                        const url = window.URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `Attendance_Report_${school.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;
                                        document.body.appendChild(a);
                                        a.click();
                                        window.URL.revokeObjectURL(url);
                                        document.body.removeChild(a);
                                    } catch (error) {
                                        console.error("Error downloading Excel:", error);
                                        alert("Failed to download Excel report");
                                    }
                                }}
                                variant="secondary"
                                className="px-6 py-2 font-semibold"
                            >
                                📊 Download Last 30 Days Attendance
                            </ShinyButton>
                        </div>

                    </div>
                )}

                {/* Manage Tab */}
                {activeTab === 'manage' && (
                    <div className="space-y-8">
                        {/* Sub-tab navigation */}
                        <div className="flex gap-4 mb-6">
                            <ShinyButton
                                onClick={() => setManageSubTab('classes')}
                                variant={manageSubTab === 'classes' ? undefined : 'secondary'}
                            >
                                Manage Classes
                            </ShinyButton>
                            <ShinyButton
                                onClick={() => setManageSubTab('students')}
                                variant={manageSubTab === 'students' ? undefined : 'secondary'}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${manageSubTab === 'students'
                                    ? 'bg-[#3A86FF] text-white'
                                    : ''
                                    }`}
                            >
                                Manage Students
                            </ShinyButton>
                        </div>

                        {/* Manage Classes */}
                        {manageSubTab === 'classes' && (
                            <div className="bg-[#1E1E1E] rounded-xl p-6 border border-[#2D2D2D]">
                                <h2 className="text-2xl font-bold text-[#F1F1F1] mb-6">Manage Classes</h2>

                                {/* Add Class Form */}
                                <div className="mb-8 p-4 bg-[#121212] rounded-lg border border-[#2D2D2D]">
                                    <h3 className="text-lg font-semibold text-[#F1F1F1] mb-4">Add New Class</h3>
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            value={newClassName}
                                            onChange={(e) => setNewClassName(e.target.value)}
                                            placeholder="Class name (e.g., Grade 5A)"
                                            className="flex-1 px-4 py-2 rounded-lg bg-[#1E1E1E] text-white border border-[#333] focus:border-[#3A86FF] focus:outline-none"
                                        />
                                        <ShinyButton
                                            onClick={addClass}
                                            variant="primary"
                                            className="px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                                        >
                                            Add Class
                                        </ShinyButton>
                                    </div>
                                </div>

                                {/* Classes List */}
                                <div className="space-y-3">
                                    {classes.map((cls) => (
                                        <div key={cls.id} className="flex items-center justify-between p-4 bg-[#121212] rounded-lg border border-[#2D2D2D]">
                                            <div>
                                                <div className="text-[#F1F1F1] font-semibold">{cls.name}</div>
                                                <div className="text-[#EAEAEA] text-sm">{assignments[cls.id]?.length || 0} students</div>
                                            </div>
                                            <ShinyButton
                                                onClick={() => deleteClass(cls.id)}
                                                variant="red"
                                                className="px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                                            >
                                                Delete
                                            </ShinyButton>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Manage Students */}
                        {manageSubTab === 'students' && (
                            <div className="bg-[#1E1E1E] rounded-xl p-6 border border-[#2D2D2D]">
                                <h2 className="text-2xl font-bold text-[#F1F1F1] mb-6">Manage Students</h2>

                                {/* CSV Upload Section */}
                                <div className="mb-8 p-4 bg-[#121212] rounded-lg border border-[#2D2D2D]">
                                    <h3 className="text-lg font-semibold text-[#F1F1F1] mb-4">Upload Students via CSV</h3>
                                    <p className="text-[#EAEAEA] text-sm mb-4">
                                        CSV must contain columns: <strong>name</strong>, <strong>number</strong> (5 digits), <strong>grade</strong>, <strong>class</strong>
                                    </p>
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                                            className="flex-1 px-4 py-2 rounded-lg bg-[#1E1E1E] text-white border border-[#333] focus:border-[#3A86FF] focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#3A86FF] file:text-white file:cursor-pointer hover:file:bg-[#4361EE]"
                                        />
                                        <ShinyButton
                                            onClick={handleCsvUpload}
                                            disabled={!csvFile || uploading}
                                            className="px-6 py-2 font-semibold disabled:opacity-50"
                                        >
                                            {uploading ? 'Uploading...' : 'Upload CSV'}
                                        </ShinyButton>
                                    </div>
                                    {uploadMessage && (
                                        <div className={`mt-4 p-3 rounded-lg ${uploadMessage.startsWith('✅') ? 'bg-[#1B5E20] text-[#4CAF50]' : 'bg-[#451A1A] text-[#ff4d4f]'}`}>
                                            {uploadMessage}
                                        </div>
                                    )}
                                </div>

                                {/* Add Student Form */}
                                <div className="mb-8 p-4 bg-[#121212] rounded-lg border border-[#2D2D2D]">
                                    <h3 className="text-lg font-semibold text-[#F1F1F1] mb-4">Add New Student</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <input
                                            type="text"
                                            value={studentName}
                                            onChange={(e) => setStudentName(e.target.value)}
                                            placeholder="Student name"
                                            className="px-4 py-2 rounded-lg bg-[#1E1E1E] text-white border border-[#333] focus:border-[#3A86FF] focus:outline-none"
                                        />
                                        <input
                                            type="text"
                                            value={studentStandard}
                                            onChange={(e) => setStudentStandard(e.target.value)}
                                            placeholder="Grade (optional)"
                                            className="px-4 py-2 rounded-lg bg-[#1E1E1E] text-white border border-[#333] focus:border-[#3A86FF] focus:outline-none"
                                        />
                                        <select
                                            value={studentClass}
                                            onChange={(e) => setStudentClass(e.target.value)}
                                            className="px-4 py-2 rounded-lg bg-[#1E1E1E] text-white border border-[#333] focus:border-[#3A86FF] focus:outline-none"
                                        >
                                            <option value="">Select class (optional)</option>
                                            {classes.map((cls) => (
                                                <option key={cls.id} value={cls.name}>{cls.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <ShinyButton
                                        onClick={addStudent}
                                        className="w-full px-6 py-2 font-semibold"
                                    >
                                        Add Student
                                    </ShinyButton>
                                </div>

                                {/* Editable Students Table */}
                                <div className="overflow-x-auto">
                                    <h3 className="text-lg font-semibold text-[#F1F1F1] mb-4">All Students ({students.length})</h3>
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-[#121212] border-b border-[#2D2D2D]">
                                                <th className="px-4 py-3 text-left text-[#F1F1F1] font-semibold">ID</th>
                                                <th className="px-4 py-3 text-left text-[#F1F1F1] font-semibold">Name</th>
                                                <th className="px-4 py-3 text-left text-[#F1F1F1] font-semibold">Grade</th>
                                                <th className="px-4 py-3 text-left text-[#F1F1F1] font-semibold">Class</th>
                                                <th className="px-4 py-3 text-left text-[#F1F1F1] font-semibold">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((student) => {
                                                const isEditing = editingStudentId === student.id;
                                                const studentClass = classes.find(c => c.id === student.classId);

                                                return (
                                                    <tr key={student.id} className="border-b border-[#2D2D2D] hover:bg-[#121212] transition-colors">
                                                        <td className="px-4 py-3 text-[#EAEAEA]">{student.id}</td>
                                                        <td className="px-4 py-3">
                                                            {isEditing ? (
                                                                <input
                                                                    type="text"
                                                                    value={editForm.name}
                                                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                                    className="w-full px-3 py-1 rounded bg-[#121212] text-white border border-[#3A86FF] focus:outline-none"
                                                                />
                                                            ) : (
                                                                <span className="text-[#F1F1F1]">{student.name}</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {isEditing ? (
                                                                <input
                                                                    type="text"
                                                                    value={editForm.standard}
                                                                    onChange={(e) => setEditForm({ ...editForm, standard: e.target.value })}
                                                                    className="w-full px-3 py-1 rounded bg-[#121212] text-white border border-[#3A86FF] focus:outline-none"
                                                                />
                                                            ) : (
                                                                <span className="text-[#EAEAEA]">{student.standard || '-'}</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {isEditing ? (
                                                                <select
                                                                    value={editForm.classId}
                                                                    onChange={(e) => setEditForm({ ...editForm, classId: e.target.value })}
                                                                    className="w-full px-3 py-1 rounded bg-[#121212] text-white border border-[#3A86FF] focus:outline-none"
                                                                >
                                                                    <option value="">Unassigned</option>
                                                                    {classes.map((cls) => (
                                                                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                                                                    ))}
                                                                </select>
                                                            ) : (
                                                                <span className="text-[#EAEAEA]">{studentClass?.name || 'Unassigned'}</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {isEditing ? (
                                                                <div className="flex gap-2">
                                                                    <ShinyButton
                                                                        onClick={() => saveEdit(student.id)}
                                                                        className="px-3 py-1 text-sm font-semibold"
                                                                    >
                                                                        Save
                                                                    </ShinyButton>
                                                                    <ShinyButton
                                                                        onClick={cancelEdit}
                                                                        variant="secondary"
                                                                        className="px-3 py-1 text-sm font-semibold"
                                                                    >
                                                                        Cancel
                                                                    </ShinyButton>
                                                                </div>
                                                            ) : (
                                                                <div className="flex gap-2">
                                                                    <ShinyButton
                                                                        onClick={() => startEdit(student)}
                                                                        className="px-3 py-1 text-sm font-semibold"
                                                                    >
                                                                        Edit
                                                                    </ShinyButton>
                                                                    <ShinyButton
                                                                        onClick={() => deleteStudent(student.id)}
                                                                        variant="red"
                                                                        className="px-3 py-1 text-sm font-semibold"
                                                                    >
                                                                        Delete
                                                                    </ShinyButton>
                                                                </div>
                                                            )}
                                                        </td>

                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                    {students.length === 0 && (
                                        <div className="text-center py-8 text-[#EAEAEA]">
                                            No students found. Add students manually or upload a CSV file.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Student Search & Attendance Overview Modal */}
            {showStudentSearch && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#121212] rounded-xl border border-[#2D2D2D] max-w-6xl w-full max-h-[90vh] overflow-y-auto relative">
                        <button
                            onClick={() => setShowStudentSearch(false)}
                            className="absolute top-4 right-4 text-[#EAEAEA] hover:text-white text-3xl leading-none z-10"
                        >
                            &times;
                        </button>
                        <div className="p-6">
                            <StudentSearchOverview
                                students={students.filter((s) => s.classId !== teacherClass?.id)}
                                classes={classes.filter((c) => c.id !== teacherClass?.id)}
                                schoolId={school.id}
                                onStudentUpdate={handlePersonUpdate}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Teacher Search & Attendance Overview Modal */}
            {showTeacherCalendar && teacherClass && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#121212] rounded-xl border border-[#2D2D2D] max-w-6xl w-full max-h-[90vh] overflow-y-auto relative">
                        <button
                            onClick={() => setShowTeacherCalendar(false)}
                            className="absolute top-4 right-4 text-[#EAEAEA] hover:text-white text-3xl leading-none z-10"
                        >
                            &times;
                        </button>
                        <div className="p-6">
                            <StudentSearchOverview
                                students={teacherStudents}
                                classes={[teacherClass]}
                                schoolId={school.id}
                                title="Teacher Search & Attendance Overview"
                                searchLabel="Search Teacher"
                                entityLabel="teacher"
                                showClassFilter={false}
                                onStudentUpdate={handlePersonUpdate}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}