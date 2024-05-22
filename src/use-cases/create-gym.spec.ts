import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase // sut -> System Under Test

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })
  it('should to be able to create Gym', async () => {
    const { gym } = await sut.execute({
      title: 'TypeScript Gym',
      description: null,
      phone: null,
      latitude: -23.7511,
      longitude: -46.0493,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
