import { A, EmptyState } from '@commercelayer/app-elements'

interface Props {
  scope?: 'history' | 'filters' | 'list'
}

export function ListEmptyState({ scope = 'history' }: Props): JSX.Element {
  if (scope === 'list') {
    return (
      <EmptyState
        title='All good here'
        description={
          <div>
            <p>There are no customers for the current list.</p>
          </div>
        }
      />
    )
  }

  if (scope === 'filters') {
    return (
      <EmptyState
        title='No customers found!'
        description={
          <div>
            <p>
              We didn't find any customers matching the current filters
              selection.
            </p>
          </div>
        }
      />
    )
  }

  return (
    <EmptyState
      title='No customers yet!'
      description={
        <div>
          <p>Add an order with the API, or use the CLI.</p>
          <A
            target='_blank'
            href='https://docs.commercelayer.io/core/v/api-reference/customers'
            rel='noreferrer'
          >
            View API reference.
          </A>
        </div>
      }
    />
  )
}
