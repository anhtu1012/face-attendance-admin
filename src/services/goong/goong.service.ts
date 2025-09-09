/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";

class GoongServiceBase extends AxiosService {
    protected readonly baseUrl: string = "place";

    async getAutoComplete(input: string): Promise<any> {
        return this.getWithParams(`${process.env.NEXT_PUBLIC_GOONG_URL}/${this.baseUrl}/autocomplete`,
            new URLSearchParams({ input, api_key: process.env.NEXT_PUBLIC_GOONG_KEY! }))
    }
    async getPlaceDetail(placeId: string) {
        return this.getWithParams(`${process.env.NEXT_PUBLIC_GOONG_URL}/${this.baseUrl}/detail`,
            new URLSearchParams({ place_id: placeId, api_key: process.env.NEXT_PUBLIC_GOONG_KEY! }))
    }

}

export const GoongService = new GoongServiceBase()