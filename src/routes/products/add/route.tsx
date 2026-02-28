import { createFileRoute } from '@tanstack/react-router'
import ProductForm from '../-components/ProductForm';
import { useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';

export const Route = createFileRoute('/products/add')({
  component: RouteComponent,
})

function RouteComponent() {
  const handleAdd = useMutation(api.products.create)

  return (
    <ProductForm
      title="Add New Product"
      onSubmit={async (data) => {
        const { _id, _creationTime, ...product } = data;
        void handleAdd({ product });
      }}
    />
  );
}

