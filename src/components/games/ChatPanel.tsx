import { useState, type FormEvent } from 'react';
import type { Message } from '../../types';
import { formatDate, timeAgo } from '../../utils/format';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';

type ChatPanelProps = {
  messages: Message[];
  onSend: (content: string) => Promise<void>;
};

export default function ChatPanel({ messages, onSend }: ChatPanelProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    await onSend(message.trim());
    setMessage('');
    setSending(false);
  };

  return (
    <Card className="chat-panel">
      <h3>Live Chat</h3>
      <div className="chat-panel__messages" aria-live="polite">
        {messages.map((item) => (
          <article key={item.id} className="chat-message">
            <div className="chat-message__meta">
              <strong>{item.senderName}</strong>
              <span title={formatDate(item.createdAt)}>{timeAgo(item.createdAt)}</span>
            </div>
            <p>{item.content}</p>
          </article>
        ))}
      </div>
      <form className="chat-panel__form" onSubmit={submit}>
        <Input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Say something tactical..."
          aria-label="Chat message"
        />
        <Button type="submit" disabled={sending}>
          {sending ? 'Sending...' : 'Send'}
        </Button>
      </form>
    </Card>
  );
}
