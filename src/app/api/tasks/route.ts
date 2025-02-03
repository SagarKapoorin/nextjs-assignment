//get and post route
import { setCache } from "@/lib/redis";
import { create } from "@/helper";

export async function GET(request:Request){
    try {
        const tasks = await setCache("Task.find().sort({ createdAt: -1 }).lean()","Task");
        return Response.json(
            {
                success:true,
                tasks,
            },
            {
                status:200
            }
        )
      }catch(error){
        console.error("Error fetching tasks:", error);
        return Response.json(
            {
                success:false,
                error:`${error}`
            },
            {
                status:500
            }
        )
      }
}
export async function POST(request:Request) {
    const { title , description , dueDate }=await request.json();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('dueDate', dueDate);
    const result=await create(formData);
    if(result.success){
        return Response.json(
            {
                success:true,
                message:result.message,
            },
            {
                status:200
            }
        )
    }else{
        return Response.json(
            {
                success:false,
                error:`${result.message}`
            },
            {
                status:500
            }
        )
    }

    }
