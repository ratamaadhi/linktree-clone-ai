import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function requireAuth(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json(
      { error: { code: 'AUTHENTICATION_ERROR', message: 'Unauthorized' } },
      { status: 401 }
    );
  }

  return session;
}

export async function requireOrgAccess(request: NextRequest) {
  const session = await requireAuth(request);

  if (session instanceof NextResponse) {
    return session;
  }

  // TODO: Implement organization access check
  // For now, we just verify the user is authenticated
  return { session };
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  if (error && typeof error === 'object' && 'errors' in error) {
    const zodError = error as {
      errors: Array<{ path: string[]; message: string }>;
    };
    return NextResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: zodError.errors.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        },
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    },
    { status: 500 }
  );
}
