import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(email: string, password: string) {
        // checking if the email already exists in the database
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new UnauthorizedException('Email already in use');
        }

        // hashing the password
        const hash = await bcrypt.hash(password, 10);

        // creating new user in the database
        const user = await this.prisma.user.create({
            data: { email, password: hash },
        });

        // returning user info
        return { id: user.id, email: user.email };
    }

    async login(email: string, password: string) {
        // finding the user by email
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // comparing passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // creating JWT payload
        const payload = { sub: user.id, email: user.email };

        // signing in and returning the token
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
