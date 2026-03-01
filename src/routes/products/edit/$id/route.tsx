import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query';
import { convexQuery } from '@convex-dev/react-query';
import { api } from 'convex/_generated/api';
import { useMutation } from 'convex/react';
import ProductForm from '../../-components/ProductForm';
import type { Id } from 'convex/_generated/dataModel';

export const Route = createFileRoute('/products/edit/$id')({
  component: RouteComponent,
})


function RouteComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const { data: product, isFetching: loading, isError } = useSuspenseQuery(convexQuery(api.products.getById, { id: id as Id<"products"> }))

  const handleUpdate = useMutation(api.products.update)

  if (isError) {
    navigate({ to: '/products' })
    return
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-900"></div>
    </div>
  );


  return <ProductForm title="Edit Product" initialData={product!}
    onSubmit={async data => {
      const { _creationTime, ...rest } = data
      void handleUpdate({ product: rest })

    }} />;
}

