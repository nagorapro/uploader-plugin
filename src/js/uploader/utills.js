export function createElement(tag, classes = [], content) {
  const el = document.createElement(tag)
  if (classes.length) {
    el.classList.add(...classes)
  }
  if (content) {
    el.textContent = content
  }
  return el
}

export function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (!bytes) return '0 Byte'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}

export function noop() {}