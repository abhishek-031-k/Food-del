const buckets = new Map();

const CAPACITY = 5;
const REFILL_RATE = 0.2; // 1 token every 5 seconds

const tokenBucketRateLimiter = (type) => {

    return (req, res, next) => {

        // Get client IP
        const forwardedFor = req.headers["x-forwarded-for"];

        const ip = forwardedFor
            ? forwardedFor.split(",")[0].trim()
            : req.ip;

        /*
            Separate bucket for each IP + endpoint

            Example:
            ::1-login
            ::1-register
        */
        const key = `${ip}-${type}`;

        const now = Date.now();

        let bucket = buckets.get(key);

        // Create new bucket
        if (!bucket) {

            bucket = {
                tokens: CAPACITY,
                lastRefill: now
            };

            buckets.set(key, bucket);
        }

        // Calculate elapsed time
        const elapsedTime =
            (now - bucket.lastRefill) / 1000;

        // Refill tokens
        bucket.tokens = Math.min(
            CAPACITY,
            bucket.tokens + elapsedTime * REFILL_RATE
        );

        bucket.lastRefill = now;

        // No token available
        if (bucket.tokens < 1) {

            return res.status(429).json({
                success: false,
                message:
                    type === "login"
                        ? "Too many login attempts. Please try again later."
                        : "Too many registration attempts. Please try again later."
            });
        }

        // Consume one token
        bucket.tokens -= 1;

        next();
    };
};

export default tokenBucketRateLimiter;