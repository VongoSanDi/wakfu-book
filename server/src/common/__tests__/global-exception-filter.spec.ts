
import { Test, TestingModule } from '@nestjs/testing';
import { GlobalExceptionFilter } from '../filters/global-exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ApiError } from '../types/api-error.type';

describe('GlobalExceptionFilter', () => {
  let exceptionFilter: GlobalExceptionFilter;
  let httpAdapterHost: HttpAdapterHost;
  let configService: ConfigService;
  let mockHttpAdapter: { reply: jest.Mock };
  let loggerErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    mockHttpAdapter = { reply: jest.fn() };

    httpAdapterHost = { httpAdapter: mockHttpAdapter } as unknown as HttpAdapterHost;
    configService = { get: jest.fn().mockReturnValue('development') } as unknown as ConfigService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GlobalExceptionFilter,
        { provide: HttpAdapterHost, useValue: httpAdapterHost },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    exceptionFilter = module.get<GlobalExceptionFilter>(GlobalExceptionFilter);
    loggerErrorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(exceptionFilter).toBeDefined();
  });

  it('should handle HttpException correctly', () => {
    const exception = new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    const requestMock = { url: '/test', method: 'GET', body: {}, query: {}, params: {} };
    const argumentsHostMock = {
      switchToHttp: () => ({
        getResponse: () => ({}),
        getRequest: () => requestMock,
      }),
    } as ArgumentsHost;

    exceptionFilter.catch(exception, argumentsHostMock);

    expect(mockHttpAdapter.reply).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining<ApiError>({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
        errors: expect.anything(),
        timestamp: expect.any(String),
        path: '/test',
      }),
      HttpStatus.UNAUTHORIZED,
    );
  });

  it('should handle generic Error correctly', () => {
    const exception = new Error('Unexpected error');
    const requestMock = { url: '/test', method: 'POST', body: {}, query: {}, params: {} };
    const argumentsHostMock = {
      switchToHttp: () => ({
        getResponse: () => ({}),
        getRequest: () => requestMock,
      }),
    } as ArgumentsHost;

    exceptionFilter.catch(exception, argumentsHostMock);

    expect(mockHttpAdapter.reply).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining<ApiError>({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Unexpected error',
        errors: expect.anything(),
        timestamp: expect.any(String),
        path: '/test',
      }),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  });

  it('should hide stack trace in production mode', () => {
    configService.get = jest.fn().mockReturnValue('production');
    exceptionFilter = new GlobalExceptionFilter(httpAdapterHost, configService);

    const exception = new Error('Hidden error');
    const requestMock = { url: '/test', method: 'POST', body: {}, query: {}, params: {} };
    const argumentsHostMock = {
      switchToHttp: () => ({
        getResponse: () => ({}),
        getRequest: () => requestMock,
      }),
    } as ArgumentsHost;

    exceptionFilter.catch(exception, argumentsHostMock);

    expect(mockHttpAdapter.reply).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining<ApiError>({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Hidden error',
        errors: expect.anything(),
        timestamp: expect.any(String),
        path: '/test',
      }),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  });
});
