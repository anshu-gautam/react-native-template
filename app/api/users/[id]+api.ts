import type { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { authMiddleware } from '../middleware/auth';
import { rateLimitMiddleware } from '../middleware/rateLimit';

// Example user data (in a real app, this would come from a database)
const users = [
  {
    id: '1',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'jane@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// GET /api/users/:id
export const GET = rateLimitMiddleware()(
  authMiddleware(async (req, res) => {
    try {
      const { id } = req.expoUrl.searchParams;

      if (!id) {
        return Response.json(
          {
            status: 'error',
            message: 'User ID is required',
          },
          { status: 400 }
        );
      }

      const user = users.find((u) => u.id === id);

      if (!user) {
        return Response.json(
          {
            status: 'error',
            message: 'User not found',
          },
          { status: 404 }
        );
      }

      return Response.json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      console.error('GET /api/users/:id error:', error);
      return Response.json(
        {
          status: 'error',
          message: 'Internal server error',
        },
        { status: 500 }
      );
    }
  })
);

// PATCH /api/users/:id
export const PATCH = rateLimitMiddleware()(
  authMiddleware(async (req, res) => {
    try {
      const { id } = req.expoUrl.searchParams;
      const body = await req.json();

      if (!id) {
        return Response.json(
          {
            status: 'error',
            message: 'User ID is required',
          },
          { status: 400 }
        );
      }

      const userIndex = users.findIndex((u) => u.id === id);

      if (userIndex === -1) {
        return Response.json(
          {
            status: 'error',
            message: 'User not found',
          },
          { status: 404 }
        );
      }

      // Update user
      users[userIndex] = {
        ...users[userIndex],
        ...body,
        updatedAt: new Date().toISOString(),
      };

      return Response.json({
        status: 'success',
        message: 'User updated successfully',
        data: users[userIndex],
      });
    } catch (error) {
      console.error('PATCH /api/users/:id error:', error);
      return Response.json(
        {
          status: 'error',
          message: 'Internal server error',
        },
        { status: 500 }
      );
    }
  })
);

// DELETE /api/users/:id
export const DELETE = rateLimitMiddleware()(
  authMiddleware(async (req, res) => {
    try {
      const { id } = req.expoUrl.searchParams;

      if (!id) {
        return Response.json(
          {
            status: 'error',
            message: 'User ID is required',
          },
          { status: 400 }
        );
      }

      const userIndex = users.findIndex((u) => u.id === id);

      if (userIndex === -1) {
        return Response.json(
          {
            status: 'error',
            message: 'User not found',
          },
          { status: 404 }
        );
      }

      // Delete user
      users.splice(userIndex, 1);

      return Response.json({
        status: 'success',
        message: 'User deleted successfully',
      });
    } catch (error) {
      console.error('DELETE /api/users/:id error:', error);
      return Response.json(
        {
          status: 'error',
          message: 'Internal server error',
        },
        { status: 500 }
      );
    }
  })
);
