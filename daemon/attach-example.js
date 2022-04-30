const corekey = "PJoVIu6l1/CkbTYqg1lHo6dJvwh7jOQJA6zQZZ57e6GEnTA7tL1DR3FGo/OpIXccMQaGB0ILD1kqnbPga3EsgfdeHS5UerJ0BZpuvGNv+XWbB03UFhL3JPQZjEvqJAvsx8P/UVZp5nuVLeZLB16hpGnXJDjYnw/KequjNL9Ta4sRkYy+1d/GadyQqGjGYUgo2ok+bPcjavaTOK+NgedP5rbXzY14ype2KBujs079/6iTVllPWbi2LAxZCDACMW/BMnZEMD0FCn8Tx5r2SrXMjJgPXUa7FGGwg58USNW60IzKLWdbFnyd3AFhIWeY2Kh+HqZCLf7svah4j8ZI73Fls39j32i/oBjJRUXUF8b2OdIeI69egjayfGKGcQyhvDfxgrQKQQrVXmZqUEvA7bwWFZ4tGX+vb4Ad6zJkVXsZOxdf+VS3GHa+dlPias/J0R9vZnavUURt2+reweuQfTDgZTzp8jygWDwoJL+a8plxzxJXSZKGN0HkLi4EM2C38Yi2z/kAAXT2a8FcOAKegdvFij+IRMDINpXNeBz7PRyDRfPza/HYqEq5bQBWLAqhzz4W5Yet1AL0cZz9vNy5hFdsJpqBiFY27zZ2EjgYNFXBbpM5c25/LKd2k1s/1wBBY8oZJdExS2lLXDYh4OEFMl0DVHbE2gxzo8hrpI2xf69sEm+CI6asqALQmYocWu2TdyGgD+VpNIKT9N376a1uLSt4gDZ5Nj+bEOBm9Y413UWY4f8HUPYN31QyfDmmXvt/LTfArfqsaPihqPLQX5FaJXPiXn3d6WAJYzCuPCpRlCzJliKRbof9wQQCljUhcoZEANIC63Y2EJhdanBKbjGM4F57Ylaizuu+WJES+l8oEqD9hXG2lJ2iZQK9sPCDWbglYWrreL3smDDLwbT6FXYXZ5Jm0mD8P9VoalrhYddeKdY2BIlmhGyFQN5KtZrFi/Ag6N8S1x9n6GMyNo5quZcnNLn/b3dwVWcrX/aZgeXWki43j9ag6OjoG9GFOeQBVus4D5jPUYagfLnb7C0f4IJG7wg7OBlUsJVfB8/TNMf5s924S3pC/47w0B0mY0gcr0pxu27bpSM7IBlA89E8wfdtiZDPci6DTV3u8ftUrwr3ZoWQAI6VVIJYyjOZw7qn35raJYmaqIE/Uf3k57uvTWN3CGmy3j9/3bRgtKnQjFTrTZ6S4ai6yl1bnfgaP6X3Qc62a2q8g+enTwBIPkR95SyddlRPxn0lHUNZjSpRzi1wIxZVm1E/hwgkNUUJwpgbTb6XokeUa9PVdcx1scig+Xtgu/UdGHy8r4X6MAauPLI9YCwMoaviPOVHfr5L/Vk3FGhNEuMhsx31F9w1q/Wcrhcqy/DmRg==";
const container = "0f81706e1de7b2067b0ef7d8b988873fdcc1f197b219e636461ad112525f09c9";

const ws = new WebSocket("ws://localhost:8001");

const sendjson = json => ws.send(JSON.stringify(json));
const sendblob = data => ws.send(new Blob([data]));

ws.onopen = () => {
  console.log("opened");

  sendjson({
    corekey: corekey,
    type: "attach",
    data: container,
  });
  sendblob("ls /\n");
};

ws.onmessage = async x => {
  if (typeof (x.data) == "string") {
    console.log("string", x);
  }

  if (x.data instanceof Blob) {
    console.log("blob", await x.data.text());
  }
};
