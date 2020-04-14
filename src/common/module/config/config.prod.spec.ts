import { unlinkSync, writeFileSync } from 'fs';

process.env.NODE_ENV = 'production';
writeFileSync('./.env', 'LOG_PATH_TEST=logs');

import { ConfigService, ConfigService as CS } from '@Config/config.service';

describe('Test ConfigService ENV_PROD', () => {
  it('ConfigService 静态 get ENV_PROD', () => {
    expect(CS.get('LOG_PATH')).toBe('./logs');
  });

  it('ConfigService .env', function() {
    expect(ConfigService.get('LOG_PATH')).toBe('./logs');
    expect(ConfigService.get('LOG_PATH_TEST')).toBe('logs');
    unlinkSync('./.env');
  });
});
process.env.NODE_ENV = 'test';
