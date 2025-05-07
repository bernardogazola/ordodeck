import { Env } from '@/common/utils';
import { swagger } from '@/swagger';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';

export const bootstrap = async (app: NestExpressApplication): Promise<void> => {
  // Instância do Logger para logging de events
  const logger = app.get(Logger);

  // Serviço de config para obter variáveis de ambiente e outras configurações
  const configService = app.get(ConfigService<Env>);

  // Configuração de headers de segurança usando helmet
  app.use(helmet());

  // Configuração do prefixo global da API, excluindo certas rotas do prefixo
  app.setGlobalPrefix('api', {
    exclude: [
      {
        path: '/',
        method: RequestMethod.GET,
      },
      {
        path: '/api-docs',
        method: RequestMethod.GET,
      },
      {
        path: '/health',
        method: RequestMethod.GET,
      },
    ],
  });

  // Manipulação de ativos estáticos (para uploads)
  app.useStaticAssets('./uploads', {
    prefix: '/assets',
  });

  // Configuração do CORS permitindo origens específicas e métodos
  app.enableCors({
    credentials: true,
    origin: configService.get('ALLOW_CORS_URL'),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });

  // Usar o logger personalizado para logs da aplicação
  app.useLogger(logger);

  // Pipe de validação global para validação de requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Permite apenas propriedades definidas em DTOs
      forbidNonWhitelisted: true, // Rejeita qualquer propriedade extra no request
      transform: true, // Transforma os payloads em tipos DTO
      transformOptions: {
        enableImplicitConversion: true, // Habilita a conversão implícita de tipos
      },
    }),
  );

  // Configuração do Swagger para habilitar a documentação da API
  if (configService.get('NODE_ENV') !== 'production') {
    await swagger(app);
  }

  // Iniciar a aplicação
  await app.listen(configService.get('PORT')!, () => {
    logger.log(
      `A aplicação foi iniciada em ${configService.get('HOST')}:${configService.get('PORT')}`,
    );
  });
};
