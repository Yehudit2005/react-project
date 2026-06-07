export interface StudentTask {
  student_id: number;
  task_number: number;
  completed: boolean;
  score: number | null;

  major_id: number;
  major_name: string;
  instructor_id: number;
  title: string;
  description: string;
}