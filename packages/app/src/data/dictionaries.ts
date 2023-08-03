import type { Customer, Order } from '@commercelayer/sdk'
import { type UITriggerAttributes } from './status'

export function getCustomerStatusName(status: Customer['status']): string {
  const dictionary: Record<typeof status, string> = {
    prospect: 'Prospect',
    acquired: 'Acquired',
    repeat: 'Repeat'
  }

  return dictionary[status]
}

/** Ex-Orders */

export function getTransactionPastTense(
  type: NonNullable<Order['transactions']>[number]['type']
): string {
  const dictionary: Record<typeof type, string> = {
    authorizations: 'authorized',
    captures: 'captured',
    refunds: 'refunded',
    voids: 'voided'
  }

  return dictionary[type]
}

export function getOrderStatusName(status: Order['status']): string {
  const dictionary: Record<typeof status, string> = {
    approved: 'Approved',
    cancelled: 'Cancelled',
    draft: 'Draft',
    pending: 'Pending',
    placed: 'Placed',
    editing: 'Editing'
  }

  return dictionary[status]
}

export function getPaymentStatusName(status: Order['payment_status']): string {
  const dictionary: Record<typeof status, string> = {
    authorized: 'Authorized',
    paid: 'Paid',
    unpaid: 'Unpaid',
    free: 'Free',
    voided: 'Voided',
    refunded: 'Refunded',
    partially_authorized: 'Part. authorized',
    partially_paid: 'Part. paid',
    partially_refunded: 'Part. refunded',
    partially_voided: 'Part. voided'
  }

  return dictionary[status]
}

export function getFulfillmentStatusName(
  status: Order['fulfillment_status']
): string {
  const dictionary: Record<typeof status, string> = {
    unfulfilled: 'Unfulfilled',
    in_progress: 'In progress',
    fulfilled: 'Fulfilled',
    not_required: 'Not required'
  }

  return dictionary[status]
}

export function getTriggerAttributeName(
  triggerAttribute: UITriggerAttributes
): string {
  const dictionary: Record<typeof triggerAttribute, string> = {
    _approve: 'Approve',
    _archive: 'Archive',
    _cancel: 'Cancel',
    _capture: 'Capture payment',
    _refund: 'Refund',
    _return: 'Return',
    _unarchive: 'Unarchive'
  }

  return dictionary[triggerAttribute]
}
