import { ConfigService } from '@Config/config.service';

describe('Test ConfigService', () => {
  it('ConfigService 静态 get ', () => {
    expect(ConfigService.get('LOG_PATH')).toBe('./logs');
  });

  it('ConfigService 实例 get ', () => {
    expect(new ConfigService().get('LOG_PATH')).toBe('./logs');
  });

  it('ConfigService 获取环境变量 ', () => {
    expect(ConfigService.get('npm_package_name')).toBe(process.env[ 'npm_package_name' ]);
  });
});
