import { deleteTask, update } from "@/helper";

export async function PUT(request:Request,  { params }: { params: Promise<{id: string }> }){
    const { id } = await params;
    const data=await request.json(); //eg title:lka
    const result=await update(id,data);
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
export async function DELETE(request:Request,{ params }: { params: Promise<{id: string }>}) {
    const { id } = await params;
    const result=await deleteTask(id);
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