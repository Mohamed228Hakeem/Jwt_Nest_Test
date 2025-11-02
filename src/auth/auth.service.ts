import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private prisma = new PrismaClient();

  constructor(private jwtService: JwtService) {}

  async register(email: string, password: string, role = 'user') {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword, role },
    });
    return { message: 'User registered', user };
  }
  

  async login(email: string, password: string) {

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { 
       sub: user.id,
       email: user.email,
       role:user.role};

  

    const token = await this.jwtService.signAsync(payload );

    return { access_token: token};
  }

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }


  async getAllUsers() {
    return this.prisma.user.findMany();
  }

}
