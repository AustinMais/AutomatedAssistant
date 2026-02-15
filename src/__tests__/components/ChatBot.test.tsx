import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatBot from '@/components/ChatBot';

const mockSendMessage = jest.fn();

jest.mock('@ai-sdk/react', () => ({
  useChat: () => ({
    messages: [],
    sendMessage: mockSendMessage,
    status: 'ready',
    error: null,
  }),
}));

describe('ChatBot', () => {
  beforeEach(() => {
    mockSendMessage.mockClear();
  });

  describe('floating mode', () => {
    it('renders Site Concierge header when expanded', async () => {
      render(<ChatBot clientName="Austin Mais" floating />);
      const button = screen.getByRole('button', { name: /open chat/i });
      await userEvent.click(button);
      expect(screen.getByRole('heading', { name: /Site Concierge/i })).toBeInTheDocument();
    });

    it('shows client name in subtitle', async () => {
      render(<ChatBot clientName="Jane Doe" floating />);
      const button = screen.getByRole('button', { name: /open chat/i });
      await userEvent.click(button);
      expect(screen.getByText(/Ask about Jane Doe's resume/)).toBeInTheDocument();
    });

    it('renders chat icon button when collapsed', () => {
      render(<ChatBot floating />);
      expect(screen.getByRole('button', { name: /open chat/i })).toBeInTheDocument();
    });
  });

  describe('inline mode', () => {
    it('renders Site Concierge header', () => {
      render(<ChatBot clientName="Austin Mais" />);
      expect(screen.getByRole('heading', { name: /Site Concierge/i })).toBeInTheDocument();
    });

    it('shows placeholder text', () => {
      render(<ChatBot clientName="Austin Mais" />);
      expect(screen.getByText(/Go ahead, grill me/i)).toBeInTheDocument();
    });
  });
});
