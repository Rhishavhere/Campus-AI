import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, studentsData } from '@/data/students';

interface AuthContextType {
  student: Student | null;
  login: (usn: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for saved session
    const savedSession = localStorage.getItem('campus_session');
    if (savedSession) {
      const usn = JSON.parse(savedSession);
      const foundStudent = studentsData.find(s => s.usn === usn);
      if (foundStudent) {
        setStudent(foundStudent);
        setIsAuthenticated(true);
      }
    }
  }, []);

  const login = (usn: string, password: string): boolean => {
    const foundStudent = studentsData.find(
      s => s.usn === usn && s.password === password
    );

    if (foundStudent) {
      setStudent(foundStudent);
      setIsAuthenticated(true);
      localStorage.setItem('campus_session', JSON.stringify(usn));
      return true;
    }
    return false;
  };

  const logout = () => {
    setStudent(null);
    setIsAuthenticated(false);
    localStorage.removeItem('campus_session');
  };

  return (
    <AuthContext.Provider value={{ student, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
