import { AppModule } from '@/app.module'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import bodyParser from 'body-parser'
import config from 'config'

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule)

    app.enableCors({
        origin: '*',
    })
    app.use(bodyParser.json({ limit: '50mb' }))
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    app.useGlobalPipes(new ValidationPipe({ transform: true }))

    process.on('uncaughtException', (error, origin) => {
        console.error('uncaughtException: ', error, 'Origin:', origin)
    })
    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'Reason:', reason)
    })

    const port = config.get<number>('port') || 4000
    await app.listen(port)
}
bootstrap()
