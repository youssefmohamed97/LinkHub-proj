import defineAction from '../../../../helpers/define-action.js';
import axios from 'axios';
import addAuthHeader from '../../common/add-auth-header.js';

// Function to send a message
// async function sendMessage(authToken, message) {
//   try {
//     const response = await axios.post(
//       `https://hooks.ringcentral.com/webhook/v2/${authToken}`,
//       { text: message },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//     console.log('Message sent:', response.data);
//   } catch (error) {
//     console.error('Error sending message:', error);
//   }
// }

async function sendMessage(authToken, message) {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const response = await axios.post(
        `https://hooks.ringcentral.com/webhook/v2/${authToken}`,
        { text: message },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 5000, // Adjust the timeout value as needed
        }
      );
      console.log('Message sent:', response.data);
      return; // Exit the function if the request is successful
    } catch (error) {
      console.error('Error sending message:', error);
      retryCount++;
      console.log(`Retrying (${retryCount}/${maxRetries})...`);
      // Implement exponential backoff to wait before retrying
      await new Promise((resolve) =>
        setTimeout(resolve, 2 ** retryCount * 1000)
      );
    }
  }

  console.error('Maximum retries exceeded. Unable to send message.');
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
