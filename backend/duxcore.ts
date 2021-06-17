import trixi from 'trixi';
import startWs from './src/lib/wsServer';

function main() {
  const app = trixi();
  
  (async () => {
    startWs(8080);
  })();
}

main();