/**
 * API test helpers for integration testing
 */

import { NextRequest } from 'next/server';
import { expect } from '@jest/globals';

/**
 * Create a mock NextRequest for testing API routes
 */
export function createMockRequest({
  url = 'http://localhost:3000',
  method = 'GET',
  headers = {},
  body = null,
}: {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
} = {}): NextRequest {
  const request = new NextRequest(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  // Mock the json() method if body is provided
  if (body) {
    request.json = async () => body as never;
  }

  return request;
}

/**
 * Create a mock authenticated request
 */
export function createMockAuthRequest({
  userId,
  token,
  ...rest
}: {
  userId: string;
  token?: string;
} & Parameters<typeof createMockRequest>[0]): NextRequest {
  return createMockRequest({
    ...rest,
    headers: {
      ...rest.headers,
      Authorization: `Bearer ${token || 'mock-token'}`,
      'x-user-id': userId,
    },
  });
}

/**
 * Extract data from API response
 */
export async function extractResponseData(response: Response) {
  const cloned = response.clone();
  try {
    return await cloned.json();
  } catch {
    return { text: await response.text() };
  }
}

/**
 * Mock session for testing authenticated routes
 */
export function createMockSession({
  userId,
  email,
  name,
}: {
  userId: string;
  email?: string;
  name?: string;
}) {
  return {
    user: {
      id: userId,
      email: email || 'test@example.com',
      name: name || 'Test User',
      image: null,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    session: {
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      token: 'mock-session-token',
      id: 'mock-session-id',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
}

/**
 * Assert that response has expected error format
 */
export function assertApiError(
  response: unknown,
  expectedCode: string,
  expectedMessage?: string
): asserts response is { error: { code: string; message: string } } {
  const errorResponse = response as {
    error: { code: string; message: string };
  };
  expect(errorResponse).toHaveProperty('error');
  expect(errorResponse.error).toHaveProperty('code', expectedCode);
  if (expectedMessage) {
    expect(errorResponse.error).toHaveProperty('message', expectedMessage);
  }
}

/**
 * Common API response codes
 */
export const API_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  DUPLICATE_RESOURCE: 'DUPLICATE_RESOURCE',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;
