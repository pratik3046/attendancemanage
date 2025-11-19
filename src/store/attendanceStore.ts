import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { signIn, setToken as apiSetToken, getSections, getStudentsBySection, markAttendance as apiMarkAttendance } from '../lib/api';

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
}

export interface AttendanceRecord {
  studentId: string;
  date: string;
  time: string;
  status: 'present' | 'absent';
  section: string;
}

export interface AttendanceSession {
  id: string;
  date: string;
  time: string;
  section: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  records: AttendanceRecord[];
}

interface AttendanceState {
  // Auth
  isAuthenticated: boolean;
  teacherName: string;
  token: string | null;
  
  // UI Settings
  isDarkMode: boolean;
  
  // Hydration flag
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  
  // Current session
  selectedSection: string; // section name (display)
  currentSessionId: string;
  sectionNameToId: Record<string, string>; // display name -> sectionId
  
  // Students data
  students: Record<string, Student[]>;
  
  // Attendance data
  attendanceSessions: AttendanceSession[];
  attendanceHistory: AttendanceRecord[];
  
  // Current attendance taking
  currentAttendance: Record<string, 'present' | 'absent'>;
  processedStudents: string[];
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  toggleDarkMode: () => void;
  loadSections: () => Promise<void>;
  setSelectedSection: (sectionName: string) => Promise<void>;
  startAttendanceSession: () => void;
  markAttendance: (studentId: string, status: 'present' | 'absent') => void;
  submitAttendanceSession: () => Promise<void>;
  updateAttendanceStatus: (sessionId: string, studentId: string, newStatus: 'present' | 'absent') => void;
  getStudentHistory: (studentId: string, section: string) => AttendanceRecord[];
  getAttendancePercentage: (studentId: string, section: string, month?: number, year?: number) => number;
  getSectionNames: () => string[];
}

