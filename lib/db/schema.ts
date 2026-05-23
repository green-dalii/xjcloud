import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  avatar: text('avatar'),
  bio: text('bio'),
  phone: text('phone'),
  location: text('location'),
  interests: text('interests', { mode: 'json' }).$type<string[]>(),
  website: text('website'),
  gender: text('gender', { enum: ['male', 'female', 'unspecified'] }),
  age: integer('age'),
  skills: text('skills', { mode: 'json' }).$type<string[]>(),
  riceBalance: integer('rice_balance').default(0),
  role: text('role', { enum: ['participant', 'organizer', 'provider'] }).default('participant'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const activities = sqliteTable('activities', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  organizerId: text('organizer_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type'),
  status: text('status', { enum: ['draft', 'planning', 'upcoming', 'ongoing', 'completed', 'cancelled'] }).default('draft'),
  capacity: integer('capacity'),
  enrolledCount: integer('enrolled_count').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  authorId: text('author_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  images: text('images', { mode: 'json' }).$type<string[]>().default([]),
  activityId: text('activity_id').references(() => activities.id),
  likesCount: integer('likes_count').default(0),
  commentsCount: integer('comments_count').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const enrollments = sqliteTable('enrollments', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  activityId: text('activity_id').notNull().references(() => activities.id),
  participantId: text('participant_id').notNull().references(() => users.id),
  status: text('status', { enum: ['registered', 'confirmed', 'ongoing', 'completed', 'cancelled', 'no_show'] }).default('registered'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const likes = sqliteTable('likes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  postId: text('post_id').notNull().references(() => posts.id),
  userId: text('user_id').notNull().references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const comments = sqliteTable('comments', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  postId: text('post_id').notNull().references(() => posts.id),
  userId: text('user_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})
