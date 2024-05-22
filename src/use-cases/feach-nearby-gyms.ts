import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface FechNearbyGymsUseCaseRequest {
  userLatitude: number
  userLongitude: number
}

interface FechNearbyGymsUseCaseResponse {
  gyms: Gym[]
}

export class FechNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FechNearbyGymsUseCaseRequest): Promise<FechNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })
    return { gyms }
  }
}
