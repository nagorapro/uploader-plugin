import {upload} from '@/uploader/uploader'
import 'firebase/storage'
import firebase from 'firebase/app'
import {firebaseConfig} from './firebaseconfig' // anonymous file

import '../scss/main.scss'

/*
  ----------------------------------------------
  Your web app's Firebase configuration
  ----------------------------------------------
  const firebaseConfigTemp = {
    apiKey: '...',
    authDomain: '...firebaseapp.com',
    projectId: 'uploader-...',
    storageBucket: 'uploader-....appspot.com',
    messagingSenderId: '...',
    appId: '...'
  }
  ----------------------------------------------
*/

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

upload('#file', {
  multi: true,
  accept: ['.png', '.jpg'],
  onUpload(files, blocks) {
    files.forEach((file, index) => {
      const ref = storage.ref(`images/${file.name}`)
      const task = ref.put(file)
      task.on('state_changed', snapshot => {
        // snapshot
        const percent = ((snapshot.bytesTransferred
          / snapshot.totalBytes)
          * 100).toFixed(0) + '%'
        const block = blocks[index]
          .querySelector('.info-progress')
        block.textContent = percent
        block.style.width = percent
      }, error => {
        // error
        console.log(error)
      }, () => {
        // complete
        task.snapshot.ref.getDownloadURL().then(url => {
          console.log(url)
        })
      })
    })
  }
})