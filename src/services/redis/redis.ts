import { createClient } from 'redis';

const redisClient = createClient({
  password: 'aZL2QKcCu3yxldVt08PUPzQTtAM97eP6',
  socket: {
    host: 'redis-16699.c10.us-east-1-4.ec2.redns.redis-cloud.com',
    port: 16699,
  },
});

redisClient.on('error', (err) => console.log(err));

if (!redisClient.isOpen) {
  redisClient.connect();
}

export default redisClient;
