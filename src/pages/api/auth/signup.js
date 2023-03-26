import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../../lib/auth';

export default async function handler(req, res) {

    // Loading prisma client
    let prisma = new PrismaClient();

    if (req.method !== 'POST') {
        return;
    }

    const data = req.body;
    const { email, password } = data;

    /* 유효성 검사 */
    if (
        !email ||
        !email.includes('@') ||
        !password ||
        password.trim().length < 7
    ) {
        res.status(422).json({
            message:
                'password should also be at least 7 characters long.',
            error: true,
        });
        return;
    }

    /* 이미 존재하는 계정인지 검사 */
    const existingUser = await prisma.user.findUnique({
        where: {
            email: email,
        },
        select: {
            email: true
        }
    }
    );

    if (existingUser) {
        res.status(422).json({ message: 'User Email already exists!', error: true });
        return;
    }

    const hashedPassword = await hashPassword(password);

    const result = await prisma.user.create({
        data: {
            email: email,
            password: hashedPassword,
        },
    });

    if (result) {
        res.status(201).json({ message: 'Created user!', error: false });
    } else {
        res.status(422).json({ message: 'Prisma error occured', error: true })
    }
}