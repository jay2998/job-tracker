import { useEffect, useState, useCallback } from 'react'
import { getApplications, createApplication, updateApplication, deleteApplication, getApiError } from '@/lib/api'
import { toast } from 'sonner'

export function useApplications(filters = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const serializedFilters = JSON.stringify(filters)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getApplications(JSON.parse(serializedFilters))
      setData(Array.isArray(res.data) ? res.data : [])
      setError(null)
    } catch (err) {
      const message = getApiError(err, 'Failed to load applications')
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [serializedFilters])

  useEffect(() => {
    fetch()
  }, [fetch])

  const add = async (formData) => {
    try {
      const res = await createApplication(formData)
      setData((prev) => [res.data, ...prev])
      toast.success(`Added ${formData.company}`)
      return true
    } catch (err) {
      toast.error(getApiError(err, 'Failed to add application'))
      return false
    }
  }

  const update = async (id, formData) => {
    try {
      const res = await updateApplication(id, formData)
      setData((prev) => prev.map((app) => (app._id === id ? res.data : app)))
      toast.success('Application updated')
      return true
    } catch (err) {
      toast.error(getApiError(err, 'Failed to update application'))
      return false
    }
  }

  const remove = async (id, company) => {
    try {
      await deleteApplication(id)
      setData((prev) => prev.filter((app) => app._id !== id))
      toast.success(`Removed ${company}`)
      return true
    } catch (err) {
      toast.error(getApiError(err, 'Failed to delete application'))
      return false
    }
  }

  return { data, setData, loading, error, refetch: fetch, add, update, remove }
}

