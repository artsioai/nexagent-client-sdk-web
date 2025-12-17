# NexAgent Web SDK

This package lets you start NexAgent calls directly in your webapp

## Installation

You can install the package via npm:

```bash
npm install @newcast/nexagent-sdk-web
```

## Usage

First, import the NexAgent class from the package:

```javascript
import NexAgent from '@newcast/nexagent-sdk-web';
```

Then, create a new instance of the NexAgent class, passing your Public Key as a parameter to the constructor:

```javascript
const nexAgent = new NexAgent('your-public-key');
```

You can start a new call by calling the `start` method and passing an `assistant` object or `assistantId`:

```javascript
nexAgent.start({
  model: {
    provider: "openai",
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are an assistant.",
      },
     ],
   },
   voice: {
    provider: "11labs",
    voiceId: "burt",
  },
  ...
});
```

```javascript
nexAgent.start('your-assistant-id');
```

The `start` method will initiate a new call.

You can send text messages to the assistant aside from the audio input using the `send` method and passing appropriate `role` and `content`.

```javascript
nexAgent.send({
  type: 'add-message',
  message: {
    role: 'system',
    content: 'The user has pressed the button, say peanuts',
  },
});
```

Possible values for the role are `system`, `user`, `assistant`, `tool` or `function`.

You can stop the session by calling the `stop` method:

```javascript
nexAgent.stop();
```

This will stop the recording and close the connection.

The `setMuted(muted: boolean)` can be used to mute and un-mute the user's microphone.

```javascript
nexAgent.isMuted(); // false
nexAgent.setMuted(true);
nexAgent.isMuted(); // true
```

The `say(message: string, endCallAfterSpoken?: boolean)` can be used to invoke speech and gracefully terminate the call if needed

```javascript
nexAgent.say("Our time's up, goodbye!", true)
```

## Example Web App

This repository contains a minimal Next.js demo under `example/` that exercises the SDK end-to-end.

1. Install dependencies:
   ```bash
   cd example
   yarn install
   ```
2. Copy the sample env file and provide your keys:
   ```bash
   cp .env.example .env
   # fill in NEXT_PUBLIC_NEXAGENT_PUBLIC_KEY and NEXT_PUBLIC_NEXAGENT_ASSISTANT_ID
   ```
3. Start the dev server:
   ```bash
   yarn dev
   ```
   Use `yarn build && yarn start` to verify the production build.

## Events

You can listen to the following events:

```javascript
nexAgent.on('speech-start', () => {
  console.log('Speech has started');
});

nexAgent.on('speech-end', () => {
  console.log('Speech has ended');
});

nexAgent.on('call-start', () => {
  console.log('Call has started');
});

nexAgent.on('call-end', () => {
  console.log('Call has stopped');
});

nexAgent.on('volume-level', (volume) => {
  console.log(`Assistant volume level: ${volume}`);
});

// Function calls and transcripts will be sent via messages
nexAgent.on('message', (message) => {
  console.log(message);
});

nexAgent.on('error', (e) => {
  console.error(e);
});
```

These events allow you to react to changes in the state of the call or speech.

## License

```
MIT License

Copyright (c) 2024 NexAgent Labs Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
