import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { FechNearbyGymsUseCase } from '../feach-nearby-gyms'

export function makeFechNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const makeFechNearbyGymsUseCase = new FechNearbyGymsUseCase(gymsRepository)

  return makeFechNearbyGymsUseCase
}
