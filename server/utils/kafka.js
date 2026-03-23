const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'dsa-hub-monolith',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
});

const producer = kafka.producer();

const connectProducer = async () => {
  try {
    await producer.connect();
    console.log('✅ Kafka Producer connected');
  } catch (error) {
    console.error('❌ Kafka Producer connection error:', error);
  }
};

const sendEmailEvent = async (emailData) => {
  try {
    await producer.send({
      topic: 'send-email',
      messages: [
        { value: JSON.stringify(emailData) },
      ],
    });
    console.log(`📡 Email event produced for: ${emailData.to}`);
  } catch (error) {
    console.error('❌ Kafka produce error:', error);
  }
};

const produceUserStat = async (statData) => {
  try {
    await producer.send({
      topic: 'user-stats',
      messages: [
        { 
          value: JSON.stringify({
            ...statData,
            timestamp: new Date().toISOString()
          }) 
        },
      ],
    });
    console.log(`📡 Stat event produced: ${statData.type}`);
  } catch (error) {
    console.error('❌ Kafka produce error:', error);
  }
};

module.exports = {
  kafka,
  producer,
  connectProducer,
  sendEmailEvent,
  produceUserStat,
};
