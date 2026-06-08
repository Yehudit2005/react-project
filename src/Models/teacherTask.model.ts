export interface TeacherTask {
  task_number: number;
  major_name: string;
    task_title: string;
    student_name: string;
    student_id:number;
    feedback:string;
    score: number | null;
}