// Initially empty; will be populated from backend
const initialStudents: Record<string, Student[]> = {};

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      teacherName: '',
      token: null,
      isDarkMode: false,
      _hasHydrated: false,
      selectedSection: '',
      currentSessionId: '',
      sectionNameToId: {},
      students: initialStudents,
      attendanceSessions: [],
      attendanceHistory: [],
      currentAttendance: {},
      processedStudents: [],

      // Actions
      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },

      toggleDarkMode: () => {
        set({ isDarkMode: !get().isDarkMode });
      },

      login: async (email: string, password: string) => {
        try {
          const result = await signIn({ email, password });
          apiSetToken(result.token);
          set({ isAuthenticated: true, teacherName: email.split('@')[0], token: result.token });
          return true;
        } catch {
          return false;
        }
      },

      logout: () => {
        set({ 
          isAuthenticated: false, 
          teacherName: '',
          token: null,
          selectedSection: '',
          currentSessionId: '',
          currentAttendance: {},
          processedStudents: []
        });
        apiSetToken(null);
      },

      loadSections: async () => {
        const sections = await getSections();
        const mapping: Record<string, string> = {};
        sections.forEach(s => {
          const display = `${s.name} (${s.branch} ${s.year})`;
          mapping[display] = s._id;
        });
        set({ sectionNameToId: mapping });
      },

      setSelectedSection: async (sectionName: string) => {
        const state = get();
        set({ selectedSection: sectionName });
        // Load students for this section if not already loaded
        if (!state.students[sectionName]) {
          const sectionId = state.sectionNameToId[sectionName];
          if (sectionId) {
            const apiStudents = await getStudentsBySection(sectionId);
            const mapped: Student[] = apiStudents.map(s => ({ id: s._id, name: s.name, rollNumber: s.studentId }));
            set({ students: { ...get().students, [sectionName]: mapped } });
          }
        }
      },

      startAttendanceSession: () => {
        const sessionId = `session_${Date.now()}`;
        set({ 
          currentSessionId: sessionId,
          currentAttendance: {},
          processedStudents: []
        });
      },

      markAttendance: (studentId: string, status: 'present' | 'absent') => {
        const state = get();
        const newCurrentAttendance = { ...state.currentAttendance };
        const newProcessedStudents = [...state.processedStudents];
        
        newCurrentAttendance[studentId] = status;
        if (!newProcessedStudents.includes(studentId)) {
          newProcessedStudents.push(studentId);
        }
        
        set({ 
          currentAttendance: newCurrentAttendance,
          processedStudents: newProcessedStudents
        });
      },

      submitAttendanceSession: async () => {
        const state = get();
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();
        
        const sectionStudents = state.students[state.selectedSection] || [];
        const records: AttendanceRecord[] = [];
        let presentCount = 0;
        let absentCount = 0;
        
        sectionStudents.forEach(student => {
          const status = state.currentAttendance[student.id] || 'absent';
          records.push({
            studentId: student.id,
            date,
            time,
            status,
            section: state.selectedSection
          });
          
          if (status === 'present') presentCount++;
          else absentCount++;
        });
        
        const session: AttendanceSession = {
          id: state.currentSessionId,
          date,
          time,
          section: state.selectedSection,
          totalStudents: sectionStudents.length,
          presentCount,
          absentCount,
          records
        };
        
        // Fire-and-forget create attendance on backend (best-effort)
        try {
          const sectionId = state.sectionNameToId[state.selectedSection];
          if (sectionId) {
            await apiMarkAttendance({
              sectionId,
              date: now.toISOString(),
              markedBy: state.teacherName || 'teacher',
              records: records.map(r => ({ student: r.studentId, status: r.status === 'present' ? 'Present' : 'Absent' }))
            });
          }
        } catch {
          // swallow to avoid blocking UI; could add a toast in future
        }

        set({
          attendanceSessions: [...state.attendanceSessions, session],
          attendanceHistory: [...state.attendanceHistory, ...records],
          currentAttendance: {},
          processedStudents: []
        });
      },

      updateAttendanceStatus: (sessionId: string, studentId: string, newStatus: 'present' | 'absent') => {
        const state = get();
        
        // Update session
        const updatedSessions = state.attendanceSessions.map(session => {
          if (session.id === sessionId) {
            const updatedRecords = session.records.map(record => {
              if (record.studentId === studentId) {
                return { ...record, status: newStatus };
              }
              return record;
            });
            
            const presentCount = updatedRecords.filter(r => r.status === 'present').length;
            const absentCount = updatedRecords.filter(r => r.status === 'absent').length;
            
            return {
              ...session,
              records: updatedRecords,
              presentCount,
              absentCount
            };
          }
          return session;
        });
        
        // Update history
        const updatedHistory = state.attendanceHistory.map(record => {
          if (record.studentId === studentId && record.date === state.attendanceSessions.find(s => s.id === sessionId)?.date) {
            return { ...record, status: newStatus };
          }
          return record;
        });
        
        set({
          attendanceSessions: updatedSessions,
          attendanceHistory: updatedHistory
        });
      },

      getStudentHistory: (studentId: string, section: string) => {
        const state = get();
        return state.attendanceHistory.filter(
          record => record.studentId === studentId && record.section === section
        );
      },

      getAttendancePercentage: (studentId: string, section: string, month?: number, year?: number) => {
        const state = get();
        let records = state.attendanceHistory.filter(
          record => record.studentId === studentId && record.section === section
        );
        
        if (month !== undefined && year !== undefined) {
          records = records.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate.getMonth() === month && recordDate.getFullYear() === year;
          });
        } else if (year !== undefined) {
          records = records.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate.getFullYear() === year;
          });
        }
        
        if (records.length === 0) return 0;
        
        const presentCount = records.filter(record => record.status === 'present').length;
        return Math.round((presentCount / records.length) * 100);
      },

      getSectionNames: () => Object.keys(get().sectionNameToId),
    }),
    {
      name: 'attendance-storage',
      onRehydrateStorage: () => (state) => {
        return () => {
          try {
            const token = state?.token || null;
            apiSetToken(token);
            state?.setHasHydrated(true);
          } catch {
            // ignore
          }
        };
      },
    }
  )
);