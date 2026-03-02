import { relations } from 'drizzle-orm';
import { text, timestamp, boolean, integer, jsonb, pgSchema } from 'drizzle-orm/pg-core';
import { appConfig } from '@/config/site';

export const audit_schema = pgSchema('audit_schema');


export const user = audit_schema.table('user', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('emailVerified').notNull().default(false),
    image: text('image'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
    auditCredits: integer('auditCredits').default(appConfig.audits.freeTierLimit).notNull(),
});

export const session = audit_schema.table('session', {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expiresAt').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
    ipAddress: text('ipAddress'),
    userAgent: text('userAgent'),
    userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const account = audit_schema.table('account', {
    id: text('id').primaryKey(),
    accountId: text('accountId').notNull(),
    providerId: text('providerId').notNull(),
    userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('accessToken'),
    refreshToken: text('refreshToken'),
    idToken: text('idToken'),
    accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
    refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const verification = audit_schema.table('verification', {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expiresAt').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const audit = audit_schema.table('audit', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    status: text('status', { enum: ['pending', 'completed', 'failed'] }).notNull().default('pending'),
    results: jsonb('results'),
    crawledContent: text('crawledContent'),
    auditGenratedContent: text('auditGenratedContent'),
    competitorUrls: jsonb('competitorUrls'),
    competitorsCrawledContent: jsonb('competitorsCrawledContent'),
    comparisonReport: text('comparisonReport'),
    questionnaireContent: text('questionnaireContent'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// --- Relations ---

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
    audits: many(audit),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

export const auditRelations = relations(audit, ({ one }) => ({
    user: one(user, {
        fields: [audit.userId],
        references: [user.id],
    }),
}));
