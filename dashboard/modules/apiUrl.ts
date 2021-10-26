export const apiUrl = {
  v1: !process.env.NODE_ENV || process.env.NODE_ENV === 'production' ? "https://api.duxcore.co/v1" : "http://localhost/v1",
};