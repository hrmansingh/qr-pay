import { supabaseAdmin } from '@/lib/supabase-admin'
import { Profile } from '@/lib/types'

export class ProfileService {
  static async getProfileById(profileId: string) {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select(`
        *,
        businesses(
          id,
          name,
          created_at
        )
      `)
      .eq('id', profileId)
      .single()

    if (error) {
      throw new Error(`Failed to fetch profile: ${error.message}`)
    }

    return profile
  }

  static async getProfileByRole(role: string) {
    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch profiles by role: ${error.message}`)
    }

    return profiles
  }

  static async createProfile(data: {
    id: string
    name: string
    role?: 'admin' | 'business_owner' | 'user'
  }) {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .insert([{
        id: data.id,
        name: data.name,
        role: data.role || 'user'
      }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create profile: ${error.message}`)
    }

    return profile
  }

  static async updateProfile(
    profileId: string,
    data: {
      name?: string
      role?: 'admin' | 'business_owner' | 'user'
    }
  ) {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .update(data)
      .eq('id', profileId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`)
    }

    return profile
  }

  static async deleteProfile(profileId: string) {
    // Check for associated businesses
    const { data: businesses } = await supabaseAdmin
      .from('businesses')
      .select('id')
      .eq('owner_id', profileId)

    if (businesses && businesses.length > 0) {
      throw new Error('Cannot delete profile with associated businesses')
    }

    const { error } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', profileId)

    if (error) {
      throw new Error(`Failed to delete profile: ${error.message}`)
    }

    return true
  }

  static async getProfileStats(profileId: string, startDate?: string, endDate?: string) {
    // Get all businesses owned by this profile
    const { data: businesses, error: businessError } = await supabaseAdmin
      .from('businesses')
      .select('id')
      .eq('owner_id', profileId)

    if (businessError) {
      throw new Error(`Failed to fetch businesses: ${businessError.message}`)
    }

    const businessIds = businesses.map(b => b.id)

    if (businessIds.length === 0) {
      return {
        total_businesses: 0,
        total_products: 0,
        total_revenue: 0,
        total_payments: 0,
        success_rate: 0
      }
    }

    // Get payment stats
    let paymentQuery = supabaseAdmin
      .from('payments')
      .select('amount, status')
      .in('business_id', businessIds)

    if (startDate) paymentQuery = paymentQuery.gte('created_at', startDate)
    if (endDate) paymentQuery = paymentQuery.lte('created_at', endDate)

    const { data: payments, error: paymentError } = await paymentQuery

    if (paymentError) {
      throw new Error(`Failed to fetch payments: ${paymentError.message}`)
    }

    // Get product count
    const { data: products, error: productError } = await supabaseAdmin
      .from('business_products')
      .select('id')
      .in('business_id', businessIds)

    if (productError) {
      throw new Error(`Failed to fetch products: ${productError.message}`)
    }

    const successfulPayments = payments.filter(p => p.status === 'captured')
    const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.amount, 0)

    return {
      total_businesses: businesses.length,
      total_products: products.length,
      total_revenue: totalRevenue,
      total_payments: payments.length,
      successful_payments: successfulPayments.length,
      failed_payments: payments.filter(p => p.status === 'failed').length,
      success_rate: payments.length > 0 ? (successfulPayments.length / payments.length) * 100 : 0,
      average_transaction_value: successfulPayments.length > 0 ? totalRevenue / successfulPayments.length : 0
    }
  }

  static async getProfileBusinesses(profileId: string) {
    const { data: businesses, error } = await supabaseAdmin
      .from('businesses')
      .select(`
        *,
        business_products(
          id,
          products(name, base_price)
        )
      `)
      .eq('owner_id', profileId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch profile businesses: ${error.message}`)
    }

    return businesses
  }

  static async validateProfileExists(profileId: string): Promise<boolean> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', profileId)
      .single()

    return !error && !!data
  }

  static async getAdminProfiles() {
    return this.getProfileByRole('admin')
  }

  static async getBusinessOwnerProfiles() {
    return this.getProfileByRole('business_owner')
  }

  static async promoteToBusinessOwner(profileId: string) {
    return this.updateProfile(profileId, { role: 'business_owner' })
  }

  static async promoteToAdmin(profileId: string) {
    return this.updateProfile(profileId, { role: 'admin' })
  }

  static async demoteToUser(profileId: string) {
    return this.updateProfile(profileId, { role: 'user' })
  }
}