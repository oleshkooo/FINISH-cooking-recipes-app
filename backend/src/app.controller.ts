import { Controller, Get } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'

@Controller()
export class AppController {
    @ApiOperation({
        summary: 'Health check',
        description: 'Health check endpoint to verify the service is running',
    })
    @Get()
    healthCheck(): string {
        return 'Alive'
    }
}
