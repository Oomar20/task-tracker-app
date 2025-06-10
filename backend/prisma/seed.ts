import { PrismaClient } from '@prisma/client'
import { userFactory } from './factories'

const prisma = new PrismaClient()

async function main() {
    const COUNT = 1_000_000

    // create an array of COUNT user records
    const users = Array.from({ length: COUNT }, () => userFactory())

    await prisma.user.createMany({
        data: users,
        skipDuplicates: true,
    })

    console.log(`seeded ${COUNT} users`)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
