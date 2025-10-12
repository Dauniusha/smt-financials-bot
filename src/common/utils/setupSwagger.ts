import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Reservation Bot API')
    .setVersion('1.0.1')
    .addBearerAuth(
      {
        name: 'initdata',
        description: 'Tg init data',
        in: 'header',
        type: 'apiKey',
      },
      'telegram',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, { useGlobalPrefix: true });
};
