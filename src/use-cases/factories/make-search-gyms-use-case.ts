import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { SearchGymsUseCase } from '../search-gyms'

export function makeSearchGymsUseCase() {
  const gymsInsRepository = new PrismaGymsRepository()
  const useCase = new SearchGymsUseCase(gymsInsRepository)

  return useCase
}
