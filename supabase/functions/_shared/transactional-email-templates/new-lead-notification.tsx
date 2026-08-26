import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Big Boys Junk Removal"

interface NewLeadNotificationProps {
  name?: string
  phone?: string
  zipCode?: string
  leadType?: string
  totalPrice?: string
  items?: string
  loadSize?: string
  addOns?: string
  message?: string
  urgency?: string
  timestamp?: string
}

const NewLeadNotificationEmail = ({
  name = 'Unknown',
  phone = 'N/A',
  zipCode = 'N/A',
  leadType = 'New Lead',
  totalPrice,
  items,
  loadSize,
  addOns,
  message,
  urgency,
  timestamp,
}: NewLeadNotificationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>🚨 New {leadType} from {name} — {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Heading style={h1}>🚨 New Lead Received</Heading>
          <Text style={leadTypeBadge}>{leadType}</Text>
        </Section>

        <Hr style={divider} />

        <Section style={detailsSection}>
          <Text style={label}>Customer Name</Text>
          <Text style={value}>{name}</Text>

          <Text style={label}>Phone</Text>
          <Text style={value}>{phone}</Text>

          <Text style={label}>ZIP Code</Text>
          <Text style={value}>{zipCode}</Text>

          {items ? (
            <>
              <Text style={label}>Items</Text>
              <Text style={value}>{items}</Text>
            </>
          ) : null}

          {loadSize ? (
            <>
              <Text style={label}>Load Size</Text>
              <Text style={value}>{loadSize}</Text>
            </>
          ) : null}

          {addOns ? (
            <>
              <Text style={label}>Add-ons</Text>
              <Text style={value}>{addOns}</Text>
            </>
          ) : null}

          {totalPrice ? (
            <>
              <Text style={label}>Total Price</Text>
              <Text style={priceValue}>${totalPrice}</Text>
            </>
          ) : null}

          {message ? (
            <>
              <Text style={label}>Message</Text>
              <Text style={value}>{message}</Text>
            </>
          ) : null}

          {urgency ? (
            <>
              <Text style={label}>Urgency</Text>
              <Text style={value}>{urgency}</Text>
            </>
          ) : null}
        </Section>

        <Hr style={divider} />

        <Text style={footer}>
          {timestamp ? `Received at ${timestamp}` : 'Just now'} — {SITE_NAME}
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: NewLeadNotificationEmail,
  subject: (data: Record<string, any>) =>
    `🚨 New ${data.leadType || 'Lead'} from ${data.name || 'Customer'}`,
  displayName: 'New Lead Notification',
  to: 'support@bigboysjr.com',
  previewData: {
    name: 'Jane Smith',
    phone: '555-123-4567',
    zipCode: '30301',
    leadType: 'Item Pricing Lead',
    totalPrice: '275',
    items: '🛋️ Couch × 1, 🪑 Chair × 2',
    addOns: 'Stairs × 2 ($20), Same Day Service ($20), Area Service Fee ($49)',
    timestamp: '4/11/2026, 10:00 AM',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'DM Sans', Arial, sans-serif" }
const container = { padding: '24px 28px', maxWidth: '520px', margin: '0 auto' }
const headerSection = { textAlign: 'center' as const, marginBottom: '8px' }
const h1 = { fontSize: '24px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 12px' }
const leadTypeBadge = {
  display: 'inline-block' as const,
  backgroundColor: '#e8f5e9',
  color: '#2e7d32',
  padding: '4px 14px',
  borderRadius: '20px',
  fontSize: '13px',
  fontWeight: '600',
}
const divider = { borderColor: '#e5e7eb', margin: '20px 0' }
const detailsSection = { padding: '0' }
const label = { fontSize: '12px', fontWeight: '600', color: '#6b7280', margin: '16px 0 2px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const value = { fontSize: '15px', color: '#1f2937', margin: '0 0 4px', lineHeight: '1.5' }
const priceValue = { fontSize: '20px', fontWeight: '700', color: '#2e7d32', margin: '0 0 4px' }
const footer = { fontSize: '12px', color: '#9ca3af', textAlign: 'center' as const, margin: '8px 0 0' }
