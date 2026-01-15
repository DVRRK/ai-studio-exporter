declare const chrome: any;

/**
 * X-DYNAMIC CORE v3: Self-Contained Extraction Engine
 * 
 * Optimized for AI Studio (MV3 Content Script)
 * Removed all external imports to ensure a flat, injection-ready bundle.
 */

// Local copies of types to avoid module imports
enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

interface ChatMessage {
  role: MessageRole;
  content: string;
  thinking?: string;
  timestamp: string;
}

const cleanText = (text: string | null | undefined): string => {
  return text ? text.trim().replace(/\u200B/g, '') : '';
};

const detectRole = (element: HTMLElement): MessageRole => {
  const html = element.innerHTML.toLowerCase();
  const classes = element.className.toLowerCase();

  if (element.getAttribute('data-role') === 'user' || classes.includes('user')) return MessageRole.USER;
  if (element.getAttribute('data-role') === 'model' || classes.includes('model')) return MessageRole.MODEL;

  // AI Studio specific selectors
  if (element.querySelector('ms-message-content') || element.querySelector('.model-message')) {
    return MessageRole.MODEL;
  }

  const style = window.getComputedStyle(element);
  if (style.alignSelf === 'flex-end' || style.textAlign === 'right') return MessageRole.USER;

  return (html.includes('<pre') || html.includes('<code') || html.length > 500) ? MessageRole.MODEL : MessageRole.USER;
};

const scrapeChat = (includeThinking: boolean): ChatMessage[] => {
  const messages: ChatMessage[] = [];

  const selectors = ['ms-message', '.message-row', '.turn-container', '.chat-item'];
  let messageNodes: HTMLElement[] = [];

  for (const selector of selectors) {
    const found = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
    if (found.length > 0) {
      messageNodes = found;
      break;
    }
  }

  if (messageNodes.length === 0) {
    const main = document.querySelector('main') || document.body;
    messageNodes = Array.from(main.querySelectorAll('div > div'))
      .filter(el => (el as HTMLElement).innerText.length > 10) as HTMLElement[];
  }

  messageNodes.forEach((el) => {
    const role = detectRole(el);
    let thinking = '';

    const thoughtBlocks = el.querySelectorAll('details, .thought, .thinking, .reasoning');
    thoughtBlocks.forEach(block => {
      thinking += (block as HTMLElement).innerText + '\n\n';
    });

    const contentNode = el.querySelector('ms-message-content') || el;
    const clonedContent = contentNode.cloneNode(true) as HTMLElement;

    clonedContent.querySelectorAll('details, .thought, .thinking, .reasoning, button, nav').forEach(n => n.remove());

    const content = cleanText(clonedContent.innerText);

    if (content || thinking) {
      messages.push({
        role,
        content: content || '[No text content]',
        thinking: includeThinking ? thinking.trim() : undefined,
        timestamp: new Date().toISOString()
      });
    }
  });

  return messages;
};

const getTitle = (): string => {
  const selectors = ['header h1', 'input[aria-label="Rename prompt"]', '.chat-title'];
  for (const s of selectors) {
    const el = document.querySelector(s);
    if (el) return (el as any).value || (el as any).innerText || '';
  }
  return document.title.replace(' - Google AI Studio', '') || 'AI Studio Chat';
};

// Message Listener registration using standard Chrome API
(chrome as any).runtime.onMessage.addListener((request: any, sender: any, sendResponse: any) => {
  if (request.type === 'EXTRACT_CHAT') {
    try {
      const messages = scrapeChat(request.includeThinking);
      if (messages.length === 0) {
        sendResponse({ success: false, error: "No messages found. Ensure your conversation is visible." });
      } else {
        sendResponse({ success: true, data: messages, title: getTitle() });
      }
    } catch (e) {
      sendResponse({ success: false, error: (e as Error).message });
    }
    return true;
  }
});
