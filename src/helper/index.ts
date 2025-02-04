
'use server';
import connectDB from '@/lib/db';
import { clearHash } from '@/lib/redis';
import Task, { Task_Schema } from '@/model/index';
import { revalidatePath } from 'next/cache';
//using try-catch block and proper error handling
//creating for type error preventing in upcoming or outgoing response
interface ActionResponse {
  success: boolean;
  message: string;
}
//route for creating task
export async function create(formData: FormData):Promise<ActionResponse> {
  try {
    await connectDB();
    console.log("working-create-route")
    const data={
      title: formData.get('title')as string,
      description: formData.get('description') as string,
      dueDate: formData.get('dueDate') ? new Date(formData.get('dueDate') as string) : undefined
    };
    console.log(data);
    const newTask = new Task(data);
    await newTask.save()
    //clearHash;
    await clearHash("Task.find().sort({ createdAt: -1 }).lean()","Task");
    revalidatePath('/');
    return { success: true, message: 'Task created successfully' };
  } catch (error) {
    console.log(error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to create task' 
    };
  }
}
//route ot get task
export async function get(){
  try {
    await connectDB();
    console.log("working-route-get");
    const tasks = await Task.find().sort({ createdAt: -1 }).lean();
    console.log(tasks);
    return (JSON.stringify(tasks));
  } catch (error){
    console.log(error)
    return "";
  }
}
//route for updating task
export async function update(id: string, updates: Partial<Task_Schema>): Promise<ActionResponse> {
  try {
    await connectDB();
    console.log("updated -route hit")
    const data:Partial<Task_Schema>={};
    //only updating necesary part
    if (updates.title !== undefined){
         data.title = updates.title;}
    if (updates.description !== undefined){
         data.description = updates.description;
    }
    if (updates.dueDate !== undefined){
         data.dueDate = updates.dueDate;
    }
    if (updates.completed !== undefined)data.completed=updates.completed;
console.log(data);
    const update_Task=await Task.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });

    if (!update_Task) {
      return { success: false, message: 'Task not found' };
    }
     //clearHash;
     await clearHash("Task.find().sort({ createdAt: -1 }).lean()","Task");
    revalidatePath('/');
    return { success: true, message: 'Task updated successfully' };
  } catch (error){
    console.log(error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to update task' 
    };
  }
}
//delete route
export async function deleteTask(id: string): Promise<ActionResponse> {
  try {
    await connectDB();
    const deletedTask = await Task.findByIdAndDelete(id);
        console.log("delete task hit")
    if (!deletedTask) {
      return { success: false, message: 'Task not found' };
    }
     //clearHash;
    await clearHash("Task.find().sort({ createdAt: -1 }).lean()","Task");
    revalidatePath('/');
    return { success: true, message: 'Task deleted successfully' };
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to delete task' 
    };
  }
}