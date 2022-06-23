import Redis from "ioredis";

const redis = new Redis({
  port: 6379, // Redis port
  host: "127.0.0.1", // Redis host
  username: "", // needs Redis >= 6
  password: "",
  db: 0, // Defaults to 0
});

export { redis };
