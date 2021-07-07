export const apiUrl = {
  v1: !process.env.NODE_ENV || process.env.NODE_ENV === 'production' ? "https://api.duxcore.co/v1" : "http://localhost:6969/v1",
};

export const wsUrl = (!process.env.NODE_ENV || process.env.NODE_ENV === 'production' ? "wss://api.duxcore.co/socket" : "ws://localhost:7418");
