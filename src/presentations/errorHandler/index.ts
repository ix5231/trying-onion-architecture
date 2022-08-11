/**
 * エラーハンドラーの定義
 */

import { errorHandler } from './errorHandler';
import { zodAdapter } from './zodAdapter';

export const handler = [zodAdapter, errorHandler];