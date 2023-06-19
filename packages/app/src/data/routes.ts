export type AppRoute = keyof typeof appRoutes

// Object to be used as source of truth to handel application routes
// each page should correspond to a key and each key should have
// a `path` property to be used as patter matching in <Route path> component
// and `makePath` method to be used to generate the path used in navigation and links
export const appRoutes = {
  listAll: {
    path: '/',
    makePath: (filters?: string) =>
      hasFilterQuery(filters) ? `/?${filters}` : `/`
  },
  filters: {
    path: '/filters',
    makePath: (filters?: string) =>
      hasFilterQuery(filters) ? `/filters/?${filters}` : `/filters`
  },
  details: {
    path: '/:customerId',
    makePath: (customerId: string) => `/${customerId}`
  },
  editAddress: {
    path: '/:customerId/addresses/:addressId/edit',
    makePath: (customerId: string, addressId: string) =>
      `/${customerId}/addresses/${addressId}/edit`
  }
}

function hasFilterQuery(filters?: string): filters is string {
  return Array.from(new URLSearchParams(filters)).length > 0
}
