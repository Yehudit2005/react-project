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
const [search, setSearch] = useState('');

const filtered = tasks.filter((t) =>
  t.task_title.includes(search)
);
  useEffect(() => {
    if (!currentUser) return; // 

    const fetchTasks = async () => {
      const res = await fetch(`${allJson}/instructors/${currentUser.id}`);
      const instructor = await res.json();
      setTasks(instructor.pending_reviews);
    };

    fetchTasks();
  }, [currentUser]);

return (
  <div>
    <input
      placeholder="חיפוש משימה..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    {filtered.map((t) => (
      <InstructorTask key={`${t.student_id}_${t.task_number}`} task={t} />
    ))}
  </div>
);
};

export default InstructorTasks;
