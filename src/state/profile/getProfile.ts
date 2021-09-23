import Cookies from 'js-cookie'
import { Profile } from 'state/types'

export interface GetProfileResponse {
  hasRegistered: boolean
  profile?: Profile
}

const getProfile = async (address: string): Promise<GetProfileResponse> => {
  try {
    const hasRegistered = false

    if (!hasRegistered) {
      return { hasRegistered, profile: null }
    }
  } catch (error) {
    return null
  }
}

export default getProfile
