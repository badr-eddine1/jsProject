const dialogflow = require('@google-cloud/dialogflow');

// Replace these with your actual Dialogflow project details
const projectId = 'reservation-chatbot-459113';
const sessionId = 'unique-session-id';
const languageCode = 'fr';

const sessionClient = new dialogflow.SessionsClient({
  keyFilename: './reservation-chatbot-459113-354bb60c1ded.json',
});

const chatController = {
  async processMessage(req, res) {
    try {
      const { message } = req.body;
      
      // Create a session path
      const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

      // The text query request
      const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: message,
            languageCode: languageCode,
          },
        },
      };

      // Send request and log result
      const responses = await sessionClient.detectIntent(request);
      const result = responses[0].queryResult;

      res.json({
        response: result.fulfillmentText,
        intent: result.intent.displayName,
      });
    } catch (error) {
      console.error('Error processing message:', error);
      res.status(500).json({ error: 'Error processing message' });
    }
  },
};

module.exports = chatController; 