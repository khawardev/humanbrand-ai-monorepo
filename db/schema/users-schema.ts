// import { relations } from 'drizzle-orm';
// import { text, timestamp, boolean, pgSchema } from 'drizzle-orm/pg-core';
// import { savedSession } from './saved-session-schema';
// import { aiag_schema } from './aiag-schema';
// import { knowledgeBaseChat } from './knowledge-base-chat-schema';

// export const user = aiag_schema.table('user', {
//     id: text('id').primaryKey(),
//     name: text('name').notNull(),
//     email: text('email').notNull().unique(),
//     emailVerified: boolean('emailVerified').notNull().default(false),
//     image: text('image'),
//     createdAt: timestamp('createdAt').notNull().defaultNow(),
//     updatedAt: timestamp('updatedAt').notNull().defaultNow(),
//     username: text('username').unique(),
//     displayUsername: text('displayUsername'),
// });

// export const session = aiag_schema.table('session', {
//     id: text('id').primaryKey(),
//     expiresAt: timestamp('expiresAt').notNull(),
//     token: text('token').notNull().unique(),
//     createdAt: timestamp('createdAt').notNull().defaultNow(),
//     updatedAt: timestamp('updatedAt').notNull().defaultNow(),
//     ipAddress: text('ipAddress'),
//     userAgent: text('userAgent'),
//     userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
// });

// export const account = aiag_schema.table('account', {
//     id: text('id').primaryKey(),
//     accountId: text('accountId').notNull(),
//     providerId: text('providerId').notNull(),
//     userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
//     accessToken: text('accessToken'),
//     refreshToken: text('refreshToken'),
//     idToken: text('idToken'),
//     accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
//     refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
//     scope: text('scope'),
//     password: text('password'),
//     createdAt: timestamp('createdAt').notNull().defaultNow(),
//     updatedAt: timestamp('updatedAt').notNull().defaultNow(),
// });

// export const verification = aiag_schema.table('verification', {
//     id: text('id').primaryKey(),
//     adminVerify: boolean('adminVerify').notNull(),
//     expiresAt: timestamp('expiresAt').notNull(),
//     createdAt: timestamp('createdAt').notNull().defaultNow(),
//     updatedAt: timestamp('updatedAt').notNull().defaultNow(),
//     userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),

// });



// export const userRelations = relations(user, ({ many, one }) => ({
//     savedSessions: many(savedSession),
//     sessions: many(session),
//     accounts: many(account),
//     knowledgeBaseChat: one(knowledgeBaseChat),
// }));


// export const sessionRelations = relations(session, ({ one }) => ({
//     user: one(user, {
//         fields: [session.userId],
//         references: [user.id],
//     }),
// }));

// export const accountRelations = relations(account, ({ one }) => ({
//     user: one(user, {
//         fields: [account.userId],
//         references: [user.id],
//     }),
// }));




import { relations } from 'drizzle-orm';
import { text, timestamp, boolean, pgSchema } from 'drizzle-orm/pg-core';
import { savedSession } from './saved-session-schema';
import { aiag_schema } from './aiag-schema';
import { knowledgeBaseChat } from './knowledge-base-chat-schema';

export const user = aiag_schema.table('user', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('emailVerified').notNull().default(false),
    image: text('image'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
    username: text('username').unique(),
    displayUsername: text('displayUsername'),
    adminVerified: boolean('adminVerified').default(false).notNull(),
});

export const session = aiag_schema.table('session', {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expiresAt').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
    ipAddress: text('ipAddress'),
    userAgent: text('userAgent'),
    userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const account = aiag_schema.table('account', {
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

export const verification = aiag_schema.table('verification', {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expiresAt').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const userRelations = relations(user, ({ many, one }) => ({
    savedSessions: many(savedSession),
    sessions: many(session),
    accounts: many(account),
    knowledgeBaseChat: one(knowledgeBaseChat),
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