import { expect, describe, it, beforeEach, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { afterEach } from 'node:test'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase // sut -> System Under Test

describe('Check In Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInRepository, gymsRepository)

    gymsRepository.create({
      id: 'gym-1',
      title: 'Victor Gym',
      description: 'So better than ironBerg',
      phone: '',
      latitude: new Decimal(-23.7511),
      longitude: new Decimal(-46.0493),
    })

    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should to be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: -23.7511,
      userLongitude: -46.0493,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  // red, green, refactor
  it('should not to be able twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 4, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: -23.7511,
      userLongitude: -46.0493,
    })

    await expect(
      async () =>
        await sut.execute({
          userId: 'user-1',
          gymId: 'gym-1',
          userLatitude: -23.7511,
          userLongitude: -46.0493,
        }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should not to be able twice but in different days', async () => {
    vi.setSystemTime(new Date(2024, 4, 19, 8, 0, 0))

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: -23.7511,
      userLongitude: -46.0493,
    })
    vi.setSystemTime(new Date(2024, 4, 20, 8, 0, 0))
    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: -23.7511,
      userLongitude: -46.0493,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should to be able to check in on distant gym', async () => {
    gymsRepository.create({
      id: 'gym-2',
      title: 'Victor Gym',
      description: 'So better than ironBerg',
      phone: '',
      latitude: new Decimal(-23.8441553),
      longitude: new Decimal(-46.132649),
    })
    await expect(() =>
      sut.execute({
        userId: 'user-2',
        gymId: 'gym-2',
        userLatitude: -23.7511,
        userLongitude: -46.0493,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
