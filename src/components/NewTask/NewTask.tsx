import type { FC } from "react";
import { useNavigate } from 'react-router';
import { useFormik } from 'formik';
import * as yup from 'yup';
import "./NewTask.scss";

interface NewTaskProps { }

const majorKeys: Record<number, string> = {
  1: 'nursing',
  2: 'cs',
  3: 'psychology',
  4: 'physics',
  5: 'mathematics',
};

const majorNames: Record<number, string> = {
  1: 'סיעוד',
  2: 'מדעי המחשב',
  3: 'פסיכולוגיה',
  4: 'פיזיקה',
  5: 'מתמטיקה',
};

const NewTask: FC<NewTaskProps> = () => {
  const navigate = useNavigate();
  const allJson = 'http://localhost:3001';

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      major_id: '',
      instructor_id: '',
    },
    validationSchema: yup.object().shape({
      title: yup.string().required('שדה חובה'),
      description: yup.string().required('שדה חובה'),
      major_id: yup.number().required('שדה חובה'),
      instructor_id: yup.number()
        .min(1, 'מזהה מרצה חייב להיות בין 1 ל-20')
        .max(20, 'מזהה מרצה חייב להיות בין 1 ל-20')
        .required('שדה חובה'),
    }),
    onSubmit: async (values) => {
      const majorKey = majorKeys[Number(values.major_id)];

      const res = await fetch(`${allJson}/assignments`);
      const assignments = await res.json();
      const majorAssignments = assignments[majorKey];
      const newTaskNumber = majorAssignments.length + 1;

      const newTask = {
        task_number: newTaskNumber,
        major_id: Number(values.major_id),
        major_name: majorNames[Number(values.major_id)],
        instructor_id: Number(values.instructor_id),
        title: values.title,
        description: values.description,
      };

      majorAssignments.push(newTask);

      await fetch(`${allJson}/assignments`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [majorKey]: majorAssignments }),
      });

      navigate('/home');
    }
  });

  return (
    <div className="NewTask">
      <form onSubmit={formik.handleSubmit}>

        <input
          name="title"
          placeholder="כותרת המשימה"
          onChange={formik.handleChange}
          value={formik.values.title}
        />
        {formik.errors.title ? <div>{formik.errors.title}</div> : ''}

        <input
          name="description"
          placeholder="תיאור המשימה"
          onChange={formik.handleChange}
          value={formik.values.description}
        />
        {formik.errors.description ? <div>{formik.errors.description}</div> : ''}

        <select name="major_id" onChange={formik.handleChange} value={formik.values.major_id}>
          <option value="">בחר מגמה</option>
          <option value="1">סיעוד</option>
          <option value="2">מדעי המחשב</option>
          <option value="3">פסיכולוגיה</option>
          <option value="4">פיזיקה</option>
          <option value="5">מתמטיקה</option>
        </select>
        {formik.errors.major_id ? <div>{formik.errors.major_id}</div> : ''}

        <input
          name="instructor_id"
          type="number"
          placeholder="מזהה מרצה (בטווח של 1-20)"
          onChange={formik.handleChange}
          value={formik.values.instructor_id}
        />
        {formik.errors.instructor_id ? <div>{formik.errors.instructor_id}</div> : ''}

        <button type="submit">הוסף משימה</button>
      </form>
    </div>
  );
};

export default NewTask;