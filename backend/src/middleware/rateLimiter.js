import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next)=>{
    try {
        const {success} = await ratelimit.limit("rate-limiting-id");
        if (!success){
            return res.status(429).json({
                message:"too many requests, try again later."
            })
        }
        next();
    } catch (error) {
        console.log("rate limit error");
        next();
        
    }

}

export default rateLimiter;