describe('getClientName', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns CLIENT_NAME when set', async () => {
    process.env.CLIENT_NAME = 'Jane Smith';
    const { getClientName } = await import('@/lib/config');
    expect(getClientName()).toBe('Jane Smith');
  });

  it('returns default "Austin Mais" when CLIENT_NAME is unset', async () => {
    delete process.env.CLIENT_NAME;
    const { getClientName } = await import('@/lib/config');
    expect(getClientName()).toBe('Austin Mais');
  });

  it('returns empty string when CLIENT_NAME is set to empty', async () => {
    process.env.CLIENT_NAME = '';
    const { getClientName } = await import('@/lib/config');
    expect(getClientName()).toBe('');
  });
});
