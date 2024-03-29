import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Spinner from './Spinner'
import { ReactSortable } from 'react-sortablejs'

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
}) {
  const router = useRouter()

  const [title, setTitle] = useState(existingTitle || '')
  const [description, setDescription] = useState(existingDescription || '')
  const [price, setPrice] = useState(existingPrice || '')
  const [images, setImages] = useState(existingImages || [])
  const [goToProducts, setGoToProducts] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState(assignedCategory || '')

  useEffect(() => {
    axios.get('/api/categories').then((result) => {
      setCategories(result.data)
    })
  }, [])

  async function saveProduct(ev) {
    ev.preventDefault()
    const data = {
      title,
      description,
      price,
      images,
      category,
    }

    if (_id) {
      //update
      await axios.put(`/api/products`, { ...data, _id })
    } else {
      //create
      await axios.post(`/api/products`, data)
    }
    setGoToProducts(true)
  }

  async function uploadImages(ev) {
    const files = ev.target?.files

    if (files?.length > 0) {
      setIsUploading(true)
      const data = new FormData()

      for (const file of files) {
        data.append('file', file)
      }
      const res = await axios.post('/api/upload', data)
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links]
      })
      setIsUploading(false)
    }
  }

  function updateImagesOrder(images) {
    setImages(images)
  }

  if (goToProducts) {
    router.push(`/products`)
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        type='text'
        placeholder='Product name'
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />

      <label>Category</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value=''>Uncategorized</option>
        {categories.length > 0 &&
          categories.map((c) => <option value={c._id}>{c.name}</option>)}
      </select>

      <label>Photos</label>
      <div className='mb-2 flex flex-wrap gap-1'>
        <ReactSortable
          className='flex flex-wrap gap-1'
          list={images}
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div
                key={link}
                className='h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200'
              >
                <img src={link} alt='' className='rounded-lg' />
              </div>
            ))}
        </ReactSortable>

        {isUploading && (
          <div className='h-24 flex items-center'>
            <Spinner />
          </div>
        )}
        <label className='w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5'
            />
          </svg>
          <div>Add image</div>
          <input className='hidden' type='file' onChange={uploadImages} />
        </label>
      </div>

      <label>Description</label>
      <textarea
        placeholder='Description'
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />

      <label>Price (in USD)</label>
      <input
        type='number'
        placeholder='Price'
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />

      <button type='submit' className='btn-primary'>
        Save
      </button>
    </form>
  )
}
