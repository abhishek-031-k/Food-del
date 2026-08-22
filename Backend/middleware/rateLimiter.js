const buckets = new Map();

const CAPACITY = 5;
const REFILL_RATE = 0.2; // 1 token every 5 seconds

const tokenBucketRateLimiter = (req, res, next) => {

    // Get client IP
    const forwardedFor = req.headers["x-forwarded-for"];

    const ip = forwardedFor
        ? forwardedFor.split(",")[0].trim()
        : req.ip;

    console.log("================================");
    console.log("RATE LIMITER HIT");
    console.log("IP:", ip);

    const now = Date.now();

    let bucket = buckets.get(ip);

    // Create bucket for new IP
    if (!bucket) {

        bucket = {
            tokens: CAPACITY,
            lastRefill: now
        };

        buckets.set(ip, bucket);

        console.log("NEW BUCKET CREATED");
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

    console.log("TOKENS BEFORE REQUEST:", bucket.tokens);

    // Check if token is available
    if (bucket.tokens < 1) {

        console.log("❌ RATE LIMIT EXCEEDED");

        return res.status(429).json({
            success: false,
            message: "Too many login attempts. Please try again later."
        });
    }

    // Consume one token
    bucket.tokens -= 1;

    console.log("TOKENS AFTER REQUEST:", bucket.tokens);
    console.log("✅ REQUEST ALLOWED");

    next();
};

export default tokenBucketRateLimiter;