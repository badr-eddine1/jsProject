const responses = {
  greeting: [
    "Hello! How can I assist you today?",
    "Hi there! What can I do for you?",
    "Greetings! How may I help you?"
  ],
  booking: [
    "I can help you with booking a room. Please provide the details.",
    "Sure, let's get your reservation started. What dates are you looking at?",
    "Booking made easy! Tell me your preferred dates and room type."
  ],
  fallback: [
    "I'm sorry, I didn't understand that. Could you please rephrase?",
    "Can you please clarify your request?",
    "I'm here to help, but I didn't get that. Could you try again?"
  ]
};

function getRandomResponse(category) {
  const categoryResponses = responses[category] || responses.fallback;
  const randomIndex = Math.floor(Math.random() * categoryResponses.length);
  return categoryResponses[randomIndex];
}

const chatbotController = {
  async processMessage(req, res) {
    try {
      const { message } = req.body;
      const msg = message.toLowerCase();

      let responseText = "";

      if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
        responseText = getRandomResponse("greeting");
      } else if (msg.includes("book") || msg.includes("reservation") || msg.includes("room")) {
        responseText = getRandomResponse("booking");
      } else {
        responseText = getRandomResponse("fallback");
      }

      res.json({ response: responseText });
    } catch (error) {
      console.error("Error processing chatbot message:", error);
      res.status(500).json({ error: "Error processing message" });
    }
  }
};

module.exports = chatbotController;
