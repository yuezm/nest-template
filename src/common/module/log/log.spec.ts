import { LogService } from '@Log/log.service';
import { readFileLastLine } from '../../../../test/test.util';

function match(str: string, m: string = str): () => boolean {
  // eslint-disable-next-line security/detect-non-literal-regexp
  const re = new RegExp(`^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \[${ str.toUpperCase() }\] ${ m } test!!!!!!$`);
  return function(): boolean {
    return re.test(readFileLastLine());
  };
}

describe('Test LogService Log', () => {
  let logService: LogService = null;

  beforeAll(() => {
    logService = new LogService();
  });

  it('LogService debug', () => {
    const debugMatch = match('debug');

    LogService.debug('debug test!!!!!!');
    expect(debugMatch());
    logService.debug('debug test!!!!!!');
    expect(debugMatch());

    logService.debug('debug test!!!!!!', true);
    expect(match('info', 'debug')());
  });

  it('LogService info', () => {
    const infoMatch = match('info');

    LogService.debug('info test!!!!!!');
    expect(infoMatch());
    logService.info('info test!!!!!!');
    expect(infoMatch());
  });

  it('LogService warn', () => {
    const warnMatch = match('warn');

    LogService.warn('warn test!!!!!!');
    expect(warnMatch());
    logService.warn('warn test!!!!!!');
    expect(warnMatch());
  });

  it('LogService error', () => {
    const errorMatch = match('error');
    LogService.error('error test!!!!!!');
    expect(errorMatch());

    logService.error('error test!!!!!!');
    expect(errorMatch());
  });
});

describe('Test LogService Util', () => {
  it('test serialize', function() {
    expect(LogService.serialize('error!!!')).toBe('error!!!');
    expect(LogService.serialize(new Error('error!!!')).includes('error!!!'));
    expect(LogService.serialize({})).toBe('{}');
  });
});
