import { Injectable } from '@nestjs/common';
import {
  createClient,
  dedupExchange,
  cacheExchange,
  fetchExchange,
} from '@urql/core';
import fetch from 'node-fetch';
@Injectable()
export class AppService {
  private client: any;

  constructor() {
    this.client = createClient({
      url: 'https://api.thegraph.com/subgraphs/name/sotatek-anhmai2/web3-learning',
      fetch: fetch,
      exchanges: [dedupExchange, cacheExchange, fetchExchange],
    });
  }

  async getTransferData(src: string) {
    const query = `
      query transfers($src: Bytes) {
        transferEntities(first: 1000, where: { src: $src }) {
          id
          type
          amount
          time
          src
        }
      }
    `;
    const transfer = await this.getQuery(query, {
      src,
    });
    return transfer;
  }

  getQuery(query: string, variable: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client
        .query(query, variable)
        .toPromise()
        .then((result: any) => {
          resolve(result.data.transferEntities);
        })
        .catch((error: any) => {
          console.log(error);
          reject(error);
        });
    });
  }
}
