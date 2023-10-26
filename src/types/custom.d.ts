import { CorsRequest } from "cors";
import { JwtPayload } from "jsonwebtoken";
declare module 'express-serve-static-core' {
    interface Request extends CorsRequest {
        user?: string | JwtPayload; // Define the user property on the Request object
    }
}