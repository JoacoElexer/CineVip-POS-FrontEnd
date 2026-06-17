export function generateCorrelationId() {
  return `cid-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export function getCorrelationId() {
  let cid = sessionStorage.getItem('correlationId')
  if (!cid) {
    cid = generateCorrelationId()
    sessionStorage.setItem('correlationId', cid)
  }
  return cid
}