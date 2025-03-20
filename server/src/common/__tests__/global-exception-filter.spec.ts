import { Test, TestingModule } from '@nestjs/testing';
import { GlobalExceptionFilter } from '../filters/global-exceptions.filter';
import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

describe('GlobalExceptionFilter', () => {
  let exceptionFilter: GlobalExceptionFilter;
  let httpAdapterHostMock: { httpAdapter: { reply: jest.Mock } };
  let configServiceMock: { get: jest.Mock };
  let loggerErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    httpAdapterHostMock = {
      httpAdapter: {
        reply: jest.fn(),
        getRequestUrl: jest.fn((req) => req.url), // Mock de la méthode getRequestUrl
      } as any,
    };

    configServiceMock = {
      get: jest.fn().mockReturnValue('development'), // Simule NODE_ENV=development
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GlobalExceptionFilter,
        { provide: HttpAdapterHost, useValue: httpAdapterHostMock },
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    exceptionFilter = module.get<GlobalExceptionFilter>(GlobalExceptionFilter);
    loggerErrorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(); // Empêche d'afficher des logs
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Nettoie les mocks après chaque test
  });

  it('should be defined', () => {
    expect(exceptionFilter).toBeDefined();
  });

  it('should handle HttpException and return a structured error response', () => {
    const mockException = new HttpException(
      'Unauthorized',
      HttpStatus.UNAUTHORIZED,
    );
    const mockHost = {
      switchToHttp: () => ({
        getRequest: () => ({
          url: '/test',
          method: 'GET',
          query: {},
          body: {},
          params: {},
          user: { id: '123' },
        }),
        getResponse: () => ({}),
      }),
    } as any;

    exceptionFilter.catch(mockException, mockHost);

    expect(httpAdapterHostMock.httpAdapter.reply).toHaveBeenCalledWith(
      mockHost.switchToHttp().getResponse(),
      expect.objectContaining({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
        error: 'HttpException',
        path: '/test',
      }),
      HttpStatus.UNAUTHORIZED,
    );

    expect(loggerErrorSpy).toHaveBeenCalled();
  });

  it('should handle generic Error and return a 500 status', () => {
    const mockException = new Error('Unexpected error');
    const mockHost = {
      switchToHttp: () => ({
        getRequest: () => ({
          url: '/test',
          method: 'POST',
          query: {},
          body: {},
          params: {},
          user: { id: '123' },
        }),
        getResponse: () => ({}),
      }),
    } as any;

    exceptionFilter.catch(mockException, mockHost);

    expect(httpAdapterHostMock.httpAdapter.reply).toHaveBeenCalledWith(
      mockHost.switchToHttp().getResponse(),
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Unexpected error',
        error: 'Internal server error',
        path: '/test',
      }),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );

    expect(loggerErrorSpy).toHaveBeenCalled();
  });

  it('should hide stack trace in production mode', () => {
    configServiceMock.get.mockReturnValue('production'); // Simule NODE_ENV=production
    exceptionFilter = new GlobalExceptionFilter(
      httpAdapterHostMock as any,
      configServiceMock as any,
    );

    const mockException = new Error('Hidden error');
    const mockHost = {
      switchToHttp: () => ({
        getRequest: () => ({
          url: '/test',
          method: 'POST',
          query: {},
          body: {},
          params: {},
          user: { id: '123' },
        }),
        getResponse: () => ({}),
      }),
    } as any;

    exceptionFilter.catch(mockException, mockHost);

    expect(httpAdapterHostMock.httpAdapter.reply).toHaveBeenCalledWith(
      mockHost.switchToHttp().getResponse(),
      expect.not.objectContaining({ stackLocation: expect.any(String) }), // Vérifie que stackLocation n'existe pas
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  });
});
