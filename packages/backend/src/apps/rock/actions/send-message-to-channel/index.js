import defineAction from '../../../../helpers/define-action.js';
import axios from 'axios';
import addAuthHeader from '../../common/add-auth-header.js';

// Function to send a message
async function sendMessage(authToken, message) {
  try {
    const response = await axios.post(
      `https://api.rock.so/webhook/bot?auth=${authToken}&method=sendMessage`,
      { text: message }
    );
    console.log('Message sent:', response.data);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

export default defineAction({
  name: 'Send a message to channel',
  key: 'sendMessageToChannel',
  description: 'Sends a message to a specific channel you specify.',
  arguments: [
    {
      label: 'Message text',
      key: 'message',
      type: 'string',
      required: true,
      description: 'The content of your new message.',
      variables: true,
    },
  ],

  async run($) {
    const data = {
      content: $.step.parameters.message,
    };

    // Example usage
    await sendMessage($.auth.data.authenticationKey, data.content);
  },
});
