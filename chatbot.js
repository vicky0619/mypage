// Function to send a message to the server
async function sendMessageToGemini(message) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to get response from server');
        }

        const data = await response.json();
        return data.response;
        return response.text();
    } catch (error) {
        console.error('Error sending message to Gemini:', error);
        return "I'm sorry, I encountered an error processing your request.";
    }
}

// Handle chat form submission
document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');
    
    if (chatForm) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const message = userInput.value.trim();
            if (!message) return;
            
            // Add user message to chat
            addMessageToChat(message, 'user');
            userInput.value = '';
            
            try {
                // Show typing indicator
                const typingIndicator = document.createElement('div');
                typingIndicator.id = 'typing-indicator';
                typingIndicator.className = 'text-gray-500 text-sm italic';
                typingIndicator.textContent = 'AI is typing...';
                document.getElementById('chatOutput').appendChild(typingIndicator);
                
                // Get response from Gemini
                const response = await sendMessageToGemini(message);
                
                // Remove typing indicator
                const indicator = document.getElementById('typing-indicator');
                if (indicator) indicator.remove();
                
                // Add AI response to chat
                addMessageToChat(response, 'ai');
            } catch (error) {
                console.error('Error in chat submission:', error);
                addMessageToChat("I'm sorry, I encountered an error processing your message.", 'ai');
            }
        });
    }
});

// Function to add message to chat (moved from inline script)
function addMessageToChat(message, sender) {
    const chatOutput = document.getElementById('chatOutput');
    if (!chatOutput) return;
    
    const messageDiv = document.createElement('div');
    
    if (sender === 'user') {
        messageDiv.className = 'chat-bubble bg-gray-200 text-gray-800 p-3 rounded-l-lg rounded-br-lg max-w-xs ml-auto';
        messageDiv.innerHTML = `<div class="font-semibold text-sm text-gray-600 mb-1">You</div><p>${message}</p>`;
    } else {
        messageDiv.className = 'chat-bubble bg-blue-100 text-gray-800 p-3 rounded-r-lg rounded-bl-lg max-w-xs';
        messageDiv.innerHTML = `<div class="font-semibold text-sm text-blue-600 mb-1">AI Assistant</div><p>${message}</p>`;
    }
    
    chatOutput.appendChild(messageDiv);
    chatOutput.scrollTop = chatOutput.scrollHeight;
}
