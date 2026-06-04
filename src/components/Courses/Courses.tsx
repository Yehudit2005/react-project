import React, { useState, useEffect } from 'react';
import dbData from '../../../JASONSERVER/db.json';

interface Student {
  id: number;
  user_type_id: number;
  first_name: string;
  last_name: string;
  email: string;
  address: {
    city: string;
    street: string;
    number: number;
  };
  phone: string;
  age: number;
  major_id: number;
  major_name: string;
  study_year: string;
  family_status: string;
}

interface Assignment {
  task_number: number;
  completed: boolean;
  score: number | null;
}

export default function StudentDashboard() {
  const [studentInfo, setStudentInfo] = useState<Student | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedUser = localStorage.getItem('loggedUser');

    if (loggedUser) {
      const loggedInIdNum = Number(loggedUser);

      const currentStudent = dbData.students.find(
        (s) => s.id === loggedInIdNum
      );

      setStudentInfo(currentStudent ?? null);

      const currentTracking = dbData.tracking.find(
        (t) => t.student_id === loggedInIdNum
      );

      if (currentTracking?.assignments) {
        setAssignments(currentTracking.assignments);
      }
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <div>טוען נתונים...</div>;
  }

  if (!studentInfo) {
    return <div>לא נמצאו פרטי סטודנט מחובר.</div>;
  }

  const pendingTasks = assignments.filter(
    (task) => !task.completed
  );

  const completedTasks = assignments.filter(
    (task) => task.completed
  );

  const tasksWithScore = completedTasks.filter(
    (task) => task.score !== null
  );

  const totalScore = tasksWithScore.reduce(
    (sum, task) => sum + (task.score ?? 0),
    0
  );

  const averageScore =
    tasksWithScore.length > 0
      ? (totalScore / tasksWithScore.length).toFixed(1)
      : '0';

  return (
    <div>
      <h2>
        שלום, {studentInfo.first_name} {studentInfo.last_name}
      </h2>

      <p>חוג לימודים: {studentInfo.major_name}</p>

      <div>
        <div>
          <h3>משימות לביצוע</h3>
          <p>{pendingTasks.length}</p>
        </div>

        <div>
          <h3>משימות שהושלמו</h3>
          <p>{completedTasks.length}</p>
        </div>

        <div>
          <h3>ממוצע ציונים</h3>
          <p>{averageScore}</p>
        </div>
      </div>

      <hr />

      <h3>משימות שטרם הושלמו</h3>

      {pendingTasks.length === 0 ? (
        <p>כל הכבוד! אין משימות פתוחות.</p>
      ) : (
        <ul>
          {pendingTasks.map((task) => (
            <li key={task.task_number}>
              מטלה מספר {task.task_number} — טרם בוצע
            </li>
          ))}
        </ul>
      )}

      <h3>משימות שהושלמו והיסטוריית ציונים</h3>

      {completedTasks.length === 0 ? (
        <p>טרם הוגשו משימות.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>מספר מטלה</th>
              <th>סטטוס</th>
              <th>ציון</th>
            </tr>
          </thead>

          <tbody>
            {completedTasks.map((task) => (
              <tr key={task.task_number}>
                <td>מטלה מספר {task.task_number}</td>
                <td>הושלמה</td>
                <td>
                  {task.score !== null
                    ? task.score
                    : 'אין ציון'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}