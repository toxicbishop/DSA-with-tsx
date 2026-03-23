const { kafka } = require('../utils/kafka');

const consumer = kafka.consumer({ groupId: 'stats-group' });

const startStatsConsumer = async () => {
    try {
        await consumer.connect();
        await consumer.subscribe({ topic: 'user-stats', fromBeginning: true });
        // Also subscribe to email topic just to show background processing
        await consumer.subscribe({ topic: 'send-email', fromBeginning: true });

        console.log('✅ Kafka Consumers connected');

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const data = JSON.parse(message.value.toString());
                
                if (topic === 'user-stats') {
                    console.log(`📊 [Analytics] Processing ${data.type} event:`, data);
                    // HERE: You could save this to a dedicated Analytics collection in MongoDB
                    // For now, we'll just log it to demonstrate the flow.
                } else if (topic === 'send-email') {
                    console.log(`📧 [Email Service] Background processing email for: ${data.to || data.email}`);
                    // Trigger actual email sending logic here if needed
                }
            },
        });
    } catch (error) {
        console.error('❌ Kafka Consumer error:', error);
    }
};

module.exports = { startStatsConsumer };
