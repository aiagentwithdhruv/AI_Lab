const { z } = require('zod');

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  description: z.string().max(500, 'Description must be at most 500 characters').default(''),
});

const updateProjectSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters').optional(),
    description: z.string().max(500, 'Description must be at most 500 characters').optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: 'At least one field (name or description) must be provided',
  });

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be at most 200 characters'),
  description: z.string().max(2000, 'Description must be at most 2000 characters').default(''),
  status: z.enum(['todo', 'in_progress', 'review', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('low'),
  assignee_id: z.number().int().positive().nullable().optional().default(null),
  due_date: z.string().nullable().optional().default(null),
});

const updateTaskSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).optional(),
    status: z.enum(['todo', 'in_progress', 'review', 'done']).optional(),
    priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    assignee_id: z.number().int().positive().nullable().optional(),
    due_date: z.string().nullable().optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.status !== undefined ||
      data.priority !== undefined ||
      data.assignee_id !== undefined ||
      data.due_date !== undefined,
    { message: 'At least one field must be provided' }
  );

const moveTaskSchema = z.object({
  status: z.enum(['todo', 'in_progress', 'review', 'done']),
  position: z.number().int().min(0, 'Position must be >= 0'),
});

const inviteMemberSchema = z.object({
  email: z.string().email('Invalid email format'),
});

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details,
        },
      });
    }
    req.validated = result.data;
    next();
  };
}

module.exports = {
  signupSchema,
  loginSchema,
  createProjectSchema,
  updateProjectSchema,
  createTaskSchema,
  updateTaskSchema,
  moveTaskSchema,
  inviteMemberSchema,
  validate,
};
