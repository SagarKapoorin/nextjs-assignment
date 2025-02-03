import { get } from "@/helper";
import { FilterQuery, Query } from "mongoose";
import { Error } from "mongoose";

import { createClient } from "redis";
//errors->getting errors as we are trying to update mongoose.exec function
// modify redis url according
const redisUrl = process.env.redisUrl || "redis://127.0.0.1:6379";
export const client = createClient({
  url: redisUrl,
});

client.on("error", (err: Error) => console.error("Redis Client Error", err));

export async function connectRedis() {
  try {
    await client.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Could not connect to Redis", err);
  }
}

export const setCache=async(Query:string,Collection:string)=>{
    await connectRedis();
    const hashkey=JSON.stringify({query:Query,collection:Collection });
    const hashResult=await client.get(hashkey);
    if(hashResult){
        console.log("Serving from CACHE");
        return JSON.parse(hashResult);
    }else{
        const result=await get();
        console.log("Serving form MONGODB")
        console.log(result)
    client.set(hashkey,result,{
        EX:3600*24*5 //5days
    })
    return JSON.parse(result);
}
}

export const clearHash = async (query: string, collection: string): Promise<void> => {
  try {
    const hashKey = JSON.stringify({ query:query, collection:collection });
    await client.del(hashKey);
    console.log(`Cleared hash for key: ${hashKey}`);
  } catch (error) {
    console.error(`Error clearing hash for key :`, error);
  }
};