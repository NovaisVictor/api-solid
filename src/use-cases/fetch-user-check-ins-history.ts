import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface FechUserCheckInHistoryUseCaseRequest {
  userId: string
  page: number
}
interface FechUserCheckInHistoryCaseResponse {
  checkIns: CheckIn[]
}

export class FechUserCheckInHistoryCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FechUserCheckInHistoryUseCaseRequest): Promise<FechUserCheckInHistoryCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )
    return { checkIns }
  }
}
