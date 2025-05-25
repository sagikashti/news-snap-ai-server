declare module 'unfluff' {
  interface ExtractedData {
    title: string | null;
    author: string | null;
    date: string | null;
    text: string | null;
    description: string | null;
    publisher: string | null;
    [key: string]: any;
  }

  function unfluff(html: string): ExtractedData;
  export = unfluff;
}
