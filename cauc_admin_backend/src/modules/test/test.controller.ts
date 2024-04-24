import { Controller, Get, Query } from '@nestjs/common';
import { ValidationException } from '../../error';
import { PrismaService } from '../prisma/prisma.service';
import { keys } from 'ts-transformer-keys';

@Controller('test')
export class TestController {
    constructor(
        private readonly prisma: PrismaService
    ) { }



}
