import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Bonjour! Comment puis-je vous aider aujourd\'hui?' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch('http://localhost:5000/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      const botMessage = { sender: 'bot', text: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { sender: 'bot', text: 'Désolé, une erreur est survenue.' };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <Paper sx={{ width: 300, height: 400, p: 2, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>Chatbot</Typography>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index} sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <ListItemText
                primary={msg.text}
                sx={{
                  bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.300',
                  color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  maxWidth: '80%',
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ display: 'flex' }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Tapez votre message..."
        />
        <Button variant="contained" onClick={sendMessage} sx={{ ml: 1 }}>
          Envoyer
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatBot;
