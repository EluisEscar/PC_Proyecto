import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(() => {
    controller = new HealthController();
  });

  it('responde con estado ok', () => {
    const res = controller.check();
    expect(res.status).toBe('ok');
  });

  it('incluye un timestamp ISO válido', () => {
    const res = controller.check();
    expect(() => new Date(res.timestamp).toISOString()).not.toThrow();
  });
});
