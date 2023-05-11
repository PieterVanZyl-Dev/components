// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  AppLayout,
  Button,
  Form,
  FormField,
  HelpPanel,
  Input,
  NonCancelableCustomEvent,
  SpaceBetween,
} from '~components';
import appLayoutLabels from './utils/labels';
import ScreenshotArea from '../utils/screenshot-area';
import styles from './styles.scss';
import customer from './customer.svg';
import cloudscapeGPT from './cloudscapeGPT.svg';
import clsx from 'clsx';

interface Message {
  role: string;
  content: string;
}

export default function WithDrawers() {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);

  const drawers = {
    drawers: {
      ariaLabel: 'Drawers',
      activeDrawerId: activeDrawerId,
      widths: {
        'cloudscape-help': 1200,
      },
      items: [
        {
          ariaLabels: {
            closeButton: 'Cloudscape Assistant close button',
            content: 'Cloudscape Assistant drawer content',
            triggerButton: 'Cloudscape Assistant trigger button',
            resizeHandle: 'Cloudscape Assistant resize handle',
          },
          content: <CloudscapeAssistant />,
          id: 'cloudscape-help',
          trigger: {
            iconName: 'contact',
          },
          resizable: true,
        },
      ],
      onChange: (event: NonCancelableCustomEvent<string>) => {
        setActiveDrawerId(event.detail);
      },
    },
  };

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={appLayoutLabels}
        {...drawers}
        content={
          <div style={{ width: 700, display: 'flex', height: '100%' }}>
            <CloudscapeAssistant />
          </div>
        }
      />
    </ScreenshotArea>
  );
}

function ChatMessage({ message }: { message: Message }) {
  return (
    <div className={clsx(styles['chat-container'], message.role === 'user' && styles['chat-container-user'])}>
      <img className={styles['chat-avatar']} src={message.role === 'user' ? customer : cloudscapeGPT} />
      <div className={styles['chat-content']}>
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
    </div>
  );
}

function CloudscapeAssistant() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = () => {
    const updatedMessage = [...messages, { role: 'user', content: value }];
    setMessages(updatedMessage);
    setLoading(true);
    setValue('');
    fetch('http://localhost:3000', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages: updatedMessage }),
    })
      .then(async response => {
        if (response.status === 200) {
          return response.json();
        }
        const data = await response.json();
        throw new Error(data.error);
      })
      .then(response => {
        setMessages(response.messages);
      })
      .catch(err => {
        setErrorMessage(err.message);
      })
      .finally(() => {
        setLoading(false);
        setValue('');
      });
  };

  return (
    <HelpPanel header={<h2>My Assistant</h2>}>
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
          <FormField secondaryControl={<Button onClick={handleSend}>Send</Button>}>
            <Input
              placeholder="Ask me anything"
              value={value}
              onChange={event => setValue(event.detail.value)}
              type="search"
              disabled={loading}
              onKeyUp={({ detail }) => {
                if (detail.keyCode === 13) {
                  handleSend();
                }
              }}
            />
          </FormField>
        </div>
      </Form>
    </HelpPanel>
  );
}
