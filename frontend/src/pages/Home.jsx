import React from 'react'
import ProductList from '../components/ProductList'

function Home({ user }) {
  return (
    <div className="home">
        <ProductList user={user} />
    </div>
  )
}

export default Home