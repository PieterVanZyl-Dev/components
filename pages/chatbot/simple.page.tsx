// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';

import { Button, Form, Input, SpaceBetween } from '~components';

import styles from './styles.scss';
import customer from './customer.svg';
import cloudscapeGPT from './cloudscapeGPT.svg';

interface Message {
  role: string;
  content: string;
}

interface ApiRequest {
  messages: Message[];
  context: string;
}

interface ApiResult {
  data: Message[];
  error?: string;
}

function useApi() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async (message: string, context: string) => {
    const updatedMessages = [...messages, { role: 'user', content: message }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/chat/components', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, context } as ApiRequest),
      });

      const { data, error }: ApiResult = await response.json();

      if (response.ok) {
        setMessages(data);
      } else if (error) {
        console.log(error);
        throw new Error(error);
      } else {
        throw new Error('Unknown error occurred');
      }
    } catch (err) {
      console.log(err);
      setErrorMessage((err as any).message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, messages, errorMessage, sendMessage };
}
function ChatMessage({ message }: { message: Message }) {
  return (
    <div className={clsx(styles['chat-message'], message.role === 'user' && styles['chat-message-user'])}>
      <img
        className={styles['chat-avatar']}
        src={message.role === 'user' ? customer : cloudscapeGPT}
        alt={message.role === 'user' ? 'User avatar' : 'Agent avatar'}
      />
      <div className={styles['chat-content']}>
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
    </div>
  );
}

function ChatBot({ context }: { context: string }) {
  const [value, setValue] = useState('');
  const { errorMessage, messages, loading, sendMessage } = useApi();

  const handleSend = () => {
    sendMessage(value, context);
    setValue('');
  };

  return (
    <div className={styles['chat-container']}>
      <Form errorText={errorMessage}>
        <SpaceBetween size="xs">
          {[
            {
              role: 'assistant',
              content: 'Hi there, how can I assist you with the documentation for the AWS design system?',
            },
            ...messages,
          ].map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </SpaceBetween>
        {loading && <ChatMessage message={{ role: 'assistant', content: 'I am thinking hard...' }}></ChatMessage>}
        <div className={styles['chat-input']}>
          <Input
            autoFocus={true}
            placeholder="Ask me anything"
            value={value}
            onChange={event => setValue(event.detail.value)}
            disabled={loading}
            onKeyUp={({ detail }) => {
              if (detail.keyCode === 13) {
                handleSend();
              }
            }}
          />
          <Button iconName="contact" onClick={handleSend}>
            Ask
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default function ChatBotPage() {
  return (
    <div style={{ width: 650, margin: 48, border: '1px solid grey' }}>
      <ChatBot context="alert" />
    </div>
  );
}
