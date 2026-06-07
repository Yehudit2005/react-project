import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
const StudentAssignments = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [assignments, setAssignments] = useState<any[]>([]);
  const allJson = 'http://localhost:3001';

  useEffect(() => {
    const fetchTasks = async () => {
      // שלב 1 — שולפים את טראקינג של התלמיד הספציפי
      const trackingRes = await fetch(`${allJson}/tracking?student_id=${currentUser.id}`);
      const trackingData = await trackingRes.json();
      const studentTracking = trackingData[0]; // יש רק רשומה אחת לכל תלמיד

      // שלב 2 — שולפים את כל המשימות לפי המגמה של התלמיד
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
          ...details
        };
      });

      setAssignments(combined);
    };

    if (currentUser) fetchTasks();
  }, [currentUser]);

  return (
    <div>
      {assignments.map((a) => (
        <div key={a.task_number}>
          <h3>{a.title}</h3>
          <p>{a.description}</p>
          <p>בוצע: {a.completed ? 'כן' : 'לא'}</p>
          <p>ציון: {a.score ?? 'אין עדיין'}</p>
        </div>
      ))}
    </div>
  );
};

export default StudentAssignments;