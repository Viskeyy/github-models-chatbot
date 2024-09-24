# GitHub Models Web Application

Welcome to the GitHub Models Web Application, a sophisticated web-based interface designed to facilitate seamless communication with a variety of models available on GitHub Models. Built using Next.js, this application provides a user-friendly platform for interacting with AI models through a web browser.

## Key Features

1. **Model Selection**: Users can choose from all available models on GitHub Models, offering a wide range of capabilities and functionalities.
2. **Custom Prompts**: The application supports the creation of custom prompts for engaging with the models. Please note that not all models may support this feature.
3. **Conversation History**: With no reliance on a database, the application can maintain a conversation history of up to 30 messages, allowing for multi-turn dialogues without losing context.

## Getting Started

To get started with the GitHub Models Web Application, follow these simple steps:

1. **Environment Setup**: Ensure that you have a `.env.local` file in your project directory with the necessary environment variables set.
2. **Configuration**: Configure the `GITHUB_TOKEN` and `AZURE_ENDPOINT` variables in your `.env.local` file to authenticate and connect with the GitHub Models API.

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or Yarn package manager
- A GitHub account with access to GitHub Models
- An Azure endpoint for model interaction (if applicable)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Viskeyy/github-models-chatbot.git
   ```

2. Navigate to the project directory:

   ```bash
   cd github-models-chatbot
   ```

3. Install the dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

4. Create a `.env.local` file in the root of the project directory and add your `GITHUB_TOKEN` and `AZURE_ENDPOINT`:

   ```text
   GITHUB_TOKEN=your_github_token_here
   AZURE_ENDPOINT=your_azure_endpoint_here
   ```

5. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Usage

Once the application is running, you can access it through your web browser at `http://localhost:3000`. Here's how to use the application:

1. **Select a Model**: Choose the model you wish to interact with from the dropdown menu.
2. **Enter a Prompt**: Type your custom prompt in the input field.
3. **Send**: Click the "Send" button to submit your prompt to the model.
4. **Receive a Response**: The model will process your prompt and return a response, which will be displayed in the conversation history.

## Customization

The GitHub Models Web Application is designed to be easily customizable. You can modify the UI, add new features, or integrate additional models by editing the source code.

### Contributing

We welcome contributions to the project. If you have an idea for a new feature, or if you find a bug, please submit an issue or create a pull request.

### License

This project is open source and available under the [MIT License](LICENSE).

## Support

For any questions or issues, please reach out to us at [support@githubmodels.com](mailto:support@githubmodels.com).

## Acknowledgements

We would like to thank the GitHub Models community for their continuous support and contributions to the AI model ecosystem.

---

Enjoy your AI-driven conversations with the GitHub Models Web Application!
