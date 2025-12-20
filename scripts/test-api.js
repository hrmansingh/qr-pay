#!/usr/bin/env node

/**
 * Simple API testing script for QR Pay backend
 * Run with: node scripts/test-api.js
 */

const BASE_URL = 'http://localhost:3000'

async function testAPI() {
  console.log('🚀 Testing QR Pay API endpoints...\n')

  try {
    // Test 0: Create a test profile
    console.log('0. Creating a test profile...')
    const profileResponse = await fetch(`${BASE_URL}/api/profiles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'test-profile-123',
        name: 'Test Business Owner',
        role: 'business_owner'
      })
    })
    
    let profile
    if (profileResponse.ok) {
      const result = await profileResponse.json()
      profile = result.profile
      console.log(`✅ Profile created: ${profile.name} (Role: ${profile.role})`)
    } else {
      // Profile might already exist, try to fetch it
      const existingProfileResponse = await fetch(`${BASE_URL}/api/profiles/test-profile-123`)
      if (existingProfileResponse.ok) {
        const result = await existingProfileResponse.json()
        profile = result.profile
        console.log(`✅ Using existing profile: ${profile.name} (Role: ${profile.role})`)
      } else {
        throw new Error('Failed to create or fetch test profile')
      }
    }

    // Test 1: Create a business
    console.log('\n1. Creating a test business...')
    const businessResponse = await fetch(`${BASE_URL}/api/businesses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Coffee Shop',
        owner_id: profile.id
      })
    })
    
    if (!businessResponse.ok) {
      throw new Error(`Business creation failed: ${businessResponse.status}`)
    }
    
    const { business } = await businessResponse.json()
    console.log(`✅ Business created: ${business.name} (ID: ${business.id})`)

    // Test 2: Create a product
    console.log('\n2. Creating a test product...')
    const productResponse = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Cappuccino',
        base_price: 150
      })
    })
    
    if (!productResponse.ok) {
      throw new Error(`Product creation failed: ${productResponse.status}`)
    }
    
    const { product } = await productResponse.json()
    console.log(`✅ Product created: ${product.name} (ID: ${product.id})`)

    // Test 3: Assign product to business
    console.log('\n3. Assigning product to business...')
    const assignResponse = await fetch(`${BASE_URL}/api/business-products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        business_id: business.id,
        product_id: product.id,
        price_override: 180
      })
    })
    
    if (!assignResponse.ok) {
      throw new Error(`Product assignment failed: ${assignResponse.status}`)
    }
    
    const { businessProduct } = await assignResponse.json()
    console.log(`✅ Product assigned with price override: ₹${businessProduct.price_override}`)

    // Test 4: Generate QR code
    console.log('\n4. Generating QR code...')
    const qrResponse = await fetch(`${BASE_URL}/api/qr-codes/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        business_id: business.id,
        product_id: product.id
      })
    })
    
    if (!qrResponse.ok) {
      throw new Error(`QR generation failed: ${qrResponse.status}`)
    }
    
    const qrData = await qrResponse.json()
    console.log(`✅ QR code generated for ${qrData.product_name} at ${qrData.business_name}`)
    console.log(`   Amount: ₹${qrData.amount}`)
    console.log(`   UPI ID: ${qrData.merchant_upi}`)

    // Test 5: Get profile statistics
    console.log('\n5. Fetching profile statistics...')
    const profileStatsResponse = await fetch(`${BASE_URL}/api/profiles/${profile.id}/stats`)
    
    if (!profileStatsResponse.ok) {
      throw new Error(`Profile stats fetch failed: ${profileStatsResponse.status}`)
    }
    
    const { stats } = await profileStatsResponse.json()
    console.log(`✅ Profile stats fetched:`)
    console.log(`   Businesses: ${stats.total_businesses}`)
    console.log(`   Products: ${stats.total_products}`)
    console.log(`   Revenue: ₹${stats.total_revenue}`)
    console.log(`   Payments: ${stats.total_payments}`)

    // Test 6: Get profile businesses
    console.log('\n6. Fetching profile businesses...')
    const profileBusinessesResponse = await fetch(`${BASE_URL}/api/profiles/${profile.id}/businesses?include_stats=true`)
    
    if (!profileBusinessesResponse.ok) {
      throw new Error(`Profile businesses fetch failed: ${profileBusinessesResponse.status}`)
    }
    
    const { businesses } = await profileBusinessesResponse.json()
    console.log(`✅ Found ${businesses.length} businesses for profile`)
    if (businesses.length > 0) {
      console.log(`   First business: ${businesses[0].name} (${businesses[0].stats.total_products} products)`)
    }

    // Test 7: Get analytics (should be empty initially)
    console.log('\n7. Fetching analytics...')
    const analyticsResponse = await fetch(`${BASE_URL}/api/analytics/overview`)
    
    if (!analyticsResponse.ok) {
      throw new Error(`Analytics fetch failed: ${analyticsResponse.status}`)
    }
    
    const { analytics } = await analyticsResponse.json()
    console.log(`✅ Analytics fetched:`)
    console.log(`   Total Revenue: ₹${analytics.total_revenue}`)
    console.log(`   Total Payments: ${analytics.total_payments}`)
    console.log(`   Businesses: ${analytics.revenue_by_business.length}`)
    console.log(`   Products: ${analytics.revenue_by_product.length}`)

    // Test 8: List all profiles (admin endpoint)
    console.log('\n8. Listing all profiles...')
    const profileListResponse = await fetch(`${BASE_URL}/api/admin/profiles?include_stats=true`)
    
    if (!profileListResponse.ok) {
      throw new Error(`Profile list failed: ${profileListResponse.status}`)
    }
    
    const profileListData = await profileListResponse.json()
    console.log(`✅ Found ${profileListData.profiles.length} profiles`)
    console.log(`   Role distribution:`, profileListData.summary.role_distribution)

    // Test 9: Update profile role
    console.log('\n9. Testing profile role update...')
    const roleUpdateResponse = await fetch(`${BASE_URL}/api/profiles/${profile.id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: 'admin',
        promoted_by: 'test-system'
      })
    })
    
    if (!roleUpdateResponse.ok) {
      throw new Error(`Role update failed: ${roleUpdateResponse.status}`)
    }
    
    const roleUpdateData = await roleUpdateResponse.json()
    console.log(`✅ ${roleUpdateData.message}`)

    console.log('\n🎉 All API tests passed successfully!')
    console.log('\n📝 Next steps:')
    console.log('   1. Configure your Razorpay webhook URL')
    console.log('   2. Test payment flow with a real UPI transaction')
    console.log('   3. Monitor webhook events in your Razorpay dashboard')
    console.log('   4. Set up proper authentication for profile management')

  } catch (error) {
    console.error('❌ API test failed:', error.message)
    process.exit(1)
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/api/businesses`)
    return response.status !== 500
  } catch (error) {
    return false
  }
}

async function main() {
  console.log('Checking if server is running...')
  const serverRunning = await checkServer()
  
  if (!serverRunning) {
    console.log('❌ Server is not running. Please start the development server:')
    console.log('   npm run dev')
    process.exit(1)
  }
  
  console.log('✅ Server is running\n')
  await testAPI()
}

main().catch(console.error)