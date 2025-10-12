export function getClientIp(req: Record<string, any>) {
  const headers = req.headers;

  let ip = headers['cf-connecting-ip'] || headers['x-forwarded-for'];

  if (ip && ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }

  return ip || req.clientIp;
}
