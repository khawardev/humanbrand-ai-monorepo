import { relations } from 'drizzle-orm';
import { text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { aiag_schema } from './aiagSchema';
import { user } from './usersSchema';

export const supportStatusEnum = aiag_schema.enum('support_status', ['pending', 'in_progress', 'completed', 'rejected']);
export const supportTypeEnum = aiag_schema.enum('support_type', ['bug_report', 'feature_request']);

export const supportTicket = aiag_schema.table('support_ticket', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
    subject: text('subject').notNull(),
    description: text('description').notNull(),
    type: supportTypeEnum('type').notNull().default('bug_report'),
    status: supportStatusEnum('status').notNull().default('pending'),
    adminRemarks: text('admin_remarks'),
    attachments: text('attachments').array(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const supportTicketRelations = relations(supportTicket, ({ one }) => ({
    user: one(user, {
        fields: [supportTicket.userId],
        references: [user.id],
    }),
}));
