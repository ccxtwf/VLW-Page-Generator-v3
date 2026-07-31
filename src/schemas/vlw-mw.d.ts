interface MwApiResponse {
  error?: {
    code: string;
    info: string;
  };
  batchComplete: string;
}

export interface FetchedMwDiscography extends MwApiResponse {
  continue?: {
    cmcontinue: string;
    continue: string;
  };
  query: {
    categorymembers: {
      ns: number;
      title: string;
      sortkeyprefix?: string;
    }[];
  };
}

export interface FetchedMwDiscographyAlbum extends MwApiResponse {
  continue?: {
    cmcontinue: string;
    continue: string;
  };
  query: {
    pageids: string[];
    pages: Record<
      string,
      {
        pageid: number;
        ns: number;
        title: string;
        categories: {
          ns: number;
          title: string;
        }[];
      }
    >;
  };
}