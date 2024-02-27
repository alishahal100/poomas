'use client'

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import ProductReel from '@/components/ProductReel'
import { PRODUCT_CATEGORIES } from '@/config'

import { useState } from 'react';

interface FormData {
  category: string;
  name: string;
  model: string;
  priceRange: string;
  location: string;
}
type Param = string | string[] | undefined

interface ProductsPageProps {
  searchParams: { [key: string]: Param }
}

const parse = (param: Param) => {
  return typeof param === 'string' ? param : undefined
}

const ProductsPage = ({
  searchParams,
}: ProductsPageProps) => {
  const category = parse(searchParams.category)
  const label = PRODUCT_CATEGORIES.find(({ value }) => value === category)?.label

  const [formData, setFormData] = useState<FormData>({
    category: label ?? '',
    name: '',
    model: '',
    priceRange: '',
    location: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { category, name, model, priceRange, location } = formData;
    const message = ` Name: ${name} Model: ${model} Price Range: ${priceRange} Location: ${location}`;
    const whatsappLink = `https://wa.me/+971568066069?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
  };

  return (
    <MaxWidthWrapper>
      <ProductReel
        title={label ?? 'Discover Top-Quality Listings'}
        query={{
          category, // Filter by category
          limit: 40,
        }}
      />
      <div className="w-full h-auto text-center pt-8">
        <h1 className="text-lg font-semibold mb-4">
          Couldn&apos;t find what you are looking for!
        </h1>
        <p className="text-gray-700">
          Please fill out the form below with your product requirements, and we&apos;ll notify you when it becomes available.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 mx-auto max-w-md border-dashed rounded shadow-sm py-6 px-6 bg-white">
          
          <div className="mb-4">
            <input type="text" name="name" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} value={formData.name} placeholder='Product name' />
          </div>
          <div className="mb-4">
              <input type="text" name="model" id="model" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} value={formData.model} placeholder='Product Model (in case of vehicles)' />
          </div>
          <div className="mb-4">
            
            <input type="text" name="priceRange" id="priceRange" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} value={formData.priceRange} placeholder='Price' />
          </div>
          <div className="mb-4">
                    <input type="text" name="location" id="location" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} value={formData.location} placeholder='Location' />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Send</button>
        </form>
      </div>
    </MaxWidthWrapper>
  );
}

export default ProductsPage;
