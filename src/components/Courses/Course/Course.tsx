import type { FC } from 'react';
import type { StudentTask } from '../../../Models/studentTasks.model';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface CourseProps {
  studentTask: StudentTask;
}

const Course: FC<CourseProps> = ({ studentTask }) => {

  const formik = useFormik({
    initialValues: {
      feedback: '',
    },
    validationSchema: yup.object().shape({
      feedback: yup.string()
        .max(300, 'המשוב לא יכול לעלות על 300 תווים')
        .required('שדה חובה'),
    }),
    onSubmit: (values) => {
    }
  });

  return (
    <div>
      <h3>{studentTask.title}</h3>
      <p>{studentTask.description}</p>
      <p>בוצע: {studentTask.completed ? 'כן' : 'לא'}</p>
      <p>ציון: {studentTask.score ?? 'אין עדיין'}</p>
      <form onSubmit={formik.handleSubmit}>
        <input
          name="feedback"
          placeholder="משוב ופירוט איך היתה המשימה (עד 300 תווים)"
          onChange={formik.handleChange}
          value={formik.values.feedback}
        />
        {formik.errors.feedback ? <div>{formik.errors.feedback}</div> : ''}
  <button type="submit">הגשה</button>
      </form>
    </div>
  );
};

export default Course;