import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { withSwal } from 'react-sweetalert2'
import Layout from '@/components/Layout'

function Categories({ swal }) {
  const [name, setName] = useState('')
  const [categories, setCategories] = useState([])
  const [parentCategory, setParentCategory] = useState('')
  const [editedCategory, setEditedCategory] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  function fetchCategories() {
    axios.get(`/api/categories`).then((result) => {
      setCategories(result.data)
    })
  }

  async function saveCategory(ev) {
    ev.preventDefault()
    const data = {
      name,
      parentCategory,
    }

    if (editedCategory) {
      data._id = editedCategory._id
      await axios.put('/api/categories', data)
      setEditedCategory(null)
    } else {
      await axios.post('/api/categories', data)
    }
    setName('')
    fetchCategories()
    setParentCategory('')
  }

  function editCategory(category) {
    setEditedCategory(category)
    setName(category.name)
    setParentCategory(category.parent?._id)
  }

  function deleteCategory(category) {
    swal
      .fire({
        title: 'Are you sure?',
        text: `Do you want to delete ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Yes, Delete!',
        confirmButtonColor: '#d55',
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category
          await axios.delete('/api/categories?_id=' + _id)
          fetchCategories()
        }
      })
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit category ${editedCategory.name}`
          : 'Create new category'}
      </label>
      <form onSubmit={saveCategory}>
        <div className='flex gap-1'>
          <input
            type='text'
            placeholder={'Category name'}
            onChange={(ev) => setName(ev.target.value)}
            value={name}
          />
          <select
            value={parentCategory}
            onChange={(ev) => setParentCategory(ev.target.value)}
          >
            <option value=''>No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option value={category._id}>{category.name}</option>
              ))}
          </select>
        </div>

        <button className='btn-primary py-1' type='submit'>
          Save
        </button>
      </form>
      <table className='basic mt-4'>
        <thead>
          <tr>
            <td>Category name</td>
            <td>Parent category</td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((category) => (
              <tr>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td>
                  <button
                    className='btn-default mr-1'
                    onClick={() => editCategory(category)}
                  >
                    Edit
                  </button>
                  <button
                    className='btn-red'
                    onClick={() => deleteCategory(category)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  )
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />)
