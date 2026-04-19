const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { Kafka } = require('kafkajs');
const nodemailer = require('nodemailer');

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
});

const consumer = kafka.consumer({ groupId: 'notification-group' });

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (options) => {
  const mailOptions = {
    from: `DSA Study Hub <${process.env.EMAIL_FROM || "no-reply@dsahub.com"}>`,
    to: options.email || options.to,
    subject: options.subject,
    text: options.message || options.text,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email successfully sent to: ${mailOptions.to}`);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};

const run = async () => {
  try {
    await consumer.connect();
    console.log('✅ Notification Service connected to Kafka');
    
    await consumer.subscribe({ topic: 'send-email', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const data = JSON.parse(message.value.toString());
        console.log(`📩 Received email job for: ${data.email || data.to}`);
        await sendEmail(data);
      },
    });
  } catch (error) {
    console.error('❌ Notification Service error:', error);
  }
};

run();
