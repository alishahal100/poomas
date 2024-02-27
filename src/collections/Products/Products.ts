import {
  AfterChangeHook,
  BeforeChangeHook,
} from 'payload/dist/collections/config/types'
import { PRODUCT_CATEGORIES } from '../../config'
import { Access, CollectionConfig } from 'payload/types'
import { Product, User } from '../../payload-types'
import { stripe } from '../../lib/stripe'


const addUser: BeforeChangeHook<Product> = async ({
  req,
  data,
}) => {
  const user = req.user

  return { ...data, user: user.id }
}

const syncUser: AfterChangeHook<Product> = async ({
  req,
  doc,
}) => {
  const fullUser = await req.payload.findByID({
    collection: 'users',
    id: req.user.id,
  })

  if (fullUser && typeof fullUser === 'object') {
    const { products } = fullUser

    const allIDs = [
      ...(products?.map((product) =>
        typeof product === 'object' ? product.id : product
      ) || []),
    ]

    const createdProductIDs = allIDs.filter(
      (id, index) => allIDs.indexOf(id) === index
    )

    const dataToUpdate = [...createdProductIDs, doc.id]

    await req.payload.update({
      collection: 'users',
      id: fullUser.id,
      data: {
        products: dataToUpdate,
      },
    })
  }
}

const isAdminOrHasAccess =
  (): Access =>
  ({ req: { user: _user } }) => {
    const user = _user as User | undefined

    if (!user) return false
    if (user.role === 'admin') return true

    const userProductIDs = (user.products || []).reduce<
      Array<string>
    >((acc, product) => {
      if (!product) return acc
      if (typeof product === 'string') {
        acc.push(product)
      } else {
        acc.push(product.id)
      }

      return acc
    }, [])

    return {
      id: {
        in: userProductIDs,
      },
    }
  }

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: isAdminOrHasAccess(),
    update: isAdminOrHasAccess(),
    delete: isAdminOrHasAccess(),
  },
  hooks: {
    afterChange: [syncUser],
    beforeChange: [
      addUser,
      async (args) => {
        if (args.operation === 'create') {
          const data = args.data as Product

          const createdProduct =
            await stripe.products.create({
              name: data.name,
              default_price_data: {
                currency: 'AED',
                unit_amount: Math.round(data.price * 100),
              },
            })

          const updated: Product = {
            ...data,
            stripeId: createdProduct.id,
            priceId: createdProduct.default_price as string,
          }

          return updated
        } else if (args.operation === 'update') {
          const data = args.data as Product

          const updatedProduct =
            await stripe.products.update(data.stripeId!, {
              name: data.name,
              default_price: data.priceId!,
            })

          const updated: Product = {
            ...data,
            stripeId: updatedProduct.id,
            priceId: updatedProduct.default_price as string,
          }

          return updated
        }
      },
    ],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
    
    {
      name: 'name',
      label: 'Product Name',
      type: 'text',
      required: true,
    },
    {
      name: 'contactnumber',
      type: 'text',
      label:'contact number',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Product details',
    },
    {
      name: 'Location',
      type: 'text',
      label: 'Location',
      required: true
    },
    {
      name: 'price',
      label: 'Price in AED',
      min: 0,
     
      type: 'number',
      required: true,
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      options: PRODUCT_CATEGORIES.map(
        ({ label, value }) => ({ label, value })
      ),
      required: true,
      
        
    },
    {
      name: 'Year',
      label: 'manufacturing year',
      type: 'number', // You can change this to any appropriate input type
      admin: {
        condition: (value) => value.category === 'vehicles', // Show this field only if 'vehicle' category is selected
      },
    },
    {
      name: 'Color',
      label: 'Interior color',
      type: "text", // You can change this to any appropriate input type
      admin: {
        condition: (value) => value.category === 'vehicles', // Show this field only if 'vehicle' category is selected
      },
    },
    {
      name: 'exteriorColor',
      label: 'exterior color',
      type: "text", // You can change this to any appropriate input type
      admin: {
        condition: (value) => value.category === 'vehicles', // Show this field only if 'vehicle' category is selected
      },
    },
    {
      name: 'variant',
      label: 'variant',
      type: "text", // You can change this to any appropriate input type
      admin: {
        condition: (value) => value.category === 'vehicles', // Show this field only if 'vehicle' category is selected
      },
    },
    {
      name: 'trim',
      label: 'trim',
      type: "text", // You can change this to any appropriate input type
      admin: {
        condition: (value) => value.category === 'vehicles', // Show this field only if 'vehicle' category is selected
      },
    },
    {
      name: 'bodyType',
      label: 'Body Type',
      type: "text", // You can change this to any appropriate input type
      admin: {
        condition: (value) => value.category === 'vehicles', // Show this field only if 'vehicle' category is selected
      },
    },
    {
      name: 'sellerType',
      label: 'Seller Type',
      type: "text", // You can change this to any appropriate input type
      admin: {
        condition: (value) => value.category === 'vehicles', // Show this field only if 'vehicle' category is selected
      },
    },
    {
      name: 'Kilometers',
      label: 'kilometers driven',
      type: 'number', // You can change this to any appropriate input type
      admin: {
        condition: (value) => value.category === 'vehicles', // Show this field only if 'vehicle' category is selected
      },
    },
    {
      name: 'seatingCapacity',
      label: 'Seating Capacity',
      type: 'number', // You can change this to any appropriate input type
      admin: {
        condition: (value) => value.category === 'vehicles', // Show this field only if 'vehicle' category is selected
      },
    },
    {
      name: 'fuelType',
      label: 'Fuel type',
      type: 'select',
      options: ['petrol', 'diesel', 'electric', 'hybrid'],
      defaultValue: 'petrol',
      admin: {
        condition: (values) => values.category === 'vehicles', // Show this field only if 'vehicles' category is selected
      },
    },
    
    {
      name: 'transmission', 
      label:'Transmission Type',
      type: 'select',
      options: ['automatic', 'manual'],
      defaultValue: 'automatic', // You can change this to any appropriate input type
      admin: {
        condition: (value) => value.category === 'vehicles', // Show this field only if 'vehicle' category is selected
      },
    },
   
   
    {
      name: 'product_files',
      label: 'Product file(s)',
      type: 'relationship',
      required: false,
      relationTo: 'product_files',
      hasMany: false,
    },
    {
      name: 'approvedForSale',
      label: 'Product Status',
      type: 'select',
      defaultValue: 'pending',
      access: {
        create: ({ req }) => req.user.role === 'admin',
        read: ({ req }) => req.user.role === 'admin',
        update: ({ req }) => req.user.role === 'admin',
      },
      options: [
        {
          label: 'Pending verification',
          value: 'pending',
        },
        {
          label: 'Approved',
          value: 'approved',
        },
        {
          label: 'Denied',
          value: 'denied',
        },
      ],
    },
    {
      name: 'priceId',
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'stripeId',
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Product images',
      minRows: 1,
      maxRows: 10,
      required: true,
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}
