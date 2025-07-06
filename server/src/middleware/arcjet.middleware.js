import { aj } from "../config/arcjet.js";

export const arcjetMiddleware = async (req, res, next) => {
    try {
        const decison = await aj.protect(req, {
            requested: 1,
        });

        if (decison.isDenied()) {
            if (decison.reason.isRateLimit()) {
                return res.status(429).json({
                    error: "Too many requests",
                    message: "Rate limit exceeded. Please try again later.",
                });
            } else if (decison.reason.isBot()) {
                return res.status(403).json({
                    error: "Bot access denied",
                    message: "Automated requests are not allowed",
                });
            } else {
                return res.status(403).json({
                    error: "Forbidden",
                    message: "Access denied",
                });
            }
        }
        
        if (decison.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
            return res.status(403).json({
                error: "Spoofed bot detected",
                message: "Unknown activity detected",
            });
        }

        next();
    } catch (err) {
        console.error("Arject middleware error:", err);
        next();
    }
};