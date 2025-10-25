/* eslint-disable no-console */
import postmanToOpenApi from 'postman-to-openapi';
import YAML from 'yaml';
import config from '../src/config';
import path from 'path';
import fs from 'fs';

const postmanPath = path.resolve(
  process.cwd(),
  `postman/collections/${config.server.postman_docs_id}.json`,
);

postmanToOpenApi(postmanPath)
  .then((yamlStr: string) => {
    const json = YAML.parse(yamlStr);

    json.servers = [
      {
        url: config.url.href + '/api/v1',
      },
    ];

    const outputPath = path.resolve(process.cwd(), 'public/api-v1.json');
    fs.writeFileSync(outputPath, JSON.stringify(json, null, 2));
  })
  .catch(console.error);
