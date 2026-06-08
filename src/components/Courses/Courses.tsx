import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import type { StudentTask } from '../../Models/studentTasks.model';
import  Course from './Course/Course'

const Courses = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [assignments, setAssignments] = useState<StudentTask[]>([]);
  const allJson = 'http://localhost:3001';
const [search, setSearch] = useState('');

const filtered = assignments.filter((a) =>
  a.title.includes(search)
);
  useEffect(() => {
    const fetchTasks = async () => {
      const trackingRes = await fetch(`${allJson}/tracking?student_id=${currentUser.id}`);
      const trackingData = await trackingRes.json();
      const studentTracking = trackingData[0]; 

      const majorMap: Record<number, string> = {
        1: 'nursing',
        2: 'cs',
        3: 'psychology',
        4: 'physics',
        5: 'mathematics'
      };
      const majorKey = majorMap[currentUser.major_id];
      const assignmentsRes = await fetch(`${allJson}/assignments`);
      const allAssignments = await assignmentsRes.json();
      const majorAssignments = allAssignments[majorKey];

      // שלב 3 — מחברים בין טראקינג למשימות
      const combined = studentTracking.assignments.map((track: any) => {
        const details = majorAssignments.find(
          (a: any) => a.task_number === track.task_number
        );
        return {
          ...track,
          ...details,
  id: `${track.major_name}_${track.task_number}`        };
      });

      setAssignments(combined);
    };

    if (currentUser) fetchTasks();
  }, [currentUser]);
return (
  <div>
    <input
      placeholder="חיפוש משימה..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    {filtered.map((a) => (
      <Course key={`${a.major_name}_${a.task_number}`} studentTask={a} />
    ))}
  </div>
);
};

export default Courses;