import React, { useState } from 'react'
import './App.css'
import { MdSend /* MdList */ } from 'react-icons/md'

import Amplify, { Auth, Storage } from 'aws-amplify';
import {
  AmplifyAuthenticator,
  AmplifySignOut,
  AmplifySignIn,
  AmplifySignUp,
} from '@aws-amplify/ui-react'
Amplify.configure({
  Auth: {
      identityPoolId: 'us-east-1:fc7f1aee-5459-429b-a509-9c058927191d',
      region: 'us-east-1',
      userPoolId: 'us-east-1_XsOkndCB3',
      userPoolWebClientId: '71aio9ja2nbt28bgj2n9m4th6s',
  },
  Storage: {
      AWSS3: {
          bucket: 'octank-textract-work-order',
          region: 'us-east-1',
      }
  }
});

const App = () => {
  const [name, setName] = useState('')
  const [file, setFile] = useState('')
  const [response, setResponse] = useState('')

  const onChange = (e) => {
    e.preventDefault()
    if (e.target.files[0] !== null) {
      setFile(e.target.files[0])
      setName(e.target.files[0].name)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (file) {
      Storage.put(name, file, {
        /* level: 'protected', */
        contentType: file.type,
      })
        .then((result) => {
          console.log(result)
          setResponse(`Success uploading work order/s: ${name}!`)
        })
        .then(() => {
          document.getElementById('file-input').value = null
          setFile(null)
        })
        .catch((err) => {
          console.log(err)
          setResponse(`Can't upload file: ${err}`)
        })
    } else {
      setResponse(`Files needed!`)
    }
  }

  return (
    <AmplifyAuthenticator>
      
      <AmplifySignIn
        headerText='Octank Field Agents, Sign-In with Your E-Mail Address'
        slot='sign-in'
      />
      <AmplifySignUp
        headerText='Octank Field Agents, Sign-Up with Your Valid E-Mail Address'
        slot='sign-up'
      />
      <div className='header'>
        <h4>
          <a href='/'>Work Order Textraction App</a>
        </h4>
      </div>
      <div className='video-uploader'>
        <form onSubmit={(e) => onSubmit(e)}>
          <p>
            <label className='select-label'>Select File (pdf): </label>
          </p>
          <p>
            <input
              className='video-input'
              type='file'
              id='file-input'
              accept='application/pdf'
              onChange={(e) => onChange(e)}
            />
          </p>
          <button type='submit' className='btn'>
            Upload <MdSend className='btn-icon' />
          </button>
        </form>
      </div>

      {response && (
        <div id='upload-status' className='upload-status'>
          {response}
        </div>
      )}

      <div className='sign-out'>
        <AmplifySignOut />
      </div>
    </AmplifyAuthenticator>
  )
}

export default App