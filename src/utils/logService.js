import logger from './logger'
import { getCorrelationId } from './correlationId'

// Datos sensibles que NUNCA deben aparecer en logs (checklist A09)
const SENSITIVE_KEYS = ['password', 'token', 'jwt', 'authorization', 'secret']

function sanitize(data) {
  if (!data || typeof data !== 'object') return data
  const clean = { ...data }
  SENSITIVE_KEYS.forEach(key => {
    if (clean[key]) clean[key] = '[REDACTED]'
  })
  return clean
}

function buildEntry(module, action, data) {
  return {
    correlationId: getCorrelationId(),
    module,
    action,
    timestamp: new Date().toISOString(),
    ...sanitize(data)
  }
}

const logService = {
  info(module, action, data) {
    logger.info(buildEntry(module, action, data))
  },
  warn(module, action, data) {
    logger.warn(buildEntry(module, action, data))
  },
  error(module, action, error, data) {
    logger.error(buildEntry(module, action, {
      errorMessage: error?.message || String(error),
      ...data
    }))
  },
  debug(module, action, data) {
    logger.debug(buildEntry(module, action, data))
  }
}

export default logService