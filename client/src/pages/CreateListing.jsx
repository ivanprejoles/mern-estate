/* eslint-disable no-unused-vars */
import { useState } from "react";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase.js';

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageURLs: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageURLs.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i <files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises).then((urls) => {
        setFormData({
          ...formData, 
          imageURLs: formData.imageURLs.concat(urls)
        });
        setImageUploadError(false);
        setUploading(false);
      }).catch((err) => {
        setImageUploadError('Image upload failed (2 mb max per iamge)');
        setUploading(false);
      })
      
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  }

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress+'%')
          // console.log(storage )
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          })
        }
      )
    })
  };

  const handleRemovedImage = (index) => {
    setFormData({
      ...formData,
      imageURLs: formData.imageURLs.filter((_, i) => i !== index)
    })
  }
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h2 className='text-3xl feont-semibold text-center my-7'>Create a Listing</h2>
      <form className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input 
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
          />
          <input 
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
          />
          <input 
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
          />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input type='checkbox' id='sale' className='w-5'/>
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='rent' className='w-5'/>
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='paring' className='w-5'/>
              <span>Parking Spot</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='furnished' className='w-5'/>
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='offer' className='w-5'/>
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex item-center gap-2'>
              <input type='number' id='bedrooms' min='1' max='10' required className='p-3 border-gray-300 rounded-lg'/>
              <span>Beds</span>
            </div>
            <div className='flex item-center gap-2'>
              <input type='number' id='bathrooms' min='1' max='10' required className='p-3 border-gray-300 rounded-lg'/>
              <span>Baths</span>
            </div>
            <div className='flex item-center gap-2'>
              <input type='number' id='regularPrice' min='1' max='10' required className='p-3 border-gray-300 rounded-lg'/>
              <div className='flex flex-col item-center'>
                <p>Regular price</p>
                <span className='text-xs'>($ / month)</span>
              </div>
            </div>
            <div className='flex item-center gap-2'>
              <input type='number' id='discountPrice' min='1' max='10' required className='p-3 border-gray-300 rounded-lg'/>
              <div className='flex flex-col item-center'>
                <p>Discounted price</p>
                <span className='text-xs'>($ / month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">Images:
          <span className="font-normal text-gray-600 ml-2">The first image will be the cover (max 6)</span>
          </p>
          <div className="flex gap-4">
            <input 
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file" id="images" 
              accept="image/*"
              multiple 
            />
            <button 
              onClick={handleImageSubmit}
              disabled={uploading}
              type="button"
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-75"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>
          {
            formData.imageURLs.length > 0 && formData.imageURLs.map((url, index) => (
              <div 
                key={url} 
                className="flex justify-between p-3 items-center"
              >
                <img 
                  src={url} 
                  alt='listing image' 
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <button 
                  type="button" 
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                  onClick={() => handleRemovedImage(index)}
                >
                  Delete
                </button>
              </div>
            ))
          }
          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">Create Listing</button>
        </div>
      </form>
    </main>
  )
}
