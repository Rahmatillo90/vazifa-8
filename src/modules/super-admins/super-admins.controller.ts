import { Controller } from '@nestjs/common';
import { SuperAdminsService } from './super-admins.service';

@Controller('super-admins')
export class SuperAdminsController {
  constructor(private readonly superAdminsService: SuperAdminsService) {}
}
