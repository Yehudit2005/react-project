import { useEffect, useState, type FC } from 'react';
import './InstructorTasks.scss';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import type { TeacherTask } from '../../Models/teacherTask.model';
import  InstructorTask from  '../InstructorTasks/InstructorTask/InstructorTask'

interface InstructorTasksProps { }
const allJson = 'http://localhost:3001';

const InstructorTasks: FC<InstructorTasksProps> = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [tasks, setTasks] = useState<TeacherTask[]>([]);

  useEffect(() => {
    if (!currentUser) return; // מונע קריאה כשעדיין null

    const fetchTasks = async () => {
      const res = await fetch(`${allJson}/instructors/${currentUser.id}`);
      const instructor = await res.json();
      setTasks(instructor.pending_reviews);
    };

    fetchTasks();
  }, [currentUser]);

  return (
    <div>
      {tasks.map((a: TeacherTask) => (
        <InstructorTask key={a.task_id} task={a} />
      ))}
    </div>
  );
};

export default InstructorTasks;
