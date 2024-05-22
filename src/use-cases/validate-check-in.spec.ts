import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let checkInRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase // sut -> System Under Test

describe('Validate Check In Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInRepository)

    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should to be able validate the check-in', async () => {
    const createdCheckIn = await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'gym-01',
    })
    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })
    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date))
  })
  it('should not be able validate an inexistent check-in', async () => {
    expect(() =>
      sut.execute({
        checkInId: 'inexistent-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
  it('should not be able to validate the check-in after 20 minutes fof its creation', async () => {
    vi.setSystemTime(new Date(2024, 4, 22, 17, 48))

    const createdCheckIn = await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'gym-01',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
