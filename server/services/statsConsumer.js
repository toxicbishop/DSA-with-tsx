const { kafka, KAFKA_ENABLED } = require('../utils/kafka');

const startStatsConsumer = async () => {
    if (!KAFKA_ENABLED) {
        console.log('ℹ️ Kafka consumer skipped (Kafka disabled)');
        return;
    }
    const consumer = kafka.consumer({ groupId: 'stats-group' });
    try {
        await consumer.connect();
        await consumer.subscribe({ topic: 'user-stats', fromBeginning: true });
        await consumer.subscribe({ topic: 'send-email', fromBeginning: true });

        console.log('✅ Kafka Consumers connected');

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const data = JSON.parse(message.value.toString());

                if (topic === 'user-stats') {
                    console.log(`📊 [Analytics] Processing ${data.type} event:`, data);
                } else if (topic === 'send-email') {
                    console.log(`📧 [Email Service] Background processing email for: ${data.to || data.email}`);
                }
            },
        });
    } catch (error) {
        console.error('❌ Kafka Consumer error:', error);
    }
};

module.exports = { startStatsConsumer };
