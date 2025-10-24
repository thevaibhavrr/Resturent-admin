import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Users, RefreshCw, X } from 'lucide-react'
import { getAllRestaurants, getRestaurantStaff, createRestaurant, updateRestaurant, deleteRestaurant, getAllPlans, RestaurantDetail, StaffMember, PlanDetail } from '../api'
import { toast } from '../components/Toast'

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState<RestaurantDetail[]>([])
  const [plans, setPlans] = useState<PlanDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showStaffModal, setShowStaffModal] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantDetail | null>(null)
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loadingStaff, setLoadingStaff] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    adminUsername: '',
    adminPassword: '',
    planId: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [restaurantsData, plansData] = await Promise.all([
        getAllRestaurants(),
        getAllPlans()
      ])
      setRestaurants(restaurantsData)
      setPlans(plansData)
    } catch (error: any) {
      toast.error(error.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createRestaurant(formData)
      toast.success('Restaurant created successfully!')
      setShowCreateModal(false)
      setFormData({ name: '', adminUsername: '', adminPassword: '', planId: '' })
      loadData()
    } catch (error: any) {
      toast.error(error.message || 'Failed to create restaurant')
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRestaurant) return
    
    try {
      await updateRestaurant(selectedRestaurant._id, {
        name: formData.name,
        adminUsername: formData.adminUsername,
        planId: formData.planId || undefined
      })
      toast.success('Restaurant updated successfully!')
      setShowEditModal(false)
      setSelectedRestaurant(null)
      setFormData({ name: '', adminUsername: '', adminPassword: '', planId: '' })
      loadData()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update restaurant')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all associated users and staff.`)) {
      return
    }

    try {
      await deleteRestaurant(id)
      toast.success('Restaurant deleted successfully!')
      loadData()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete restaurant')
    }
  }

  const handleViewStaff = async (restaurant: RestaurantDetail) => {
    setSelectedRestaurant(restaurant)
    setShowStaffModal(true)
    setLoadingStaff(true)
    try {
      const staffData = await getRestaurantStaff(restaurant._id)
      setStaff(staffData)
    } catch (error: any) {
      toast.error(error.message || 'Failed to load staff')
    } finally {
      setLoadingStaff(false)
    }
  }

  const openEditModal = (restaurant: RestaurantDetail) => {
    setSelectedRestaurant(restaurant)
    setFormData({
      name: restaurant.name,
      adminUsername: restaurant.adminUsername,
      adminPassword: '',
      planId: restaurant.subscription.plan || ''
    })
    setShowEditModal(true)
  }

  const getStatusBadge = (restaurant: RestaurantDetail) => {
    if (!restaurant.subscription.isActive) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Expired</span>
    }
    if (restaurant.subscription.daysRemaining <= 3) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Critical</span>
    }
    if (restaurant.subscription.daysRemaining <= 7) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Expiring Soon</span>
    }
    return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
          <p className="text-gray-600 mt-1">Manage all registered restaurants</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Restaurant
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {restaurants.map((restaurant) => (
          <div key={restaurant._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
                  {getStatusBadge(restaurant)}
                </div>
                <p className="text-sm text-gray-600 mt-1">Username: {restaurant.adminUsername}</p>
                <p className="text-xs text-gray-500">Created: {new Date(restaurant.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewStaff(restaurant)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View Staff"
                >
                  <Users className="w-5 h-5" />
                </button>
                <button
                  onClick={() => openEditModal(restaurant)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(restaurant._id, restaurant.name)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-500">Plan</p>
                <p className="font-semibold text-gray-900">{restaurant.subscription.planName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Days Remaining</p>
                <p className={`text-2xl font-bold ${
                  restaurant.subscription.daysRemaining <= 3 ? 'text-red-600' :
                  restaurant.subscription.daysRemaining <= 7 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {restaurant.subscription.daysRemaining}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">End Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(restaurant.subscription.endDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Staff Count</p>
                <p className="font-semibold text-gray-900">{restaurant.staffCount}</p>
              </div>
            </div>
          </div>
        ))}

        {restaurants.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-600">No restaurants found</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create Restaurant</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter restaurant name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Username</label>
                <input
                  type="text"
                  required
                  value={formData.adminUsername}
                  onChange={(e) => setFormData({ ...formData, adminUsername: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Password</label>
                <input
                  type="password"
                  required
                  value={formData.adminPassword}
                  onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan (Optional)</label>
                <select
                  value={formData.planId}
                  onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select a plan (Default: Free Trial)</option>
                  {plans.map((plan) => (
                    <option key={plan._id} value={plan._id}>
                      {plan.name} - {plan.durationDays} days - ₹{plan.price}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedRestaurant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Edit Restaurant</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Username</label>
                <input
                  type="text"
                  required
                  value={formData.adminUsername}
                  onChange={(e) => setFormData({ ...formData, adminUsername: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Change Plan</label>
                <select
                  value={formData.planId}
                  onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Keep current plan</option>
                  {plans.map((plan) => (
                    <option key={plan._id} value={plan._id}>
                      {plan.name} - {plan.durationDays} days - ₹{plan.price}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Modal */}
      {showStaffModal && selectedRestaurant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Staff Members</h2>
                <p className="text-sm text-gray-600 mt-1">{selectedRestaurant.name}</p>
              </div>
              <button onClick={() => setShowStaffModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {loadingStaff ? (
              <div className="py-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : staff.length > 0 ? (
              <div className="space-y-3">
                {staff.map((member) => (
                  <div key={member._id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900">{member.username}</p>
                        <p className="text-sm text-gray-600">Password: {member.password}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Created: {new Date(member.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-600">
                No staff members found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
