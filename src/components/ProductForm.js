import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
}) {
  const router = useRouter()

  const [title, setTitle] = useState(existingTitle || '')
  const [description, setDescription] = useState(existingDescription || '')
  const [price, setPrice] = useState(existingPrice || '')
  const [goToProducts, setGoToProducts] = useState(false)

  async function saveProduct(ev) {
    ev.preventDefault()
    const data = {
      title,
      description,
      price,
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
