import { ZodError } from 'zod';
import { APIValidationError } from '../errors';
import { zodAdapter } from '../zodAdapter';

test('ZodErrorをAPIValidationErrorに変換できる', () => {
  // 引数がAPIValidationErrorになっていることを調べたいが、
  // toHaveBeenCalledWithではできないので、モック実装を工夫する。
  const next = jest.fn().mockImplementation((e) => e instanceof APIValidationError);
  zodAdapter(new ZodError([]), null as never, null as never, next);
  expect(next).toHaveReturnedWith(true);
});

test('ZodError以外は素通し', () => {
  const next = jest.fn();
  zodAdapter(1, null as never, null as never, next);
  expect(next).toHaveBeenCalledWith(1);
});