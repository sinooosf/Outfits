// Tiny localStorage helpers. Every read is wrapped in try/catch and validated,
// so missing / corrupted / blocked storage silently falls back to defaults.
const PREFIX = 'outfit:'

export function load(key, fallback, validate = () => true) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    if (raw == null) return fallback
    const value = JSON.parse(raw)
    return validate(value) ? value : fallback
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    /* storage full or blocked: the app keeps working in memory */
  }
}
