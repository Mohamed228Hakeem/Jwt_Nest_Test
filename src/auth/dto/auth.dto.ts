import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength,IsOptional, IsIn } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPassword123', description: 'User password (min 6 characters)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({example : 'admin',enum:['admin','user'],required:false})
  @IsOptional()
  @IsIn(['admin','user'])
  role?:string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'Registered email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPassword123', description: 'User password' })
  @IsString()
  password: string;
}
