import {createElement, bytesToSize, noop} from './utills'

export function upload(selector, options = {}) {
  let files = []
  const onUpload = options.onUpload ?? noop
  const input = document.querySelector(selector)
  const preview = createElement('div', ['card__footer'])
  const open = createElement('button', ['card__btn'], 'Open')
  const upload = createElement('button', ['card__btn', 'primary'], 'Upload')

  input.style.display = 'none'
  upload.style.display = 'none'

  if (options.multi) {
    input.setAttribute('multiple', true)
  }
  if (options.accept && Array.isArray(options.accept)) {
    input.setAttribute('accept', options.accept.join(','))
  }

  input.insertAdjacentElement('afterend', preview)
  input.insertAdjacentElement('afterend', upload)
  input.insertAdjacentElement('afterend', open)

  const triggerInput = () => input.click()

  const changeHandler = event => {
    if (!event.target.files.length) return

    files = Array.from(event.target.files)
    preview.innerHTML = ''
    upload.style.display = 'inline'

    files.forEach(file => {
      if (!file.type.match('image')) return
      const reader = new FileReader()

      reader.onload = event => {
        const src = event.target.result
        preview.insertAdjacentHTML('beforeend', `
          <div
            class="card__image"
            data-type="image">
            <div
              class="remove"
              data-name="${file.name}"
              >&times;</div>
            <img src="${src}" alt="${file.name}">
            <div class="info">
              <span>${file.name}</span>
              <span>${bytesToSize(file.size)}</span>
            </div>
          </div>
        `)
      }
      reader.readAsDataURL(file)
    })
  }

  const removeEl = el => el.remove()

  const removeHandler = event => {
    if (event.target.dataset.name) {
      const el = event.target.closest('[data-type="image"]')
      el.classList.add('fade-out')
      setTimeout(() => removeEl(el), 300)

      const {name} = event.target.dataset
      files = files.filter(file => file.name !== name)

      if (!files.length) {
        upload.style.display = 'none'
      }
    }
  }

  const clearPreview = el => {
    el.style.bottom = '0px'
    el.innerHTML = `
      <div class="info-progress"></div>
    `
  }

  const uploadHandler = () => {
    preview.querySelectorAll('.remove').forEach(el => el.remove())
    const previewInfo = preview.querySelectorAll('.info')
    previewInfo.forEach(clearPreview)
    onUpload(files, previewInfo)
    setTimeout(() => {
      preview.innerHTML = 'Success!'
    }, 4000)
  }

  open.addEventListener('click', triggerInput)
  input.addEventListener('change', changeHandler)
  preview.addEventListener('click', removeHandler)
  upload.addEventListener('click', uploadHandler)
}