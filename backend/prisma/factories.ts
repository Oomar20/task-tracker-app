import { faker } from '@faker-js/faker';
import type { User } from '@prisma/client'

export function userFactory(): Omit<User, 'id'> {
    return {
        email: `${faker.helpers.uniqueArray(faker.internet.email, 1)}`,
        password: faker.internet.password({ length: 10 }),
    }
}