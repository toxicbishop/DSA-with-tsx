const { Kafka, logLevel } = require('kafkajs');

const KAFKA_ENABLED = process.env.KAFKA_ENABLED !== 'false' && !!process.env.KAFKA_BROKERS;

const useSasl = !!(process.env.KAFKA_USERNAME && process.env.KAFKA_PASSWORD);
const useSsl = process.env.KAFKA_SSL === 'true' || useSasl;

const kafka = KAFKA_ENABLED
  ? new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || 'dsa-hub-monolith',
      brokers: process.env.KAFKA_BROKERS.split(','),
      ssl: useSsl,
      sasl: useSasl
        ? {
            mechanism: process.env.KAFKA_SASL_MECHANISM || 'plain',
            username: process.env.KAFKA_USERNAME,
            password: process.env.KAFKA_PASSWORD,
          }
        : undefined,
      logLevel: logLevel.ERROR,
    })
  : null;

const producer = kafka ? kafka.producer() : null;

const connectProducer = async () => {
  if (!KAFKA_ENABLED) {
    console.log('ℹ️ Kafka disabled (no KAFKA_BROKERS or KAFKA_ENABLED=false)');
    return;
  }
  try {
    await producer.connect();
    console.log('✅ Kafka Producer connected');
  } catch (error) {
    console.error('❌ Kafka Producer connection error:', error);
  }
};

const sendEmailEvent = async (emailData) => {
  if (!KAFKA_ENABLED) return;
  try {
    await producer.send({
      topic: 'send-email',
      messages: [{ value: JSON.stringify(emailData) }],
    });
    console.log(`📡 Email event produced for: ${emailData.to}`);
  } catch (error) {
    console.error('❌ Kafka produce error:', error);
  }
};

const produceUserStat = async (statData) => {
  if (!KAFKA_ENABLED) return;
  try {
    await producer.send({
      topic: 'user-stats',
      messages: [
        {
          value: JSON.stringify({
            ...statData,
            timestamp: new Date().toISOString(),
          }),
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
  KAFKA_ENABLED,
};
