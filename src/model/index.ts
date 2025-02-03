//models ofTask
import mongoose, { Document, Model } from 'mongoose';

export interface Task_Schema extends Document {
  title: string;
  description?: string;
  dueDate?: Date;
  Completed?: boolean;
  createdAt: Date;
}

const TaskSchema = new mongoose.Schema<Task_Schema>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date
  },
  Completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
// checking and then building mongoosemodel
const Task: Model<Task_Schema> = mongoose.models?.Task || mongoose.model<Task_Schema>('Task', TaskSchema);
export default Task;