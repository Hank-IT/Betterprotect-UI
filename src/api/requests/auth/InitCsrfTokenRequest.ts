import { BaseRequest, type ResponseContract, JsonResponse } from '@hank-it/ui/service/requests'

export class InitCsrfTokenRequest extends BaseRequest {
  method(): string {
    return 'GET'
  }

  url(): string {
    return '/sanctum/csrf-cookie'
  }

  accepts(): ResponseContract {
    return JsonResponse
  }
}