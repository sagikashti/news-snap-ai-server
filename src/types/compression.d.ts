declare module 'compression' {
  import { RequestHandler } from 'express';

  interface CompressionOptions {
    filter?: (req: any, res: any) => boolean;
    threshold?: number | string;
    level?: number;
    memLevel?: number;
    strategy?: number;
    chunkSize?: number;
    windowBits?: number;
    [key: string]: any;
  }

  function compression(options?: CompressionOptions): RequestHandler;
  export = compression;
}
