import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import config from 'config'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.use(cookieParser())
    app.useGlobalPipes(new ValidationPipe())

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Advertize API')
        .setDescription('Main Advertize API')
        .setVersion('0.1')
        .build()
    const document = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup('swagger', app, document)

    process.on('uncaughtException', (error, origin) => {
        console.error('Uncaught Exception: ', error, 'Origin:', origin)
    })
    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'Reason:', reason)
    })

    const port = config.get<number>('port') || 4000
    await app.listen(port)
}
bootstrap()
