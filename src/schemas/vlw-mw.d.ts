import { IDictionary } from ".";

interface SchemaMwApiResponse {
  error?: {
    code: string;
    info: string;
  };
  batchComplete: string;
}

export interface SchemaFetchedDiscography extends SchemaMwApiResponse {
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

export interface SchemaFetchedDiscographyAlbum extends SchemaMwApiResponse {
  continue?: {
    cmcontinue: string;
    continue: string;
  };
  query: {
    pageids: string[];
    pages: IDictionary<{
      pageid: number;
      ns: number;
      title: string;
      categories: {
        ns: number;
        title: string;
      }[];
    }>;
  };
}