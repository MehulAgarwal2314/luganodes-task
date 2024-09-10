import fetch from "node-fetch";

const token = process.env.TELEGRAM_TOKEN;

const getChatId = async (token) => {
    const url = `https://api.telegram.org/bot${token}/getUpdates`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.ok && data.result.length > 0) {
            const latestUpdate = data.result[data.result.length - 1];
            const chatId = latestUpdate.message.chat.id;
            console.log(`Chat ID: ${chatId}`);
            return chatId;
        } else {
            console.error('No updates available or error fetching updates.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching updates:', error);
        return null;
    }
};

// Function to send a message to a chat ID
const sendTelegramMessage = async (token, chatId, message) => {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    
    const payload = {
        chat_id: chatId,
        text: message
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        console.log('Message sent:', data);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

// Main function to get chat ID and send a message
const main = async () => {
    const chatId = await getChatId(token);
    if (chatId) {
        const message = 'Hello, this is a test notification from your bot!';
        await sendTelegramMessage(token, chatId, message);
    }
};

// Run the main function
main();