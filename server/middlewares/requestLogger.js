export default function requestLogger(req, res, next) {
  try {
    const { method, url } = req;
    // Log only non-sensitive headers (remove authorization value)
    const headers = { ...req.headers };
    if (headers.authorization) headers.authorization = headers.authorization.replace(/(.{6}).+/, '$1...[redacted]');
    console.log(`[req] ${method} ${url} - headers:`, headers, 'body:', req.body);
  } catch (e) {
    // ignore logging errors
  }
  next();
}
