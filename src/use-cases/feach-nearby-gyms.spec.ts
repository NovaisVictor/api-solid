import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FechNearbyGymsUseCase } from './feach-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FechNearbyGymsUseCase // sut -> System Under Test

describe('Fech Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FechNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fech nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: '',
      phone: '',
      latitude: -23.7511,
      longitude: -46.0493,
    })
    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -23.9538883,
      longitude: -46.3591778,
    })
    const { gyms } = await sut.execute({
      userLatitude: -23.7511,
      userLongitude: -46.0493,
    })
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
