"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface TrendData {
  date: string;
  percentage: number;
  present: number;
  absent: number;
  total: number;
}

interface SchoolDashboardData {
  id: string;
  name: string;
  todayPercentage: number;
  trend: TrendData[];
}

interface DashboardSummary {
  averageAttendance: number;
  totalPresent: number;
  totalAbsent: number;
}

interface DashboardData {
  success: boolean;
  schools?: SchoolDashboardData[];
  summary?: DashboardSummary;
  error?: string;
}

import { ArrowLeft, ArrowRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

function SchoolCard({ school, onDrillDown }: { school: SchoolDashboardData; onDrillDown: () => void }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrev = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() - 1);
    setCurrentDate(nextDate);
  };

  const handleNext = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const today = new Date();
    // Don't go beyond today easily
    if (nextDate.setHours(0,0,0,0) <= today.setHours(0,0,0,0)) {
      setCurrentDate(nextDate);
    }
  };

  const isToday = () => {
    const today = new Date();
    return currentDate.setHours(0,0,0,0) === today.setHours(0,0,0,0);
  };

  const offsetDate = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000));
  const dateStr = offsetDate.toISOString().split("T")[0];

  const dayData = school.trend.find((t) => t.date === dateStr);
  const hasData = dayData && dayData.total > 0;

  const pieData = hasData
    ? [
        { name: "Present", value: dayData.present, color: "#4ade80" }, // Green
        { name: "Absent", value: dayData.absent, color: "#ff4d4f" }, // Red
      ]
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#3D3D3D] p-5 rounded-xl shadow-xl flex flex-col justify-between items-center w-full max-w-sm mx-auto"
    >
      <div className="flex justify-between items-center w-full mb-4">
        <button
          onClick={handlePrev}
          className="text-white hover:opacity-75 transition-opacity"
        >
          <ArrowLeft size={24} strokeWidth={3} />
        </button>
        <div className="text-white text-lg font-medium">
          {currentDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          })}
        </div>
        <button
          onClick={handleNext}
          disabled={isToday()}
          className={`transition-opacity ${
            isToday() ? "text-white/30 cursor-not-allowed" : "text-white hover:opacity-75"
          }`}
        >
          <ArrowRight size={24} strokeWidth={3} />
        </button>
      </div>

      <div className="relative w-full h-[140px] flex justify-center items-end overflow-hidden mb-6">
        {hasData ? (
          <>
            <div className="absolute top-0 w-[240px] h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={75}
                    outerRadius={110}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                    isAnimationActive={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="z-10 flex flex-col items-center mb-[-5px]">
              <span className="text-2xl font-bold text-white mb-0 drop-shadow-md">
                {dayData.total}
              </span>
              <span className="text-xl font-bold text-white drop-shadow-md">
                {school.name}
              </span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-end pb-2">
            <span className="text-[#999] text-base mb-2 font-medium">no data</span>
            <span className="text-xl font-bold text-white drop-shadow-md">
              {school.name}
            </span>
          </div>
        )}
      </div>

      <button
        onClick={onDrillDown}
        className="w-full py-2.5 bg-[#29A0FC] hover:bg-[#1E8EE5] text-white text-lg font-medium rounded-full transition-colors"
      >
        view school specifics
      </button>
    </motion.div>
  );
}

export default function DirectorDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/director/dashboard");
        if (res.status === 401) {
          router.push("/sign-in");
          return;
        }
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white text-xl font-medium animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }

  if (!data?.success || !data.schools) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center p-8">
        <div className="bg-[#1C1C1E] p-8 rounded-2xl border border-red-500/20 max-w-md w-full text-center">
          <p className="text-red-400 font-medium text-lg mb-4">
            {data?.error || "Failed to load dashboard data."}
          </p>
          <button
            onClick={() => router.push("/sign-in")}
            className="px-6 py-2 bg-[#3A86FF] hover:bg-[#2A76EF] transition-colors rounded-lg text-white font-medium"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center">
      <div className="w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight uppercase">Welcome Director</h1>
            </div>
            <button
                onClick={async () => {
                    document.cookie = 'director_session=; Max-Age=0; path=/;';
                    router.push('/sign-in');
                }}
                className="px-4 py-2 border border-[#333] hover:border-[#555] rounded-lg text-sm font-medium text-[#EAEAEA] transition-colors"
            >
                Sign Out
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 gap-6 justify-items-center">
          {data.schools.map((school) => (
            <SchoolCard 
              key={school.id} 
              school={school} 
              onDrillDown={() => router.push(`/director/school/${school.id}`)} 
            />
          ))}
        </div>
        
        {data.schools.length === 0 && (
            <div className="p-8 border border-dashed border-[#333] rounded-2xl text-center w-full mt-8">
                <p className="text-[#888]">No schools have been assigned to your director account yet.</p>
            </div>
        )}
      </div>
    </div>
  );
}
