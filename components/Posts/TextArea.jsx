import { Fragment, useState, useRef } from 'react'
import { PaperClipIcon } from '@heroicons/react/solid';
import { db,storage } from '../../firebase-config';
import { addDoc, arrayUnion, collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import {ref, getDownloadURL, uploadBytes} from "@firebase/storage";
import Image from 'next/image';



const TextArea = () => {

  const [imageToUpload, setImageToUpload] = useState([]);

  const handleImageChange = (e) => {
    setImageToUpload(e.target.files[0]);
  }
    
const postRef = useRef(null);

const handleUpload = async () => {
  const docRef = await addDoc(collection(db, 'posts'),{
    post: postRef.current.value,
    timestamp: serverTimestamp(),
  })
  await Promise.all(
    imageToUpload.map(async (image) => {
      const imageRef = ref(storage, `posts/${docRef.id}/${image.path}`);
      uploadBytes(imageRef, image, "data_url").then(async() => {
        const downloadURL = await getDownloadURL(imageRef)
        await updateDoc(doc(db, "posts", docRef.id), {
          images: arrayUnion(downloadURL)
        })

      })

    })

  )
  postRef.current.value = '';
  setImageToUpload([]);
}



  return (
    <>
    <div className='sm:w-4/5 lg:w-2/5 '>
    <div className="flex items-start space-x-4">
      <div className="min-w-0 flex-1">
        <form onSubmit={e => e.preventDefault()} className="relative">
          <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
            <label htmlFor="comment" className="sr-only">
              Post Something
            </label>
            <textarea
              className="block w-full py-3 border-0 resize-none focus:ring-0 sm:text-sm"
              id="comment"
              rows={3}
              name="comment"
              ref={postRef}
              placeholder="Post something..."
              defaultValue={''}
            />

            
            <div className="py-2" aria-hidden="true">
              
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 inset-x-0 pl-3 pr-2 py-2 flex justify-between">
            <div className="flex items-center space-x-5">
              <div className="flex items-center">
                <button
                  className="-m-2.5 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-500"
                  type="button"
                >
                  <input type="file" onChange={handleImageChange} id="upload" hidden/>
                  <label htmlFor="upload">
                  <PaperClipIcon className="h-5 w-5" aria-hidden="true" />
                  </label>
                  <span className="sr-only">Attach a file</span>
                </button>
              </div>
          
            </div>
            <div className="flex-shrink-0">
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                type="submit"
                onClick={handleUpload}
              >
                Post
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    </div>
    </>
  )
}

export default TextArea;