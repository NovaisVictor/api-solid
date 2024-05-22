import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface GetUserMetricsUseCaseRequest {
  userId: string
}
interface GetUserMetricsCaseResponse {
  checkInsCount: number
}

export class GetUserMetricsCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)
    return { checkInsCount }
  }
}
